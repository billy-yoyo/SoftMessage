import { Router } from 'express';
import createUserDto from '../dto/userRow';
import createChannelDto from '../dto/channelRow';
import withDb from './lib/withDb';
import T from 'tsplate';
import { TUser } from '../../common/models/user';
import { TChannel } from '../../common/models/channel';

const router = Router();

router.get('/:userId', withDb(async (connection, req, res) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
        return res.status(400).json({ message: `Invalid userId: ${req.params.userId}, must be an integer` });
    }

    const userRow = await connection.sm_user.query({ user_id: userId }).findOne();
    const user = createUserDto(userRow);

    res.status(200).json(TUser.toTransit(user));
}));

router.get('/', withDb(async (connection, req, res) => {
    const rawUserIds = req.query.userIds as string;
    
    if (!rawUserIds) {
        return res.status(400).json({ message: 'Missing userIds query parameter' });
    }

    const userIds = rawUserIds.split(',').map(parseInt);

    if (userIds.some(isNaN)) {
        return res.status(400).json({ message: 'Invalid userId, all userids must be integers' });
    }

    const userRows = await connection.sm_user.queryOr(userIds.map(id => ({ user_id: id }))).findAll();
    const users = userRows.map(createUserDto);

    res.status(200).json(T.Array(TUser).toTransit(users));
}));

router.get('/:userId/channels', withDb(async (connection, req, res) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
        return res.status(400).json({ message: `Invalid userId: ${req.params.userId}, must be an integer` });
    }

    const userChannelRows = await connection.sm_channel_users.query({ user_id: userId }).findAll();

    if (userChannelRows.length > 0) {
        const channelRows = await connection.sm_channel.queryOr(userChannelRows.map(row => ({ channel_id: row.channel_id }))).findAll();
        const channels = channelRows.map(createChannelDto);

        res.status(200).json(T.Array(TChannel).toTransit(channels));
    } else {
        res.status(200).json([]);
    }
}));

router.post('/:userId/channels/:channelId', withDb(async (connection, req, res) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
        return res.status(400).json({ message: `Invalid userId: ${req.params.userId}, must be an integer` });
    }

    const channelId = parseInt(req.params.channelId);

    if (isNaN(channelId)) {
        return res.status(400).json({ message: `Invalid channelId: ${req.params.channelId}, must be an integer` });
    }

    const userExists = await connection.sm_user.query({ user_id: userId }).exists();
    const channelExists = await connection.sm_channel.query({ channel_id: channelId }).exists();

    if (userExists && channelExists) {
        await connection.sm_channel_users.insert({ user_id: userId, channel_id: channelId });

        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
}));

export default router;