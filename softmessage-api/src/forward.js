const fetch = require('node-fetch');

const HOSTS = {
    writer: process.env.WRITER_ADDRESS,
    web: process.env.WEB_ADDRESS
};

const forward = async (opts) => {
    const req = opts.req;
    const res = opts.res;
    const host = HOSTS[opts.target];

    if (!host) {
        throw Error(`invalid target ${opts.target}`);
    }

    let url = `http://${host}:3000${opts.path}`;

    if (opts.query) {
        const queryString = Object.keys(opts.query).map(key => `${key}=${encodeURIComponent(opts.query[key])}`).join('&');
        url = `${url}?${queryString}`;
    }

    console.log(`forwarding to ${url}`);
    const fetchOpts = {...opts};
    
    delete fetchOpts.target;
    delete fetchOpts.path;
    delete fetchOpts.req;
    delete fetchOpts.res;
    delete fetchOpts.query;

    if (!fetchOpts.headers) {
        fetchOpts.headers = {};
    }

    fetchOpts.headers = {...req.headers,  ...fetchOpts.headers}

    if (fetchOpts.json) {
        fetchOpts.body = JSON.stringify(req.body);
        fetchOpts.headers['content-type'] = 'application/json';
    }

    const proxyRes = await fetch(url, fetchOpts);
    const buffer = await proxyRes.buffer();

    res.status(proxyRes.status);
    Object.entries(proxyRes.headers.raw()).forEach(([key, value]) => {
        res.append(key, value.join('; '));
    });

    if (proxyRes.status < 200 || proxyRes.status >= 400) {
        res.send(proxyRes.statusText);
    } else {
        res.send(buffer);
    }
};
exports.forward = forward;

const forwarder = (target, method, pathPrefix, generator) => {
    return async (req, res) => {
        console.log('received forwarder request...');
        let opts = generator(req);
        if (!opts.path) {
            opts.path = '';
        }
        if (pathPrefix) {
            opts.path = pathPrefix + opts.path;
        }

        if (typeof target === 'string') {
            await forward({
                req, res,
                target,
                method,
                ...opts
            });
        } else {
            for (let subtarget of target) {
                await forward({
                    req, res,
                    target: subtarget,
                    method,
                    ...opts
                });
            }
        }

        
    };
};
exports.forwarder = forwarder;

const forwardRoute = (router, method, target, path, pathPrefix, generator, middleware) => {
    console.log(`adding ${method} ${path} forwarder to ${target}`);
    return router[method](path, ...middleware, forwarder(target, method, pathPrefix, generator));
};
exports.forwardRoute = forwardRoute;

const createMethodForwarder = (router, pathPrefix, method) => {
    return (target, path, generator, ...middleware) => forwardRoute(router, method, target, path, pathPrefix, generator, middleware || []);
};
const routeForwarder = (router, pathPrefix) => {
    return {
        post: createMethodForwarder(router, pathPrefix, 'post'),
        get: createMethodForwarder(router, pathPrefix, 'get'),
        delete: createMethodForwarder(router, pathPrefix, 'delete'),
        put: createMethodForwarder(router, pathPrefix, 'put'),
        patch: createMethodForwarder(router, pathPrefix, 'patch'),
    }
};
exports.routeForwarder = routeForwarder;
