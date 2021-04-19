import * as React from 'react';
import ClientMessage from '../../models/clientMessage';
import './messageItem.less';

interface MessageItemProps {
    message: ClientMessage;
}

export default ({ message }: MessageItemProps): JSX.Element => {

    const formatTimeSent = (): string => {
        return message.timeSent.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    };

    return (
        <div className="message">
            <div className="message-header">
                <div className="message-author">
                    { message.user.name }
                </div>
                <div className="message-time">
                    { formatTimeSent() }
                </div>
            </div>
            <div className="message-bodies">
                { 
                    message.bodies.map((body, i) => <div className="message-body" key={i}> {body.content} </div>) 
                }
            </div>
        </div>
    )
};
