import { Router } from 'express';
import { addValidation } from '../../validations/admin/dialog.js';
import validationErrors from '../../utils/validationErrors.js';
import pool from '../../config/db.js';

const router = Router();

router
  .get('/', async (req, res) => {
    try {
      const { page, limit, search } = req.query;
      const skip = (page - 1) * limit;

      const dialogs = await pool.query(
        `SELECT topics.name, topics.language, topics.slug, dialogs.*
         FROM dialogs
         JOIN topics ON dialogs.topic_id = topics.id
         WHERE topics.name ILIKE $1
         ORDER BY id DESC LIMIT $2 OFFSET $3;
        `,
        [`%${search ? search : ''}%`, limit, skip],
      );

      const countResult = await pool.query(
        `SELECT COUNT(*)
        FROM dialogs
        JOIN topics ON dialogs.topic_id = topics.id
        WHERE topics.name ILIKE $1
        `,
        [`%${search ? search : ''}%`],
      );

      const count = countResult.rows[0].count;
      const pages = Math.ceil(count / limit);

      let nextPage = Number(page) + 1;

      res.status(200).json({
        data: [...dialogs.rows],
        nextPage: nextPage > pages ? null : nextPage,
      });
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  })
  .post('/', addValidation, validationErrors, async (req, res) => {
    try {
      const { type, topic, text } = req.body;

      await pool.query(`INSERT INTO dialogs (text, type, topic_id) VALUES ($1, $2, $3)`, [
        text,
        type,
        topic,
      ]);

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  });

router
  .get('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const dialog = await pool.query('SELECT * FROM dialogs WHERE id = $1', [id]);

      res.status(200).json({ ...dialog.rows[0] });
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  })
  .patch('/:id', addValidation, validationErrors, async (req, res) => {
    try {
      const { id } = req.params;
      const { type, topic, text } = req.body;

      await pool.query('UPDATE dialogs SET type = $1, text = $2, topic_id = $3 WHERE id = $4', [
        type,
        text,
        topic,
        id,
      ]);

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  })
  .delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      await pool.query('DELETE FROM dialogs WHERE id = $1', [id]);

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  });

export default router;
