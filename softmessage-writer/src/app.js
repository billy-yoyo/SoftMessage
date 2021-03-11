const express = require('express');
const aws = require('aws-sdk');

const app = express();
const port = 3000;
const topicArn = process.env.topic_message;

const parseRawBody = (req, res, next) => {
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

app.post('/api/v1/user/:userId/message/:channelId', (req, res) => {
    const userId = req.params.userId;
    const channelId = req.params.channelId;

    if (!userId) {
        res.status(400).send('Invalid user id');
    }

    if (!channelId) {
        res.status(400).send('Invalid channel id');
    }

    const payload = {
        userId,
        channelId,
        body: req.rawBody
    };

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
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));
