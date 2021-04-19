import { Channel } from "../../common/models/channel";
import { ChannelRow } from "../db/tables/sm_channel";

export default (channelRow: ChannelRow): Channel => {
    return new Channel(
        channelRow.channel_id,
        channelRow.channel_name
    );
};
