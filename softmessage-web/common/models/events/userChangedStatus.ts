import T from 'tsplate';
import { TUser, User } from '../user';

export const userChangedStatus = 'user-changed-status';

@T.constructor('eventType', 'user')
export class UserChangedStatusEvent {
    @T.template(T.Enum(userChangedStatus))
    public eventType: typeof userChangedStatus;

    @T.template(TUser)
    public user: User;

    constructor(eventType: typeof userChangedStatus, user: User) {
        this.eventType = userChangedStatus;
        this.user = user;
    }
}

export const TUserChangedStatusEvent = T.AutoClass(UserChangedStatusEvent);
