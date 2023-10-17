import WebSocket from 'ws';
import express from 'express';
import db from '../../softmessage-common/db/db';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import { Event } from '../../softmessage-common/models/event';

const app = express();

app.get('/health', (req, res) => res.send('ok'));

const server = createServer(app);
const wss = new WebSocket.Server({ server });

export class WebSocketConnection {
    private ws: WebSocket;
    private userId: number | null;

    constructor(ws: WebSocket, connections: {[id: number]: WebSocketConnection}) {
        this.ws = ws;
        this.userId = null;

        this.ws.on('message', (message) => {
            // message should just be a JWT token
            jwt.verify(message.toString(), process.env.JWT_SECRET, (err, decoded: { userId?: number }) => {
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

    send(event: Event) {
        this.ws.send(JSON.stringify(event));
    }
}

export class WebSocketServer {
    private connections: {[id: number]: WebSocketConnection} = {};

    start() {
        wss.on('connection', (ws) => {
            console.log('user connected');
            new WebSocketConnection(ws, this.connections);
        });

        server.listen(3000, function () {
            console.log(`Listening on http://localhost:3000`);
        });
    }

    sendUser(userId: number, event: Event) {
        const connection = this.connections[userId];
        if (connection) {
            console.log(`sending event to ${userId} who has an active connection`);
            connection.send(event);
        }
    }

    async sendChannel(channelId: number, event: Event) {
        const userIds = await this.getUsersForChannel(channelId);
        console.log(`sending event ${JSON.stringify(event)} to channel ${channelId} with users ${userIds.join(', ')}`);
        userIds.forEach(userId => this.sendUser(userId, event));
    }

    async getUsersForChannel(channelId: number) {
        const connection = await db.connect();
        try {
            const channelUsers = await connection.sm_channel_users.query({ channel_id: channelId }).findAll();

            const userIds = channelUsers.map(user => user.user_id);
            return userIds;
        } finally {
            await connection.release();
        }
    }
}

export default new WebSocketServer();