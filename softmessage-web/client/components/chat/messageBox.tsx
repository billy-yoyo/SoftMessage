import * as React from 'react';
import ClientChannel from '../../models/clientChannel';
import './messageBox.less';

interface MessageBoxProps {
    channel: ClientChannel;
}

export default ({ channel }: MessageBoxProps): JSX.Element => {
    const [body, setBody] = React.useState<string>();

    const sendMessage = async () => {
        const message = body;
        setBody('');
        await channel.sendMessage(message);
    };

    const detectSubmit = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <input type="text" className="message-box" onKeyDown={detectSubmit} value={body} onChange={e => setBody(e.target.value)}/>
    )
};
