import T from 'tsplate';

@T.constructor('id', 'userId', 'channelId', 'body', 'timeSent')
export class Message {
    @T.template(T.Int)
    public id: number;

    @T.template(T.Int)
    public userId: number;

    @T.template(T.Int)
    public channelId: number;

    @T.template(T.String)
    public body: string;

    @T.template(T.Date)
    public timeSent: Date;

    constructor(id: number, userId: number, channelId: number, body: string, timeSent: Date) {
        this.id = id;
        this.userId = userId;
        this.channelId = channelId;
        this.body = body;
        this.timeSent = timeSent;
    }
}

export const TMessage = T.AutoClass(Message);
