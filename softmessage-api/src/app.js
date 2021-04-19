const express = require('express');
const errorHandler = require('errorhandler');
const auth = require('./authenticate');
const apiRouter = require('./api');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 80;

app.use(errorHandler({ dumpExceptions: true, showStack: true })); 

app.get('/health', (req, res) => res.send('ok'));

app.use('/v1/auth', express.json());

app.use('/v1/api', apiRouter);
app.use('/v1/auth', auth.router);

app.use('/web', createProxyMiddleware({
    target: `http://${process.env.WEB_ADDRESS}:3000`,
    changeOrigin: true
}));

const wsProxy = createProxyMiddleware('/ws', {
    target: `http://${process.env.DIGEST_ADDRESS}:3000`,
    ws: true,
    changeOrigin: true,
    logLevel: 'debug'
});

app.use(wsProxy);

const server = app.listen(port, () => console.log(`Example app listening on port ${port}`));

server.on('upgrade', wsProxy.upgrade);
