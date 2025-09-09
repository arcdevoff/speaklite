import { query } from 'express-validator';

export const getAllValidation = [
  query('page').notEmpty().isInt(),
  query('limit').notEmpty().isInt(),
];
