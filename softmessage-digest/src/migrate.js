const fs = require('fs').promises;

const MigrationPrefix = `${__dirname}/sql/`;
const MigrationScripts = [
    '00_create_message_table.sql',
    '01_add_time_sent_column_to_messages_table.sql',
    '02_create_user_table.sql',
    '03_create_channel_table.sql',
    '04_create_channel_users_table.sql',
    '05_create_password_table.sql',
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
