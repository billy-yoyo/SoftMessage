const { Pool } = require('pg');
const pool = new Pool();

const EventHandlers = {
    'create-message': async (wss, message) => {
        const client = await pool.connect();

        const userId = message.userId;
        const channelId = message.channelId;
        const body = message.body;
        const timeSent = new Date(message.timeSent);

        const query = `
        INSERT INTO sm_message(user_id, channel_id, body, time_sent) VALUES ($1, $2, $3, $4) RETURNING *
        `.trim();
        const values = [userId, channelId, body, timeSent];
    
        console.log(`storing message ${JSON.stringify(message)}`);
    
        const result = await client.query(query, values);
        
        client.release();

        console.log('stored');

        if (result.rows) {
            const row = result.rows[0];
            const messageId = row.message_id;

            wss.sendChannel(channelId, { 
                eventType: 'message-created',
                message: { 
                     id: messageId, 
                     userId: userId, 
                     channelId: channelId, 
                     body, 
                     timeSent 
                } 
            });
        }
    },
    'user-join': async (wss, data) => {
        wss.sendChannel(data.channelId, {
            eventType: 'user-joined',
            channelId: data.channelId,
            userId: data.userId
        })
    }
};

module.exports = EventHandlers;
