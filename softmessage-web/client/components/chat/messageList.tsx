import * as React from 'react';
import ClientChannel from '../../models/clientChannel';
import ClientMessage from '../../models/clientMessage';
import MessageItem from './messageItem';
import './messageList.less';

interface MessageListProps {
    channel: ClientChannel;
    messages: ClientMessage[];
}

export default ({ channel, messages }: MessageListProps): JSX.Element => {
    const [loadedFullHistory, setLoadedFullHistory] = channel.useListen('loadedFullHistory', channel.loadedFullHistory);
    const list = React.useRef<HTMLDivElement>();

    const onScroll = (e: React.UIEvent<HTMLElement>) => {
        e.stopPropagation();

        const element = e.currentTarget;
        // the user has almost scrolled to the top
        if (element.scrollTop + element.clientHeight >= element.scrollHeight - 50) {
            if (!channel.loadedFullHistory) {
                channel.loadNextMessages(20);
            }
        }
    };

    // wait until after render to check if the scroll bar is showing - if it isn't we need to load more messages
    React.useEffect(() => {
        // if the full history isn't loaded and the list is not scrollable yet
        console.log(`scroll height: ${list.current.scrollHeight}, clientHeight: ${list.current.clientHeight}`);
        if (!channel.loadedFullHistory && list.current.scrollHeight <= list.current.clientHeight) {
            channel.loadNextMessages(20);
        }
    }, [messages, loadedFullHistory]);

    return (
        <div ref={list} className="message-list" onScroll={onScroll}>
            {
                messages.map(message => <MessageItem message={message} key={message.id} />)
            }
            { !loadedFullHistory &&
                <div className="message-list-end">
                    Loading messages...
                </div>
            }
        </div>
    )
};
