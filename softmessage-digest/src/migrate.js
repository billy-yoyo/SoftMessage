const fs = require('fs').promises;

const MigrationPrefix = `${__dirname}/sql/`;
const MigrationScripts = [
    '00_create_message_table.sql'
];

const runMigration = async (client, migrationScript) => {
    const buffer = await fs.readFile(`${MigrationPrefix}${migrationScript}`);
    const sql = buffer.toString();
    await client.query(sql);
};

const migrate = async (client) => {
    for (const migrationScript of MigrationScripts) {
        await runMigration(client, migrationScript);
    }
};

module.exports = migrate;
