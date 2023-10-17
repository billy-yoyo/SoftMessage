import { Channel } from "../../models/channel";
import { ChannelRow } from "../tables/sm_channel";

export default (channelRow: ChannelRow): Channel => {
    return new Channel(
        channelRow.channel_id,
        channelRow.channel_name
    );
};
