import { Router } from 'express';
import withDb from './lib/withDb';
import createChannelDto from '../dto/channelRow';
import createMessageDto from '../dto/messageRow';
import { TCreateChannel } from '../../common/models/createChannel';
import { TChannel } from '../../common/models/channel';
import T from 'tsplate';
import { TMessage } from '../../common/models/message';

const router = Router();

router.post('/', withDb(async (connection, req, res) => {
    if (!TCreateChannel.valid(req.body)) {
        return res.status(400).json({ message: `Invalid request body` });
    }

    const channelName = req.body.channelName;
    const channelRow = await connection.sm_channel.insert({ channel_name: channelName });
    const channel = createChannelDto(channelRow);

    res.status(200).json(TChannel.toTransit(channel))
}));

router.get('/', withDb(async (connection, req, res) => {
    const channelName = req.query.channelName as string;

    if (!channelName) {
        res.status(400).json({ message: `Must specify a channel name to search by` });
    }

    const channelRow = await connection.sm_channel.query({ channel_name: channelName }).findOne();
    const channel = createChannelDto(channelRow);

    res.status(200).json(TChannel.toTransit(channel));
}));

router.get('/:channelId', withDb(async (connection, req, res) => {
    const channelId = parseInt(req.params.channelId);

    if (isNaN(channelId)) {
        return res.status(400).json({ message: `Invalid channelId: ${req.params.channelId}, must be an integer` });
    }

    const channelRow = await connection.sm_channel.query({ channel_id: channelId }).findOne();
    const channel = createChannelDto(channelRow);

    res.status(200).json(TChannel.toTransit(channel));
}));

router.get('/:channelId/users', withDb(async (connection, req, res) => {
    const channelId = parseInt(req.params.channelId);

    if (isNaN(channelId)) {
        return res.status(400).json({ message: `Invalid channelId: ${req.params.channelId}, must be an integer` });
    }

    const userChannelRows = await connection.sm_channel_users.query({ channel_id: channelId }).findAll();

    if (userChannelRows.length > 0) {
        const userRows = await connection.sm_user.queryOr(userChannelRows.map(row => ({ user_id: row.user_id }))).findAll();
        const userIds = userRows.map(row => row.user_id);

        res.status(200).json(userIds);
    } else {
        res.status(200).json([]);
    }
}));

router.get('/:channelId/messages', withDb(async (connection, req, res) => {
    if (!req.query.endDate) {
        return res.status(400).json({ message: 'Missing endDate query parameter' });
    }

    if (!req.query.amount) {
        return res.status(400).json({ message: 'Missing amount query parameter' });
    }

    const endDate = new Date(req.query.endDate as string);

    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: 'Invalid endDate parameter, must be a valid datestring' });
    }

    const amount = parseInt(req.query.amount as string);

    if (isNaN(amount)) {
        return res.status(400).json({ message: 'Invalid amount parameter, must be an integer' });
    }

    const messageRows = await connection.sm_message.getMessagesBefore(endDate, amount);
    const messages = messageRows.map(createMessageDto);

    res.status(200).json(T.Array(TMessage).toTransit(messages));
}));


export default router;