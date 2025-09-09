import { Router } from 'express';
import { getTokens, verifyRefreshToken } from '../utils/jwt.js';
import { loginValidation, signupValidation } from '../validations/auth.js';
import { checkPassword, generateHashPassword } from '../utils/password.js';
import { generateToken } from '../utils/crypto.js';
import validationErrors from '../utils/validationErrors.js';
import pool from '../config/db.js';
import mailTransporter from '../config/nodemailer.js';
import cookie from 'cookie';
import { DateTime } from 'luxon';
const router = Router();

router.post('/signup', signupValidation, validationErrors, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existUser = await pool.query('SELECT COUNT(*) FROM users WHERE email = $1', [email]);

    if (existUser.rows[0].count > 0) {
      throw new Error();
    }

    const created_at = DateTime.now().setZone('Europe/Moscow').toUnixInteger();
    const passwordHash = await generateHashPassword(password);

    const user = await pool.query(
      'INSERT INTO users (name, email, password, confirmed, role, created_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      [name, email, passwordHash, false, 'user', created_at],
    );

    const email_verification_token = generateToken(32);
    await pool.query(
      'INSERT INTO email_verification_tokens (user_id, token, created_at) VALUES ($1, $2, $3)',
      [user.rows[0].id, email_verification_token, created_at],
    );

    const mailSubject = `Подтвердите регистрацию на сайте - ${process.env.SITENAME}`;
    const mailOptions = {
      from: mailSubject + `<${process.env.NOREPLY_EMAIL}>`,
      to: email,
      subject: mailSubject,
      text: `Здравствуйте.\r\nДля завершения регистрации на ${process.env.SITENAME} перейдите по ссылке: ${process.env.CLIENT_DOMAIN}/user/confirm?token=${email_verification_token}\r\nСсылка действительна в течение часа. Если вы не регистрировались, то просто проигнорируйте это письмо.`,
    };

    mailTransporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        throw new Error();
      }
    });

    res.sendStatus(200);
  } catch (error) {
    console.warn(error);
    res.status(500).json({
      message: 'Ошибка при регистрации',
    });
  }
});

router.post('/login', loginValidation, validationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE email = $1 AND confirmed = $2', [
      email,
      true,
    ]);

    if (!user.rows || !(await checkPassword({ password, hashedPassword: user.rows[0].password }))) {
      throw new Error();
    }

    const { accessToken, refreshToken } = getTokens({
      id: user.rows[0].id,
      role: user.rows[0].role,
    });

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
    console.warn(error);
    res.status(400).json({
      message: 'Ошибка при входе',
    });
  }
});

router.post('/logout', async (req, res) => {
  try {
    res
      .setHeader(
        'Set-Cookie',
        cookie.serialize('refreshToken', '', {
          httpOnly: true,
          maxAge: 0,
          path: '/',
        }),
      )
      .sendStatus(200);
  } catch (error) {
    console.warn(error);
    res.sendStatus(400);
  }
});

router.get('/refresh', verifyRefreshToken, async (req, res) => {
  try {
    const { accessToken } = getTokens(req.user);
    res.status(200).json({ accessToken });
  } catch (error) {
    console.warn(error);
    res.sendStatus(401);
  }
});

export default router;
