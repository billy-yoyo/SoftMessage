import * as React from 'react';
import { Message } from '../../../common/models/Message';
import MessageItem from './messageItem';
import './messageList.less';

interface MessageListProps {
    messages: Message[];
}

export default ({ messages }: MessageListProps): JSX.Element => {

    return (
        <div className="message-list">
            {
                messages.map(message => <MessageItem message={message} key={message.id} />)
            }
        </div>
    )
};
