import { Pool, PoolClient } from 'pg';
import Table from './table';
import sm_channel, { ChannelRow } from './tables/sm_channel';
import sm_channel_users, { ChannelUserRow } from './tables/sm_channel_users';
import sm_message, { MessageRow, MessageTable } from './tables/sm_message';
import sm_user, { UserRow } from './tables/sm_user';

interface Tables {
    sm_message: MessageTable;
    sm_channel: Table<ChannelRow>;
    sm_user: Table<UserRow>;
    sm_channel_users: Table<ChannelUserRow>;
}
export class DatabaseConnection implements Tables {
    private client: PoolClient;
    
    public sm_message: MessageTable;
    public sm_channel: Table<ChannelRow>;
    public sm_user: Table<UserRow>;
    public sm_channel_users: Table<ChannelUserRow>;
    
    constructor(client: PoolClient) {
        this.client = client;
        this.sm_message = sm_message.withClient(client);
        this.sm_channel = sm_channel.withClient(client);
        this.sm_user = sm_user.withClient(client);
        this.sm_channel_users = sm_channel_users.withClient(client);
    }

    release() {
        this.client.release();
    }
}

export class Database implements Tables {
    private pool: Pool;

    public sm_message = sm_message;
    public sm_channel = sm_channel;
    public sm_user = sm_user;
    public sm_channel_users = sm_channel_users;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async connect(): Promise<DatabaseConnection> {
        const client = await this.pool.connect();
        return new DatabaseConnection(client);
    }

    async withConnection(runner: (connection: DatabaseConnection) => Promise<void>) {
        const connection = await this.connect();
        try {
            await runner(connection);
        } finally {
            connection.release();
        }
    }
}

export default new Database(new Pool());
