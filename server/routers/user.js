import { Router } from 'express';
import cookie from 'cookie';
import pool from '../config/db.js';
import { getTokens, verifyAccessToken } from '../utils/jwt.js';
import validationErrors from '../utils/validationErrors.js';
import { confirmValidation } from '../validations/user.js';
import { v4 as uuidv4 } from 'uuid';
import { DateTime } from 'luxon';
import jwt from 'jsonwebtoken';
const router = Router();

// /users/profile
router.get('/profile', verifyAccessToken, async (req, res) => {
  try {
    let user = await pool.query(
      `SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        jsonb_build_object('is_active', s.is_active, 'end_date', s.end_date) AS subscription
      FROM
        users u
      LEFT JOIN
        subscriptions s ON u.id = s.user_id
      WHERE
        u.id = $1`,
      [req.user.id],
    );

    if (!user.rows[0]) {
      throw new Error();
    }

    delete user.rows[0].password;

    res.status(200).json({
      ...user.rows[0],
    });
  } catch (error) {
    console.warn(error);
    res.sendStatus(401);
  }
});

// /users/confirm
router.post('/confirm', confirmValidation, validationErrors, async (req, res) => {
  try {
    const { token } = req.body;

    const email_verification = await pool.query(
      'SELECT * FROM email_verification_tokens WHERE token = $1',
      [token],
    );

    if (!email_verification.rows[0]) {
      throw new Error();
    }

    const user = await pool.query(
      'UPDATE users SET confirmed = $1 WHERE id = $2 RETURNING id, role',
      [true, email_verification.rows[0].user_id],
    );
    await pool.query('DELETE FROM email_verification_tokens WHERE id = $1', [
      email_verification.rows[0].id,
    ]);

    const { accessToken, refreshToken } = getTokens({
      id: user.rows[0].id,
      role: user.rows[0].role,
    });

    const currentDate = DateTime.now().setZone('Europe/Moscow');
    const start_date = currentDate.toUnixInteger();
    const end_date = currentDate.plus({ days: 7 }).toUnixInteger();

    await pool.query(
      'INSERT INTO subscriptions (user_id, start_date, end_date, is_active) VALUES ($1, $2, $3, $4)',
      [user.rows[0].id, start_date, end_date, true],
    );

    res
      .status(200)
      .setHeader(
        'Set-Cookie',
        cookie.serialize('refreshToken', refreshToken, {
          httpOnly: true,
          maxAge: process.env.REFRESH_TOKEN_AGE,
          path: '/',
        }),
      )
      .json({
        accessToken,
      });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.post('/subscribe', verifyAccessToken, async (req, res) => {
  try {
    const idempotenceKey = uuidv4();
    const url = 'https://api.yookassa.ru/v3/payments';

    const token = jwt.sign({ id: req.user.id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: 240,
    });

    console.log(token);

    const auth = Buffer.from(
      process.env.YOOKASSA_SHOP_ID + ':' + process.env.YOOKASSA_SECRET_KEY,
    ).toString('base64');
    const data = {
      save_payment_method: false,
      amount: {
        value: 99,
        currency: 'RUB',
      },
      capture: true,
      confirmation: {
        type: 'redirect',
        return_url: process.env.CLIENT_DOMAIN + '/user/subscribed',
      },
      metadata: {
        token,
      },
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Idempotence-Key': idempotenceKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, requestOptions);
    const json = await response.json();

    if (response.status !== 200 || !json.confirmation.confirmation_url) {
      throw new Error();
    }

    return res.status(200).json({
      redirect: json.confirmation.confirmation_url,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router.post('/subscribe/17e69b2ccc9d0f99cc570dab186bab7c/hook', async (req, res) => {
  try {
    const body = req.body;

    if (body.event === 'payment.succeeded') {
      const decoded = jwt.verify(body.object.metadata.token, process.env.JWT_ACCESS_SECRET);
      const user_id = decoded.id;

      const currentDate = DateTime.now().setZone('Europe/Moscow');
      const start_date = currentDate.toUnixInteger();
      const end_date = currentDate.plus({ days: 31 }).toUnixInteger();

      await pool.query(
        'INSERT INTO subscriptions (user_id, start_date, end_date, is_active) VALUES ($1, $2, $3, $4)',
        [user_id, start_date, end_date, true],
      );

      return res.sendStatus(200);
    }

    res.sendStatus(400);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

export default router;
