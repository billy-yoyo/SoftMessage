import T from 'tsplate';
import { TUser, User } from '../user';

export const userJoined = 'user-joined';

@T.constructor('eventType', 'userId', 'channelId')
export class UserJoinedEvent {
    @T.template(T.Enum(userJoined))
    public eventType: typeof userJoined;

    @T.template(T.Int)
    public userId: number;

    @T.template(T.Int)
    public channelId: number;

    constructor(eventType: typeof userJoined, userId: number, channelId: number) {
        this.eventType = userJoined;
        this.userId = userId;
        this.channelId = channelId;
    }
}

export const TUserJoinedEvent = T.AutoClass(UserJoinedEvent);
