import T from 'tsplate';

export const connect = 'connect';

@T.constructor('eventType')
export class ConnectEvent {
    @T.template(T.Enum(connect))
    public eventType: typeof connect;

    constructor(eventType: typeof connect) {
        this.eventType = connect;
    }
}

export const TConnectEvent = T.AutoClass(ConnectEvent);
