import { Channel, TChannel } from "../../common/models/channel";
import { Message, TMessage } from "../../common/models/message";
import { User, TUser } from "../../common/models/user";
import T, { Template } from 'tsplate';
import { TToken, Token } from "../../common/models/token";
import cache from "../cache/clientCache";

const apiPath = '/v1/api';
const authPath = '/v1/auth';

interface RequestOptions {
    method: 'get' | 'post';
    path: string;
    data?: any;
    body?: any;
}

interface ResponseError {
    status: number;
    statusText: string;
    message: string;
}

export interface Response<T> {
    data?: T;
    error?: ResponseError;
}

function attemptJSON(data: string): any {
    try {
        return JSON.parse(data)
    } catch {
        return null;
    }
}

async function performRequest(opts: RequestOptions): Promise<any> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(opts.method, opts.path, true);
        xhr.onload = () => {
            const data = attemptJSON(xhr.responseText);

            if (data && xhr.status >= 200 && xhr.status < 300) {
                resolve(data)
            } else {
                reject({
                    status: xhr.status,
                    statusText: data && data.title ? data.title : xhr.statusText,
                    message: data && data.message
                });
            }
        };
        xhr.onerror = () => {
            const data = attemptJSON(xhr.responseText);

            reject({
                status: xhr.status,
                statusText: data && data.title ? data.title : xhr.statusText,
                message: data && data.message
            });
        };
        if (cache.getToken()) {
            xhr.setRequestHeader('Authorization', `Bearer ${cache.getToken()}`);
        }
        if (opts.data) {
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(opts.data))
        } else if (opts.body) {
            xhr.setRequestHeader('Content-Type', 'text/plain');
            xhr.send(opts.body)
        } else {
            xhr.send();
        }
    });
}

export async function performRequestWithModel<T>(opts: RequestOptions & { template: Template<T, any> }): Promise<Response<T>> {
    try {
        const data = await performRequest(opts);
        if (opts.template.valid(data)) {
            return { data: opts.template.toModel(data) };
        } else {
            return { error: { status: 200, statusText: 'OK', message: 'Unrecognized response object' }};
        }
    } catch (error) {
        return { error };
    }
}

export const getUser = async (userId: number): Promise<Response<User>> => {
    return await performRequestWithModel({
        method: 'get',
        path: `${apiPath}/user/${userId}`,
        template: TUser
    });
};

export const batchGetUser = async(userIds: number[]): Promise<Response<User[]>> => {
    return await performRequestWithModel({
        method: 'get',
        path: `${apiPath}/user?userIds=${userIds.map(encodeURIComponent).join(',')}`,
        template: T.Array(TUser)
    });
};

export const getUserChannels = async (): Promise<Response<Channel[]>> => {
    return await performRequestWithModel({
        method: 'get',
        path: `${apiPath}/user/me/channels`,
        template: T.Array(TChannel)
    });
};

export const getChannel = async (channelId: number): Promise<Response<Channel>> => {
    return await performRequestWithModel({
        method: 'get',
        path: `${apiPath}/channel/${channelId}`,
        template: TChannel
    })
};

export const getChannelByName = async (channelName: string): Promise<Response<Channel>> => {
    return await performRequestWithModel({
        method: 'get',
        path: `${apiPath}/channel?channelName=${encodeURIComponent(channelName)}`,
        template: TChannel
    }) 
};

export const getChannelUserIds = async (channelId: number): Promise<Response<number[]>> => {
    return await performRequestWithModel({
        method: 'get',
        path: `${apiPath}/channel/${channelId}/users`,
        template: T.Array(T.Int)
    });
};

export const createChannel = async(channelName: string): Promise<Response<Channel>> => {
    return await performRequestWithModel({
        method: 'post',
        path: `${apiPath}/channel`,
        data: { channelName },
        template: TChannel
    });
};

export const joinChannel = async (channelId: number): Promise<Response<void>> => {
    return await performRequestWithModel({
        method: 'post',
        path: `${apiPath}/user/me/channels/${channelId}`,
        template: T.Any
    });
};

export const getMessages = async (channelId: number, endTime: Date, amount: number): Promise<Response<Message[]>> => {
    return await performRequestWithModel({
        method: 'get',
        path: `${apiPath}/channel/${channelId}/messages?endDate=${encodeURIComponent(endTime.toISOString())}&amount=${amount}`,
        template: T.Array(TMessage)
    });
};

export const sendMessage = async (channelId: number, body: string): Promise<Response<void>> => {
    return await performRequestWithModel({
        method: 'post',
        path: `${apiPath}/user/me/message/${channelId}`,
        body: body,
        template: T.Any
    });
};

export const logIn = async (username: string, password: string): Promise<Response<Token>> => {
    return await performRequestWithModel({
        method: 'post',
        path: `${authPath}/login`,
        data: { username, password },
        template: TToken
    });
};

export const signUp = async (username: string, password: string): Promise<Response<Token>> => {
    return await performRequestWithModel({
        method: 'post',
        path: `${authPath}/signup`,
        data: { username, password },
        template: TToken
    });
};
