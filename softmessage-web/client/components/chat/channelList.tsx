import * as React from 'react';
import ClientChannel from '../../models/clientChannel';
import ChannelItem from './channelItem';
import './channelList.less';
import * as networkService from '../../service/networkService';
import cache from '../../cache/clientCache';

interface ChannelListProps {
    channels: ClientChannel[];
    setChannels: (channels: ClientChannel[]) => void;
    selectedChannel: ClientChannel;
    setSelectedChannel: (channel: ClientChannel) => void;
}

export default ({ channels, setChannels, selectedChannel, setSelectedChannel }: ChannelListProps): JSX.Element => {
    const [creatingChannel, setCreatingChannel] = React.useState<boolean>(false);
    const [channelName, setChannelName] = React.useState<string>('');

    const addChannel = async () => {
        const newName = channelName;
        setChannelName('');
        setCreatingChannel(false);

        let clientChannel = await cache.getChannelByName(newName);

        if (!clientChannel) {
            const channelResponse = await networkService.createChannel(newName);
            if (channelResponse.error) {
                console.warn('failed to create channel:');
                console.error(channelResponse.error);
                // try and join the channel by name - it might already exist
                return;
            } 
            const channel = channelResponse.data;
            clientChannel = cache.addChannel(channel);
            channels.push(clientChannel);
            setChannels(channels);
        }
        
        await networkService.joinChannel(clientChannel.id);
        setSelectedChannel(clientChannel);
    };

    const detectEnterAndEscape = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            addChannel();
        } else if (e.key === 'Escape') {
            setCreatingChannel(false);
        }
    };

    return (
        <div className="channel-list-panel">
            <div className="channel-list-title">
                Softmessage
            </div>
            <div className="channel-list">
                {
                    channels.map(channel => <ChannelItem channel={channel} selectedChannel={selectedChannel} setSelectedChannel={setSelectedChannel} key={channel.id}/>)
                }
                {  !creatingChannel &&
                    <div className="button secondary add-channel" onClick={() => setCreatingChannel(true)}>
                        + Add Channel
                    </div>
                }
                {  creatingChannel &&
                    <input type="text" 
                        className="set-channel-name" 
                        value={channelName} 
                        onChange={e => setChannelName(e.target.value)} 
                        onKeyDown={detectEnterAndEscape} />
                }
            </div>
        </div>
        
    )
};
