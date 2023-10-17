import * as aws from 'aws-sdk';
import { Client } from 'pg';
import migrate from './migrate';
import EventHandlers from './events';
import wss from './websocket';

const client = new Client();

aws.config.update({region: process.env.region});

const sqs = new aws.SQS();
const queueUrl = `https://sqs.${process.env.region}.amazonaws.com/${process.env.account_id}/${process.env.queue_name}`;
console.log(`queue url: ${queueUrl}`);
const queueParams = {
    MaxNumberOfMessages: 10,
    QueueUrl: queueUrl,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 0
};

wss.start();

const receiveMessage = async (sqsMessage: any) => {
    const snsMessage = JSON.parse(sqsMessage.Body);
    const message = JSON.parse(snsMessage.Message);

    const eventType = message.type;
    const eventData = message.data;

    const handler = EventHandlers[eventType];

    if (handler) {
        await handler(wss, eventData);
    } else {
        console.warn(`no handler for sns event type ${eventType}`);
    }
};

const deleteMessage = async (message: any): Promise<void> => new Promise((resolve, reject) => {
    sqs.deleteMessage({
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle
    }, (err, data) => {
        if (err) {
            console.warn(`failed to delete message ${JSON.stringify(message)}`);
        }
        // don't reject on failure, just print a warning
        resolve();
    });
});

const readMessageBatch = async (): Promise<any[]> => new Promise((resolve, reject) => {
    sqs.receiveMessage(queueParams, (err, data) => {
        if (err) {
            reject(err);
            console.warn("Received error", err);
        } else if (data.Messages) {
            resolve(data.Messages);
        } else {
            resolve([]);
        }
    });
});

const processBatch = async () => {
    const sqsMessages: any[] = await readMessageBatch();

    await Promise.all(sqsMessages.map(async (sqsMessage: any) => {
        try {
            await receiveMessage(sqsMessage);
        } catch (e) {
            console.warn(`failed to receive message, deleting anyway ${JSON.stringify(sqsMessage)}: ${e}`);
        }
        await deleteMessage(sqsMessage);
    }));
}

const processLoop = async () => {
    console.log('connecting to client...');
    await client.connect();
    console.log('migrating database...');
    await migrate(client);
    console.log('starting process loop...');
    await client.end();

    const loop = async () => {
        await processBatch();
        setTimeout(loop, 20);
    };
    
    await loop();
};

processLoop()
    .then(() => console.log('finished processing loop'))
    .catch((e) =>console.error(e));