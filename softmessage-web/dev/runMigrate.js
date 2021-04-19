const { Client } = require('pg');
const client = new Client();
const migrate = require('./migrate');

// wait 10 secs to give db a chance to start
setTimeout(async () => {
    console.log('connecting to client...');
    await client.connect();
    console.log('migrating database...');
    await migrate(client);
    console.log('migrated.');
}, 10000);
