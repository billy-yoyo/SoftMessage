import * as React from 'react';
import MessageList from './messageList';
import UserList from './userList';
import MessageBox from './messageBox';
import './channel.less';
import ClientChannel from '../../models/clientChannel';

interface ChannelProps {
    channel: ClientChannel;
}

export default ({ channel }: ChannelProps): JSX.Element => {
    if (!channel) {
        return <div className="channel">
            <div className="no-channel">Select a channel</div>
        </div>
    }

    const [users, setUsers] = channel.useListen('users', []);
    const [messages, setMessages] = channel.useListen('messages', []);

    if (!channel?.loadedUsers) {
        channel.loadUsers();
    } else if (channel?.messages?.length === 0) {
        channel.loadNextMessages(20);
    }

    return (
        <div className="channel">
            <div className="channel-chat">
                <MessageList channel={channel} messages={messages} />
                <MessageBox channel={channel}/>
            </div>
            <UserList users={users} />
        </div>
    )
};
