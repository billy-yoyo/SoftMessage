const aws = require('aws-sdk');
const { Client } = require('pg');
const client = new Client();
const migrate = require('./migrate');

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

const receiveMessage = async (sqsMessage) => {
    const snsMessage = JSON.parse(sqsMessage.Body);
    const message = snsMessage.Message;

    const userId = message.userId;
    const channelId = message.channelId;
    const body = message.body;

    const query = `
    INSERT INTO sm_messages(user_id, channel_id, body) VALUES ($1, $2, $3)
    `.trim();
    const values = [userId, channelId, body];

    await client.query(query, values);
};

const deleteMessage = async (message) => new Promise((resolve, reject) => {
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

const readMessageBatch = async () => new Promise((resolve, reject) => {
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
    const sqsMessages = await readMessageBatch();

    await Promise.all(sqsMessages.map(async (sqsMessage) => {
        try {
            await receiveMessage(sqsMessage);
        } catch (e) {
            console.warn(`failed to receive message, deleting anyway ${JSON.stringify(sqsMessage)}: ${e}`);
        }
        await deleteMessage(sqsMessage);
    }));
}

// poll sqs once per second
const processLoop = async () => {
    console.log('connecting to client...');
    await client.connect();
    console.log('migrating database...');
    await migrate(client);
    console.log('starting process loop...');

    const loop = async () => {
        await processBatch();
        setTimeout(loop, 1000);
    };
    
    await loop();
};

processLoop()
    .then(() => console.log('finished processing loop'))
    .catch((e) =>console.error(e));