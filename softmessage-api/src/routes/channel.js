const { Router, json } = require('express');
const { routeForwarder } = require('../forward');

const router = Router();
const forwarder = routeForwarder(router, '/v1/api/channel');

forwarder.post('web', '/', (req) => ({
    path: '/',
    json: true
}), json());

forwarder.get('web', '/', (req) => ({
    path: '',
    query: req.query
}));

forwarder.get('web', '/:channelId', (req) => ({
    path: `/${req.params.channelId}`
}));

forwarder.get('web', '/:channelId/users', (req) => ({
    path: `/${req.params.channelId}/users`
}));

forwarder.get('web', '/:channelId/messages', (req) => ({
    path: `/${req.params.channelId}/messages?endDate=${encodeURIComponent(req.query.endDate)}&amount=${encodeURIComponent(req.query.amount)}`
}));

module.exports = router;
