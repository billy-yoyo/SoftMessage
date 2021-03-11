import T from 'tsplate';

@T.constructor('id', 'userId', 'channelId', 'body')
export class Message {
    @T.template(T.String)
    public id: string;

    @T.template(T.String)
    public userId: string;

    @T.template(T.String)
    public channelId: string;

    @T.template(T.String)
    public body: string;

    constructor(id: string, userId: string, channelId: string, body: string) {
        this.id = id;
        this.userId = userId;
        this.channelId = channelId;
        this.body = body;
    }
}

export const TMessage = T.AutoClass(Message);
