const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Router } = require('express');

const pool = new Pool();
const JWT_SECRET = process.env.JWT_SECRET;

const getUserId = async (username, password) => {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM sm_password WHERE login_name = $1', [username]);
    const rows = result.rows;

    if (rows.length === 1) {
        const row = rows[0];
        const passwordHash = row.password_hash;
        const match = await bcrypt.compare(password, passwordHash);

        if (match) {
            return row.user_id;
        }
    }
    return undefined;
};

const doesLoginNameExist = async (username) => {
    const client = await pool.connect();
    const result = await client.query('SELECT 1 FROM sm_password WHERE login_name = $1', [username]);

    return result.rows.length > 0;
};

const createUser = async (username) => {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO sm_user(user_name, is_online) VALUES ($1, FALSE) RETURNING *', [username]);
    if (result.rows.length > 0) {
        return result.rows[0].user_id;
    }
};

const createPassword = async (username, userId, passwordHash) => {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO sm_password(login_name, user_id, password_hash) VALUES ($1, $2, $3) RETURNING *', [username, userId, passwordHash]);
};

const signUpUser = async (username, password) => {
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = await createUser(username);

    await createPassword(username, userId, passwordHash);
    return userId;
};

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const tokenType = authHeader && authHeader.split(' ')[0];
    const token = authHeader && authHeader.split(' ')[1];

    if (!tokenType || tokenType.toLowerCase() !== 'bearer') return res.sendStatus(401);
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403)
        }

        if (!decoded.userId) {
            console.log('missing user id in token');
            return res.sendStatus(403);
        }

        req.auth = { userId: decoded.userId };
        next();
    });
};
exports.authenticate = authenticate;

const router = Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const userId = await getUserId(username, password);

    if (userId) {
        const token = jwt.sign({ userId }, JWT_SECRET);
        res.json({
            token,
            userId
        });
    } else {
        res.status(403).send('Username or password incorrect');
    }
});

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const usernameExists = await doesLoginNameExist(username);

    if (usernameExists) {
        res.status(400).send('Username already exists');
    } else {
        const userId = await signUpUser(username, password);
        const token = jwt.sign({ userId }, JWT_SECRET);
        res.json({
            token,
            userId
        });
    }
});

router.get('/check', async (req, res) => {
    authenticate(req, res, () => {
        res.status(200).send('authenticated');
    });
});

exports.router = router;
