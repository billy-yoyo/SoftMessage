import ClientMessage from "./clientMessage";
import ClientUser from "./clientUser";
import * as networkService from "../service/networkService";
import cache from "../cache/clientCache";
import singleton from "../cache/singletonTask";
import { EventEmitter } from "./eventEmitter";
import { Message } from "../../../softmessage-common/models/message";

const unknownUser = (userId: number) => {
    const user = new ClientUser(userId, 'Unknown User', false);
    user.isUnknown = true;
    return user;
}

export interface ChannelEvents {
    users: ClientUser[];
    messages: ClientMessage[];
    loadedFullHistory: boolean;
}

export default class ClientChannel extends EventEmitter<ChannelEvents> {
    public id: number;
    public name: string;
    public messages: ClientMessage[];
    public messageIds: {[id: number]: boolean} = {};
    public users: ClientUser[] = [];

    public loadedUsers: boolean = false;
    public loadedFullHistory: boolean = false;

    constructor(id: number, name: string, messages: ClientMessage[], users: ClientUser[]) {
        super();
        this.id = id;
        this.name = name;
        this.messages = messages;
        this.users = users;
    }

    public loadUsers = singleton(async (): Promise<void> => {
        const userIdsResponse = await networkService.getChannelUserIds(this.id);
        if (userIdsResponse.error) {
            // TODO: error handling
            return;
        }
        const userIds = userIdsResponse.data;
        this.users = await cache.getUsers(userIds);
        this.loadedUsers = true;
        // attempt to fix unknown users for messages that were loaded before the users were loaded
        this.messages.forEach(message => {
            if (message.user.isUnknown) {
                message.user = cache.getCachedUser(message.user.id) || unknownUser(message.user.id)
            }
        });
        this.emit('users', this.users);
        this.emit('messages', this.messages);
    });

    async sendMessage(body: string) {
        await networkService.sendMessage(this.id, body);
    }

    async loadMessages(endTime: Date, amount: number) {
        const messagesResponse = await networkService.getMessages(this.id, endTime, amount);
        if (messagesResponse.error) {
            // if there's an error, we assume we won't be able to get any more messages
            console.warn('failed to load message history');
            this.loadedFullHistory = true;
            this.emit('loadedFullHistory', true);
            return;
        }
        const messages = messagesResponse.data;
        const clientMessages = messages
            .filter(message => {
                if (this.messageIds[message.id]) {
                    return false;
                } else {
                    this.messageIds[message.id] = true;
                    return true;
                }
            })
            .map(message => new ClientMessage(
                message.id,
                this,
                cache.getCachedUser(message.userId) || unknownUser(message.userId),
                [{ content: message.body, timeSent: message.timeSent }],
                new Date(message.timeSent)
            ));

        if (clientMessages.length === 0) {
            this.loadedFullHistory = true;
            this.emit('loadedFullHistory', true);
        } else {
            this.messages = this.messages.concat(clientMessages);
            this.sortMessages();
        }
    }

    async loadNextMessages (amount: number): Promise<void> {
        if (this.messages.length === 0) {
            await this.loadMessages(new Date(), amount);
        } else {
            await this.loadMessages(this.messages[this.messages.length - 1].timeSent, amount);
        }
    };

    addMessage(message: Message) {
        const timeSent = new Date(message.timeSent);
        const clientMessage = new ClientMessage(
            message.id,
            this,
            cache.getCachedUser(message.userId) || unknownUser(message.userId),
            [{ content: message.body, timeSent: timeSent }],
            timeSent
        );

        this.messages.push(clientMessage);
        this.sortMessages();
    }

    addClientUser(user: ClientUser) {
        if (this.users.every(otherUser => otherUser.id !== user.id)) {
            this.users.push(user);
            // replace potential unknown users
            this.messages.forEach(message => {
                if (message.user.id === user.id) {
                    message.user = user;
                }
            });
            this.emit('users', this.users);
            this.emit('messages', this.messages);
        }
    }

    private collapseMessages() {
        let lastMessage: ClientMessage = null;
        let lastMessageTime: Date = null;
        this.messages = this.messages.filter(message => {
            if (lastMessage) {
                if (lastMessage.user.id !== message.user.id) {
                    lastMessage = message;
                    lastMessageTime = message.timeSent;
                    return true;
                }
                
                if (Math.abs(lastMessageTime.getTime() - message.timeSent.getTime()) >= 180000) {
                    lastMessage = message;
                    lastMessageTime = message.timeSent;
                    return true;
                }

                lastMessage.bodies = lastMessage.bodies.concat(message.bodies);
                lastMessageTime = message.timeSent;
                return false;
            } else {
                lastMessage = message;
                lastMessageTime = message.timeSent;
                return true;
            }
        });
    }

    private sortMessages() {
        this.messages = this.messages.sort((a, b) => b.timeSent.getTime() - a.timeSent.getTime());
        this.collapseMessages();
        this.messages.forEach(message => message.bodies.sort((a, b) => a.timeSent.getTime() - b.timeSent.getTime()));
        this.emit('messages', this.messages);
    }
}
