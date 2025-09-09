import pool from '../config/db.js';
import { DateTime } from 'luxon';

// every 5 minute

const time = DateTime.now().setZone('Europe/Moscow').toUnixInteger();

const subscriptions = await pool.query('SELECT * FROM subscriptions WHERE end_date < $1', [time]);

if (subscriptions.rows[0]) {
  subscriptions.rows.map(async (obj) => {
    await pool.query('DELETE FROM subscriptions WHERE user_id = $1', [obj.user_id]);
  });
}
