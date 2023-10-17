import db from '../../softmessage-common/db/db';
import { TCreateMessage } from '../../softmessage-common/models/ws/createMessage';
import { TUserJoin } from '../../softmessage-common/models/ws/userJoin';
import { MessageCreatedEvent } from '../../softmessage-common/models/events/messageCreated';
import createMessageDto from '../../softmessage-common/db/dto/messageRow';
import { WebSocketServer } from './websocket';

type EventHandler = (wss: WebSocketServer, data: any) => Promise<void>;

const EventHandlers: {[key: string]: EventHandler} = {
    'create-message': async (wss: WebSocketServer, data: any) => {
        if (!TCreateMessage.valid(data)) {
            return;
        }
        const message = TCreateMessage.toModel(data);

        await db.withConnection(async (connection) => {
            const row = await connection.sm_message.insert({
                user_id: message.userId,
                channel_id: message.channelId,
                body: message.body,
                time_sent: new Date(message.timeSent)
            });

            if (row) {
                const event = new MessageCreatedEvent('message-created', createMessageDto(row));

                wss.sendChannel(row.channel_id, event)
            }
        });
    },
    'user-join': async (wss: WebSocketServer, data: any) => {
        if (!TUserJoin.valid(data)) {
            return;
        }
        const userJoin = TUserJoin.toModel(data);

        wss.sendChannel(data.channelId, {
            eventType: 'user-joined',
            channelId: userJoin.channelId,
            userId: userJoin.userId
        })
    }
};

export default EventHandlers;
