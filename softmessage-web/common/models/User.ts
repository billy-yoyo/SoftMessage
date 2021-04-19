import T from 'tsplate';

@T.constructor('id', 'name', 'isOnline')
export class User {
    @T.template(T.Int)
    public id: number;

    @T.template(T.String)
    public name: string;

    @T.template(T.Boolean)
    public isOnline: boolean;

    constructor(id: number, name: string, isOnline: boolean) {
        this.id = id;
        this.name = name;
        this.isOnline = isOnline;
    }
}

export const TUser = T.AutoClass(User);
