import ClientChannel from "./clientChannel";
import * as networkService from '../service/networkService';
import cache from '../cache/clientCache';
import singleton from "../cache/singletonTask";

export default class ClientUser {
    public id: number;
    public name: string;
    public isOnline: boolean;
    public isUnknown: boolean = false;
    private userChannels: ClientChannel[];

    constructor(id: number, name: string, isOnline: boolean) {
        this.id = id;
        this.name = name;
        this.isOnline = isOnline;
    }

    public getChannels = singleton(async (): Promise<ClientChannel[]> => {
        if (!this.userChannels) {
            const channelsResponse = await networkService.getUserChannels();
            if (channelsResponse.error) {
                if (channelsResponse.error.status === 403) {
                    throw Error('Unauthorized');
                }
                this.userChannels = [];
            }
            const channels = channelsResponse.data;
            this.userChannels = channels.map(channel => cache.getCachedChannel(channel.id) || cache.addChannel(channel));
        }
        return this.userChannels;
    });
}
