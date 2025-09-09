import { Router } from "express";
import pool from "../config/db.js";
import { getAllValidation } from "../validations/topic.js";
import validationErrors from "../utils/validationErrors.js";

const router = Router();

router.get("/", getAllValidation, validationErrors, async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    const skip = (page - 1) * limit;

    const topics = await pool.query(
      `SELECT * FROM topics WHERE name ILIKE $1 ORDER BY id DESC LIMIT $2 OFFSET $3`,
      [`%${search ? search : ""}%`, limit, skip]
    );

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM topics WHERE name ILIKE $1 ",
      [`%${search ? search : ""}%`]
    );

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
});

export default router;
