import T, { ModelType } from 'tsplate';
import { connect, ConnectEvent, TConnectEvent } from './events/connect';
import { messageCreated, MessageCreatedEvent, TMessageCreatedEvent } from './events/messageCreated';
import { userChangedStatus, TUserChangedStatusEvent, UserChangedStatusEvent } from './events/userChangedStatus';
import { userJoined, TUserJoinedEvent, UserJoinedEvent } from './events/userJoined';

export interface EventType {
    [messageCreated]: MessageCreatedEvent,
    [userChangedStatus]: UserChangedStatusEvent,
    [userJoined]: UserJoinedEvent,
    [connect]: ConnectEvent
};

export const TEvent = T.Union(
    TMessageCreatedEvent,
    T.Union(
        TUserJoinedEvent,
        T.Union(
            TUserChangedStatusEvent,
            TConnectEvent,
            (m): m is UserChangedStatusEvent => m.eventType === 'user-changed-status'
        ),
        (m): m is UserJoinedEvent => m.eventType === 'user-joined'
    ),
    (m): m is MessageCreatedEvent => m.eventType === 'message-created'
);
export type Event = ModelType<typeof TEvent>;
