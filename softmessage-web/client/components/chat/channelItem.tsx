import * as React from 'react';
import { Channel } from '../../../common/models/Channel';
import './channelItem.less';

interface ChannelItemProps {
    channel: Channel;
}

export default ({ channel }: ChannelItemProps): JSX.Element => {

    return (
        <div className="channel-item">
            { channel.name }
        </div>
    )
};
