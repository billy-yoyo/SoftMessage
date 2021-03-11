import T from 'tsplate';

@T.constructor('id', 'name')
export class Channel {
    @T.template(T.String)
    public id: string;

    @T.template(T.String)
    public name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}

export const TChannel = T.AutoClass(Channel);
