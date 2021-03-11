import * as React from 'react';
import './chat.less';
import { Page } from './wrapper';
import ChannelComponent from '../components/chat/channel';
import ChannelList from '../components/chat/channelList';
import { Channel } from '../../common/models/Channel';

interface ChatProps {
    pageData: any;
    setPage: (page: Page, pageData?: any) => void;
}

export default ({ pageData, setPage }: ChatProps): JSX.Element => {
    const channel: Channel = new Channel('123', 'example-channel');
    const channels: Channel[] = [channel];

    return (
        <div className="chat">
            <ChannelList channels={channels}/>
            <ChannelComponent channel={channel}/>
        </div>
    )
};