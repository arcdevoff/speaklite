import { body } from 'express-validator';

export const addValidation = [
  body('type').notEmpty(),
  body('topic').notEmpty(),
  body('text').notEmpty().isObject(),
];
