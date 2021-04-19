import T from 'tsplate';
import Table from '../table';

@T.constructor('channel_id', 'channel_name')
export class ChannelRow {
    @T.template(T.Int)
    public channel_id: number;

    @T.template(T.String)
    public channel_name: string;

    constructor(channel_id: number, channel_name: string) {
        this.channel_id = channel_id;
        this.channel_name = channel_name;
    }
}

export const TChannelRow = T.AutoClass(ChannelRow);
export default new Table<ChannelRow>('sm_channel', TChannelRow);
