import { Channel } from "../../common/models/channel";
import { User, TUser } from "../../common/models/user";
import ClientChannel from "../models/clientChannel";
import ClientUser from "../models/clientUser";
import * as networkService from "../service/networkService";

class ClientCache {
    private channels: {[id: number]: ClientChannel} = {};
    private users: {[id: number]: ClientUser} = {};
    private token: string;
    private me: ClientUser;

    setToken(token: string) {
        localStorage.setItem("token", token)
        this.token = token;
    }

    getToken(): string {
        if (!this.token) {
            this.token = localStorage.getItem("token");
        }
        return this.token;
    }

    setMe(user: User) {
        localStorage.setItem("me", JSON.stringify(TUser.toTransit(user)));
        this.me = this.addUser(user);
        return this.me;
    }

    getMe() {
        if (!this.me) {
            const data = localStorage.getItem("me");
            if (data) {
                const rawUser = JSON.parse(data);
                if (TUser.valid(rawUser)) {
                    this.me = this.addUser(TUser.toModel(rawUser));
                } 
            }
        }
        return this.me;
    }

    getCachedUser(userId: number): ClientUser | undefined {
        return this.users[userId];
    }

    async getUsers(userIds: number[]): Promise<ClientUser[]> {
        const users: ClientUser[] = [];
        const missingUserIds: number[] = [];
        userIds.forEach(userId => {
            if (this.users[userId]) {
                users.push(this.users[userId]);
            } else {
                missingUserIds.push(userId);
            }
        });
        if (missingUserIds.length > 0) {
            const missingUsersResponse = await networkService.batchGetUser(missingUserIds);
            if (missingUsersResponse.error) {
                // TODO: error handling
                return;
            }
            const missingUsers = missingUsersResponse.data;
            missingUsers.forEach(user => users.push(this.addUser(user)));
        }
        return users;
    }

    async getUser(userId: number): Promise<ClientUser> {
        if (this.users[userId]) {
            return this.users[userId]; 
        } else {
            const userResponse = await networkService.getUser(userId);
            if (userResponse.error) {
                // TODO: error handling
                return;
            }
            const user = userResponse.data;
            return this.addUser(user);
        }
    }

    addUser(user: User): ClientUser {
        const clientUser = new ClientUser(user.id, user.name, false);
        this.users[user.id] = clientUser;
        return clientUser;
    }

    getCachedChannel(channelId: number): ClientChannel | undefined {
        return this.channels[channelId];
    }

    getCachedChannelByName(channelName: string): ClientChannel | undefined {
        return Object.values(this.channels).find(c => c.name === channelName);
    }

    async getChannel(channelId: number): Promise<ClientChannel> {
        if (this.channels[channelId]) {
            return this.channels[channelId];
        } else  {
            const channelResponse = await networkService.getChannel(channelId);
            if (channelResponse.error) {
                // TODO: error handling
                return;
            }
            const channel = channelResponse.data;
            return this.addChannel(channel);
        }
    }

    async getChannelByName(channelName: string): Promise<ClientChannel> {
        const channel = this.getCachedChannelByName(channelName);
        if (channel) {
            return channel;
        } else {
            const channelResponse = await networkService.getChannelByName(channelName);
            if (channelResponse.error) {
                return;
            }
            return this.addChannel(channelResponse.data);
        }
    }

    addChannel(channel: Channel): ClientChannel {
        const clientChannel = new ClientChannel(channel.id, channel.name, [], []);
        this.channels[channel.id] = clientChannel;
        return clientChannel;
    }
}

const cache = new ClientCache();
export default cache;