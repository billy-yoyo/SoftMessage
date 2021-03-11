import T from 'tsplate';
import Table from '../table';

@T.constructor('message_id', 'user_id', 'channel_id', 'body')
export class MessageRow {
    @T.template(T.String)
    public message_id: string;

    @T.template(T.String)
    public user_id: string;

    @T.template(T.String)
    public channel_id: string;

    @T.template(T.String)
    public body: string;

    constructor(message_id: string, user_id: string, channel_id: string, body: string) {
        this.message_id = message_id;
        this.user_id = user_id;
        this.channel_id = channel_id;
        this.body = body;
    }
}

export const TMessageRow = T.AutoClass(MessageRow);
export default new Table<MessageRow>('sm_message', TMessageRow);
