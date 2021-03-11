import { Pool, PoolClient } from 'pg';
import Table from './table';
import sm_message, { MessageRow } from './tables/sm_message';

interface Tables {
    sm_message: Table<MessageRow>
}

class DatabaseConnection implements Tables {
    private client: PoolClient;
    
    public sm_message: Table<MessageRow>;
    
    constructor(client: PoolClient) {
        this.client = client;
        this.sm_message = sm_message.withClient(client);
    }

    release() {
        this.client.release();
    }
}

export class Database implements Tables {
    private pool: Pool;

    public sm_message = sm_message;

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
