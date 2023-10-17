import T from 'tsplate';
import Table from '../table';

@T.constructor('user_id', 'user_name', 'is_online')
export class UserRow {
    @T.template(T.Int)
    public user_id: number;

    @T.template(T.String)
    public user_name: string;

    @T.template(T.Boolean)
    public is_online: boolean;

    constructor(user_id: number, user_name: string, is_online: boolean) {
        this.user_id = user_id;
        this.user_name = user_name;
        this.is_online = is_online;
    }
}

export const TUserRow = T.AutoClass(UserRow);
export default new Table<UserRow>('sm_user', TUserRow);
