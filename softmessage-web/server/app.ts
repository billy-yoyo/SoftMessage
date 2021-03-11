import { MessageRow } from './db/tables/sm_message';
import express from 'express';
import path from 'path';
import { Message } from '../common/models/Message';
import db from './db/db';

const app = express();
const port = 3000;

const createMessageDTO = (messageRow: MessageRow): Message => {
    return new Message(
        messageRow.message_id,
        messageRow.user_id,
        messageRow.channel_id,
        messageRow.body
    );
};

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/web', express.static(path.join(__dirname, '../static')));

app.get('/v1/api/channel/:channelId/messages', async (req, res) => {
    try {
        await db.withConnection(async (connection) => {
            const rows = await connection.sm_message.findAll();
            const messages = rows.map(createMessageDTO);

            res.status(200).json(messages);
        });
    } catch(e) {
        console.error(e);
        res.status(500).send('unknown error: ' + JSON.stringify(e));
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));