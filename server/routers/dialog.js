import { Router } from 'express';
import pool from '../config/db.js';
import { verifyAccessToken } from '../utils/jwt.js';

const router = Router();

router.get('/:slug/:type', verifyAccessToken, async (req, res) => {
  try {
    const { slug, type } = req.params;

    if (!slug || !type) {
      throw new Error();
    }

    const subscription = await pool.query('SELECT * FROM subscriptions WHERE user_id = $1', [
      req.user.id,
    ]);

    if (!subscription.rows[0] || !subscription.rows[0].is_active) {
      return res.status(400).json({
        error: 'no_subscription',
      });
    }

    const dialog = await pool.query(
      `
        SELECT * FROM dialogs d
        JOIN topics t ON d.topic_id = t.id
        WHERE t.slug = $1 AND d.type = $2
        `,
      [slug, type],
    );

    if (!dialog.rows[0]) {
      throw new Error();
    }

    res.status(200).json({
      ...dialog.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

export default router;
