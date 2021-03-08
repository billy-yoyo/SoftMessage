const express = require('express');
const { Pool } = require('pg');
const pool = new Pool();
const app = express();
const port = 3000;

const createMessageDTO = (messageRow) => {
    return {
        messageId: messageRow.message_id,
        userId: messageRow.user_id,
        channelId: messageRow.channel_id,
        body: messageRow.body
    };
};

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/messages', async (req, res) => {
    console.log('handling /messages request');
    const client = await pool.connect();
    console.log('connecting to client');

    try {
        console.log('selecting rows...');
        const { rows } = await client.query('SELECT * FROM sm_message');
        console.log(`selected rows ${JSON.stringify(rows)}`);
        const messages = rows.map(createMessageDTO);
        console.log('closing client');
        await client.end();

        console.log(`responding with messages ${JSON.stringify(messages)}`)
        res.status(200).json(messages);
    } catch(e) {
        console.error(e);
        res.status(500).send('unknown error: ' + JSON.stringify(e));
    } finally {
        client.release();
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));