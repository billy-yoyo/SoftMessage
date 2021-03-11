import * as React from 'react';
import { Channel } from '../../../common/models/Channel';
import ChannelItem from './channelItem';
import './channelList.less';

interface ChannelListProps {
    channels: Channel[];
}

export default ({ channels }: ChannelListProps): JSX.Element => {

    return (
        <div className="channel-list">
            {
                channels.map(channel => <ChannelItem channel={channel} key={channel.id}/>)
            }
        </div>
    )
};
