import pool from '../config/db.js';
import { DateTime } from 'luxon';

// every 1 hour

const time = DateTime.now().setZone('Europe/Moscow').toUnixInteger();

const email_verification_tokens = await pool.query('SELECT * FROM email_verification_tokens');
email_verification_tokens.rows.map(async (obj) => {
  const millisecondsDiff = (time - obj.created_at) * 1000;
  const hoursDiff = millisecondsDiff / (1000 * 60 * 60);

  if (hoursDiff >= 1) {
    await pool.query('DELETE FROM email_verification_tokens WHERE id = $1', [obj.id]);
    await pool.query('DELETE FROM users WHERE id = $1', [obj.user_id]);
    await pool.query('DELETE FROM subscriptions WHERE user_id = $1', [obj.user_id]);
  }
});
