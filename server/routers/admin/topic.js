import { Router } from 'express';
import { addValidation } from '../../validations/admin/topic.js';
import validationErrors from '../../utils/validationErrors.js';
import pool from '../../config/db.js';
import fs from 'fs';
import slugify from 'slugify';

const router = Router();

router
  .get('/', async (req, res) => {
    try {
      const { page, limit, search } = req.query;
      const skip = (page - 1) * limit;

      const topics = await pool.query(
        `SELECT * FROM topics WHERE name ILIKE $1 ORDER BY id DESC LIMIT $2 OFFSET $3`,
        [`%${search ? search : ''}%`, limit, skip],
      );

      const countResult = await pool.query('SELECT COUNT(*) FROM topics WHERE name ILIKE $1 ', [
        `%${search ? search : ''}%`,
      ]);

      const count = countResult.rows[0].count;
      const pages = Math.ceil(count / limit);

      let nextPage = Number(page) + 1;

      res.status(200).json({
        data: [...topics.rows],
        nextPage: nextPage > pages ? null : nextPage,
      });
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  })
  .post('/', addValidation, validationErrors, async (req, res) => {
    try {
      const { name, description, language, image } = req.body;
      const slug = slugify(name, {
        lower: true,
        strict: true,
      });

      await pool.query(
        `INSERT INTO topics (name, description, language, image, slug) VALUES ($1, $2, $3, $4, $5)`,
        [name, description, language, image, slug],
      );

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

      const topic = await pool.query('SELECT * FROM topics WHERE id = $1', [id]);

      res.status(200).json({ ...topic.rows[0] });
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  })
  .patch('/:id', addValidation, validationErrors, async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, language, image } = req.body;
      const slug = slugify(name, {
        lower: true,
        strict: true,
      });

      const topic = await pool.query('SELECT * FROM topics WHERE id = $1', [id]);

      if (!topic.rows[0]) {
        throw new Error();
      }

      if (topic.rows[0].image !== image) {
        const oldImage = topic.rows[0].image.replace(process.env.DOMAIN + '/', '');
        fs.unlinkSync(oldImage);
      }

      await pool.query(
        'UPDATE topics SET name = $1, description = $2, language = $3, image = $4, slug = $5 WHERE id = $6',
        [name, description, language, image, slug, id],
      );

      res.status(200).json({
        message: 'Успшено',
      });
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  })
  .delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      await pool.query('DELETE FROM dialogs WHERE topic_id = $1', [id]);
      const topic = await pool.query('DELETE FROM topics WHERE id = $1 RETURNING *', [id]);

      const image = topic.rows[0].image.replace(process.env.DOMAIN + '/', '');
      fs.unlinkSync(image);

      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(400);
    }
  });

export default router;
