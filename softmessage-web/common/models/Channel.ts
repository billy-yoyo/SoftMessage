import T from 'tsplate';

@T.constructor('id', 'name')
export class Channel {
    @T.template(T.Int)
    public id: number;

    @T.template(T.String)
    public name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}

export const TChannel = T.AutoClass(Channel);
