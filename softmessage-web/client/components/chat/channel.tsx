import * as React from 'react';
import { Channel } from '../../../common/models/Channel';
import MessageList from './messageList';
import UserList from './userList';
import MessageBox from './messageBox';
import './channel.less';
import { User } from '../../../common/models/User';
import { Message } from '../../../common/models/Message';

interface ChannelProps {
    channel: Channel;
}

export default ({ }: ChannelProps): JSX.Element => {
    const users: User[] = [];
    const messages: Message[] = [];

    return (
        <div className="channel">
            <div className="channel-chat">
                <MessageList messages={messages} />
                <MessageBox />
            </div>
            <UserList users={users} />
        </div>
    )
};
