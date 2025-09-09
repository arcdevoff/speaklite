import { body, param } from 'express-validator';

export const confirmValidation = [body('token').isLength({ min: 15 }).isString()];
