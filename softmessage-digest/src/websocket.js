const WebSocket = require('ws');
const express = require('express');
const { Pool } = require('pg');
const pool = new Pool();
const { createServer } = require('http');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/health', (req, res) => res.send('ok'));

const server = createServer(app);
const wss = new WebSocket.Server({ server });

class WebSocketConnection {
    constructor(ws, connections) {
        this.ws = ws;
        this.userId = null;

        this.ws.on('message', (message) => {
            // message should just be a JWT token
            jwt.verify(message, process.env.JWT_SECRET, (err, decoded) => {
                if (err || !decoded.userId) {
                    this.ws.close();
                } else {
                    this.userId = decoded.userId;
                    connections[this.userId] = this;
                }
            });
        });

        ws.on('close', () => {
            if (this.userId && connections[this.userId]) {
                delete connections[this.userId];
            }
        });

        ws.send(JSON.stringify({ eventType: 'connect' }));
    }

    send(event) {
        this.ws.send(JSON.stringify(event));
    }
}

class WebSocketServer {
    start() {
        this.connections = {};

        wss.on('connection', (ws) => {
            console.log('user connected');
            new WebSocketConnection(ws, this.connections);
        });

        server.listen(3000, function () {
            console.log(`Listening on http://localhost:3000`);
        });
    }

    sendUser(userId, event) {
        const connection = this.connections[userId];
        if (connection) {
            console.log(`sending event to ${userId} who has an active connection`);
            connection.send(event);
        }
    }

    async sendChannel(channelId, event) {
        const userIds = await this.getUsersForChannel(channelId);
        console.log(`sending event ${JSON.stringify(event)} to channel ${channelId} with users ${userIds.join(', ')}`);
        userIds.forEach(userId => this.sendUser(userId, event));
    }

    async getUsersForChannel(channelId) {
        const client = await pool.connect();
        const query = `SELECT * FROM sm_channel_users WHERE channel_id = $1`;
        const result = await client.query(query, [channelId]);
        const userIds = [];

        for (const row of result.rows) {
            userIds.push(row.user_id);
        }

        client.release();

        return userIds; 
    }
}

module.exports = new WebSocketServer();