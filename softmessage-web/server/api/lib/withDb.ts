import db, { DatabaseConnection } from '../../../../softmessage-common/db/db';
import * as express from 'express';

export default (handler: (connection: DatabaseConnection, req: express.Request, res: express.Response) => Promise<any>) => {
    return async (req: express.Request, res: express.Response) => {
        try {
            await db.withConnection(async (connection) => {
                await handler(connection, req, res);
            });
        } catch(e) {
            console.error(e);
            res.status(500).send('unknown error: ' + JSON.stringify(e));
        }
    };
};
