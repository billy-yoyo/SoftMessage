import * as React from 'react';
import ClientChannel from '../../models/clientChannel';
import './channelItem.less';

interface ChannelItemProps {
    channel: ClientChannel;
    selectedChannel: ClientChannel;
    setSelectedChannel: (channel: ClientChannel) => void;
}

export default ({ channel, selectedChannel, setSelectedChannel }: ChannelItemProps): JSX.Element => {

    const onClick = () => {
        setSelectedChannel(channel);
    };

    return (
        <div className={'channel-item' + (channel.id === selectedChannel?.id ? ' selected' : '')} onClick={onClick}>
            { channel.name }
        </div>
    )
};
