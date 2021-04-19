import { Event, TEvent, EventType } from '../../common/models/event';
import cache from '../cache/clientCache';
import ClientMessage from '../models/clientMessage';
import ClientUser from '../models/clientUser';

const EventHandlers: {[K in keyof EventType]: (event: (EventType)[K], connection: WebSocketConnection) => void} = {
    'message-created': async (event) => {
        const message = event.message;
        const channel = cache.getCachedChannel(message.channelId);
        // ignore messages from channels we don't have cached - we'll load them later
        if (channel) {
            console.log('adding message to channel...');
            channel.addMessage(message);
        } else {
            console.log(`ignoring message from unknown channel ${message.channelId}`);   
        }
    },
    'user-changed-status': async (event) => {
        const user = cache.getCachedUser(event.user.id);
        // ignore changed status events from users we don't know about
        if (user) {
            user.isOnline = event.user.isOnline;
        }
    },
    'user-joined': async (event) => {
        const channel = cache.getCachedChannel(event.channelId);
        // ignore messages from channels we don't have cached - we'll load them later
        if (channel) {
            await cache.getUser(event.userId);
        }
    },
    'connect': async (_, connection) => {
        connection.socket.send(cache.getToken());
    }
};

class WebSocketConnection {
    public socket: WebSocket;
    public setMessages: (messages: ClientMessage[]) => void;
    public setUsers: (users: ClientUser[]) => void;

    receiveEvent(event: Event) {
        EventHandlers[event.eventType](event as any, this);
    }

    connect() {
        this.ensureDisconnected();
        this.socket = new WebSocket(`ws://${location.host}/ws`);
        this.socket.addEventListener('message', (message) => {
            console.log(`received message ${message.data}`);
            const data = JSON.parse(message.data);
            if (TEvent.valid(data)) {
                const event = TEvent.toModel(data);
                this.receiveEvent(event);
            }
        });
        this.socket.addEventListener('close', () => {
            console.log('websocket disconnected, attempting to reconnect');
            this.socket = undefined;

            // attempt to reconnect after a second
            setTimeout(() => this.connect(), 1000);
        });
    }

    ensureConnected() {
        if (!this.socket) {
            this.connect();
        }
    }

    ensureDisconnected() {
        if (this.socket) {
            try {
                this.socket.close();
            } catch {
                console.warn('failed to close websocket');
            }
        }
    }
}

export default new WebSocketConnection();