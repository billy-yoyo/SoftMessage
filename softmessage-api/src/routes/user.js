const { Router } = require('express');
const { routeForwarder } = require('../forward');
const parseRawBody = require('../parseRawBody');

const router = Router();
const forwarder = routeForwarder(router, '/v1/api/user');

forwarder.post('writer', '/me/message/:channelId', (req) => ({
    path: `/${req.auth.userId}/message/${req.params.channelId}`,
    body: req.rawBody 
}), parseRawBody);

forwarder.get('web', '/:userId', (req) => ({
    path: `/${req.params.userId}`
}));

forwarder.get('web', '/', (req) => ({
    path: `?userIds=${encodeURIComponent(req.query.userIds)}`
}));

forwarder.get('web', '/me/channels', (req) => ({
    path: `/${req.auth.userId}/channels`
}));

forwarder.post(['web', 'writer'], '/me/channels/:channelId', (req) => ({
    path: `/${req.auth.userId}/channels/${req.params.channelId}`
}));

module.exports = router;