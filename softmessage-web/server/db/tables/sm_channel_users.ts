import T from 'tsplate';
import Table from '../table';

@T.constructor('channel_id', 'user_id')
export class ChannelUserRow {
    @T.template(T.Int)
    public channel_id: number;

    @T.template(T.Int)
    public user_id: number;

    constructor(channel_id: number, user_id: number) {
        this.channel_id = channel_id;
        this.user_id = user_id;
    }
}

export const TChannelUserRow = T.AutoClass(ChannelUserRow);
export default new Table<ChannelUserRow>('sm_channel_users', TChannelUserRow);
