import express from 'express';
import path from 'path';
import apiRouter from './api/router';

const app = express();
const port = 3000;

app.disable('etag');

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/health', (req, res) => res.send('ok'));

app.use('/web', express.static(path.join(__dirname, '../static')));

app.use('/v1/api', express.json(), apiRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}`));