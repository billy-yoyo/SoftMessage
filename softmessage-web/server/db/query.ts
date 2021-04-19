import Table from "./table";

export class Query<T> {
    private table: Table<T>;
    private params: Partial<T>;
    private parent: Query<T>;

    constructor(table: Table<T>, params: Partial<T>, parent: Query<T>) {
        this.table = table;
        this.params = params;
        this.parent = parent;
    }

    or(params: Partial<T>): Query<T> {
        return new Query(this.table, params, this);
    }

    async findAll(): Promise<T[]> {
        return await this.table.findAll(this);
    }

    async findOne(): Promise<T> {
        return await this.table.findOne(this);
    }

    async exists(): Promise<boolean> {
        return await this.table.exists(this);
    }

    build(offset: number = 0): [string, any[]] {
        const keys: (keyof T)[] = Object.keys(this.params) as (keyof T)[];
        let whereClause = keys.map((key, index) => `${key} = $${1+offset+index}`).join(' AND ');
        let values = keys.map(key => this.params[key]);

        if (this.parent) {
            const [parentWhere, parentValues] = this.parent.build(values.length + offset);
            whereClause += ` OR ${parentWhere}`;
            values = values.concat(parentValues);
        }

        return [whereClause, values];
    }
}