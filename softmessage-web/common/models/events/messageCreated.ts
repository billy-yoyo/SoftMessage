import T from 'tsplate';
import { Message, TMessage } from '../message';

export const messageCreated = 'message-created';

@T.constructor('eventType', 'message')
export class MessageCreatedEvent {
    @T.template(T.Enum(messageCreated))
    public eventType: typeof messageCreated;

    @T.template(TMessage)
    public message: Message;

    constructor(eventType: typeof messageCreated, message: Message) {
        this.eventType = messageCreated;
        this.message = message;
    }
}

export const TMessageCreatedEvent = T.AutoClass(MessageCreatedEvent);
