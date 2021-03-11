import * as React from 'react';
import { Message } from '../../../common/models/Message';
import './messageItem.less';

interface MessageItemProps {
    message: Message;
}

export default ({ message }: MessageItemProps): JSX.Element => {

    return (
        <div className="message">
            { message.body }
        </div>
    )
};
