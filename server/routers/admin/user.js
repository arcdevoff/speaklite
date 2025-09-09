import { Router } from 'express';
import pool from '../../config/db.js';
import { updateValidation } from '../../validations/admin/user.js';
import validationErrors from '../../utils/validationErrors.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const skip = (page - 1) * limit;

    const users = await pool.query(
      `SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.confirmed,
        jsonb_build_object('is_active', s.is_active, 'end_date', s.end_date) AS subscription
      FROM
        users u
      LEFT JOIN subscriptions s ON u.id = s.user_id 
      WHERE name ILIKE $1 OR email ILIKE $1 ORDER BY id DESC LIMIT $2 OFFSET $3`,
      [`%${search ? search : ''}%`, limit, skip],
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM users WHERE name ILIKE $1 OR email ILIKE $1',
      [`%${search ? search : ''}%`],
    );

    const count = countResult.rows[0].count;
    const pages = Math.ceil(count / limit);

    let nextPage = Number(page) + 1;

    res.status(200).json({
      data: [...users.rows],
      nextPage: nextPage > pages ? null : nextPage,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

router
  .get('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

      delete user.rows[0].password;

      res.status(200).json({ ...user.rows[0] });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  })
  .patch('/:id', updateValidation, validationErrors, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, role } = req.body;

      const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

      if (!user.rows[0]) {
        throw new Error();
      }

      if (user.rows[0].email !== email) {
        const isBusyEmail = await pool.query('SELECT COUNT(*) FROM users WHERE email = $1', [
          email,
        ]);

        if (isBusyEmail.rows[0].count > 0) {
          return res.status(400).json({
            message: 'E-mail занят',
          });
        }
      }

      await pool.query('UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4', [
        name,
        email,
        role,
        id,
      ]);

      res.status(200).json({
        message: 'Успшено',
      });
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  })
  .delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      await pool.query('DELETE FROM email_verification_tokens WHERE user_id = $1', [id]);
      await pool.query('DELETE FROM subscriptions WHERE user_id = $1', [id]);
      await pool.query('DELETE FROM users WHERE id = $1', [id]);

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });

export default router;
