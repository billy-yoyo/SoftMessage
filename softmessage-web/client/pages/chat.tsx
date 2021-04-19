import * as React from 'react';
import './chat.less';
import { Page } from './wrapper';
import Channel from '../components/chat/channel';
import ChannelList from '../components/chat/channelList';
import ClientChannel from '../models/clientChannel';
import ClientUser from '../models/clientUser';
import cache from '../cache/clientCache';
import websocketService from '../service/websocketService';

export interface ChatPageData {
    user: ClientUser;
}
interface ChatProps {
    setPage: (page: Page) => void;
}

export default ({ setPage }: ChatProps): JSX.Element => {    
    const user = cache.getMe();
    const [channels, setChannels] = React.useState<ClientChannel[]>([]);
    const [channel, setChannel] = React.useState<ClientChannel>(null);

    user.getChannels()
        .then(setChannels)
        // an error means we're unauthorized
        .catch(() => setPage('login'));

    websocketService.ensureConnected();

    return (
        <div className="chat">
            <ChannelList channels={channels} setChannels={setChannels} selectedChannel={channel} setSelectedChannel={setChannel}/>
            <Channel channel={channel}/>
        </div>
    )
};