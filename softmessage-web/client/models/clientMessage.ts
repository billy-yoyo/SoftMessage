import ClientChannel from "./clientChannel";
import ClientUser from "./clientUser";

interface ClientMessageBody {
    content: string;
    timeSent: Date;
}

export default class ClientMessage {
    public id: number;
    public channel: ClientChannel;
    public user: ClientUser;
    public bodies: ClientMessageBody[];
    public timeSent: Date;

    constructor(id: number, channel: ClientChannel, user: ClientUser, bodies: ClientMessageBody[], timeSent: Date) {
        this.id = id;
        this.channel = channel;
        this.user = user;
        this.bodies = bodies;
        this.timeSent = timeSent;
    }
}
