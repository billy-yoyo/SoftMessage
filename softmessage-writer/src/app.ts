import express from 'express';
import aws from 'aws-sdk';

const app = express();
const port = 3000;
const topicArn = process.env.topic_message;

type RawBodyRequest = express.Request & { rawBody?: string };

const parseRawBody = (req: RawBodyRequest, res: express.Response, next: () => void) => {
    req.setEncoding('utf8');
    req.rawBody = '';
    req.on('data', (chunk) => {
        req.rawBody += chunk;
    });
    req.on('end', () => {
        next();
    });
}

app.use(parseRawBody);

aws.config.update({region: process.env.region});

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/health', (req, res) => res.send('ok'));

const publish = (res: express.Response, payload: any) => {
    console.log(`publishing message ${JSON.stringify(payload)} to sns`);
    
    new aws.SNS().publish({
        TopicArn: topicArn,
        Message: JSON.stringify(payload)
    }).promise().then((data) => {
        res.status(200).send(`Message sent: ${JSON.stringify(data)}`);
    }).catch((e) => {
        res.status(500).send(`Failed to send message: ${e}`);
        console.warn(e);
    });
};

app.post('/v1/api/user/:userId/message/:channelId', (req: RawBodyRequest, res) => {
    const userId = parseInt(req.params.userId);
    const channelId = parseInt(req.params.channelId);

    if (!userId || isNaN(userId)) {
        res.status(400).send('Invalid user id');
    }

    if (!channelId || isNaN(channelId)) {
        res.status(400).send('Invalid channel id');
    }

    publish(res, {
        type: 'create-message',
        data: {
            userId,
            channelId,
            body: req.rawBody,
            timeSent: new Date().toISOString()
        }
    });
});

app.post('/v1/api/user/:userId/channels/:channelId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const channelId = parseInt(req.params.channelId);

    if (!userId || isNaN(userId)) {
        res.status(400).send('Invalid user id');
    }

    if (!channelId || isNaN(channelId)) {
        res.status(400).send('Invalid channel id');
    }

    publish(res, {
        type: 'user-join',
        data: {
            userId,
            channelId
        }
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));
