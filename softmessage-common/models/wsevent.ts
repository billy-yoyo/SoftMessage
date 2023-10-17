import T, { ModelType } from 'tsplate';
import { userJoin, UserJoin, TUserJoin } from './ws/userJoin';
import { createMessage, CreateMessage, TCreateMessage } from './ws/createMessage';

const TUserJoinEvent = T.Object({
    type: T.Enum(userJoin), data: TUserJoin
});
type UserJoinEvent = ModelType<typeof TUserJoinEvent>;

const TCreateMessageEvent = T.Object({
    type: T.Enum(createMessage), data: TCreateMessage
});

export const TWSEvent = T.Union(
    TUserJoinEvent,
    TCreateMessageEvent,
    (m): m is UserJoinEvent => m.type === 'user-join'
);
export type WSEvent = ModelType<typeof TWSEvent>;

