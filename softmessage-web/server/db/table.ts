import { PoolClient, QueryResult } from 'pg';
import { Template } from 'tsplate';
import { Query } from './query';

export default class Table<T> {
    protected name: string;
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

    async allRows(client?: PoolClient): Promise<T[]> {
        const result: QueryResult = await this.getClient(client).query(`SELECT * FROM ${this.name}`);
        return this.convertResultRows(result);
    }

    async findAll(query: Query<T>, client?: PoolClient): Promise<T[]> {
        const [where, values] = query.build();
        const queryString = `SELECT * FROM ${this.name} WHERE ${where}`;
        console.log(`Query: ${queryString}`);
        const result: QueryResult = await this.getClient(client).query(
            queryString,
            values
        );
        return this.convertResultRows(result);
    }

    async findOne(query: Query<T>, client?: PoolClient): Promise<T> {
        const results = await this.findAll(query, client);
        if (results.length !== 1) {
            throw Error('attempted to find single row, but multiple rows matched criteria');
        }
        return results[0];
    }

    async exists(query: Query<T>, client?: PoolClient): Promise<boolean> {
        const results = await this.findAll(query, client);
        return results.length > 0;
    }

    query(params: Partial<T>): Query<T> {
        return new Query(this, params, undefined);
    }

    queryOr(paramArray: Partial<T>[]): Query<T> {
        if (paramArray.length === 0) {
            throw Error('cannot create or query with no parameters');
        }

        let query = this.query(paramArray[0]);
        paramArray.slice(1).forEach(param => query = query.or(param));
        return query;
    }

    async insert(params: Partial<T>, client?: PoolClient): Promise<T> {
        const keys: string[] = [];
        const values: any[] = [];

        Object.entries(params).forEach(([key, value]) => {
            keys.push(key);
            values.push(value);
        });
        
        const valueIndicies: string[] = values.map((_, i) => `$${i+1}`);

        const queryString = `INSERT INTO ${this.name}(${keys.join(', ')}) VALUES (${valueIndicies.join(', ')}) RETURNING *`;
        console.log(`Query: ${queryString}`);
        const result: QueryResult = await this.getClient(client).query(
            queryString,
            values
        );
        const rows = this.convertResultRows(result);

        if (rows.length !== 1) {
            throw Error('insert returned multiple rows for some reason?');
        }
        return rows[0];
    }

    protected convertResultRows(result: QueryResult): T[] {
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

    protected getClient(client?: PoolClient): PoolClient {
        return client || this.client;
    }
}