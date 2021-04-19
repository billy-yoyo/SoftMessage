import { MessageRow } from "../db/tables/sm_message";
import { Message } from "../../common/models/message";

export default (messageRow: MessageRow): Message => {
    return new Message(
        messageRow.message_id,
        messageRow.user_id,
        messageRow.channel_id,
        messageRow.body,
        messageRow.time_sent
    );
};
