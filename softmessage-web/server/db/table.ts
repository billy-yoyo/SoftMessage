import { PoolClient, QueryResult } from 'pg';
import { Template } from 'tsplate';

export default class Table<T> {
    private name: string;
    private rowTemplate: Template<T, any>;
    private client: PoolClient;

    constructor(name: string, rowTemplate: Template<T, any>, client?: PoolClient) {
        this.name = name;
        this.rowTemplate = rowTemplate;
        this.client = client;
    }

    withClient(client: PoolClient) {
        return new Table(this.name, this.rowTemplate, client);
    }

    async findAll(client?: PoolClient): Promise<T[]> {
        const result: QueryResult = await this.getClient(client).query(`SELECT * FROM ${this.name}`);
        const rows: T[] = [];

        for (const row of result.rows) {
            if (this.rowTemplate.valid(row)) {
                rows.push(this.rowTemplate.toModel(row));
            } else {
                console.warn(`invalid row ${JSON.stringify(row)}`);
            }
        }

        return rows;
    }

    private getClient(client?: PoolClient): PoolClient {
        return client || this.client;
    }
}