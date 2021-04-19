import { PoolClient, QueryResult } from 'pg';
import T from 'tsplate';
import Table from '../table';

@T.constructor('message_id', 'user_id', 'channel_id', 'body', 'time_sent')
export class MessageRow {
    @T.template(T.Int)
    public message_id: number;

    @T.template(T.Int)
    public user_id: number;

    @T.template(T.Int)
    public channel_id: number;

    @T.template(T.String)
    public body: string;

    @T.template(T.Any)
    public time_sent: Date;

    constructor(message_id: number, user_id: number, channel_id: number, body: string, time_sent: Date) {
        this.message_id = message_id;
        this.user_id = user_id;
        this.channel_id = channel_id;
        this.body = body;
        this.time_sent = time_sent;
    }
}

export const TMessageRow = T.AutoClass(MessageRow);

export class MessageTable extends Table<MessageRow> {
    constructor(client?: PoolClient) {
        super('sm_message', TMessageRow, client);
    }

    async getMessagesBefore(endDate: Date, amount: number, client?: PoolClient): Promise<MessageRow[]> {
        const result: QueryResult = await this.getClient(client).query(
            `SELECT * FROM ${this.name} WHERE time_sent < $1 ORDER BY time_sent DESC LIMIT $2`,
            [endDate, amount]
        );

        return this.convertResultRows(result);
    }

    withClient(client: PoolClient) {
        return new MessageTable(client);
    }
}

export default new MessageTable();
