import { body } from 'express-validator';

export const updateValidation = [
  body('name', 'Введите имя').isLength({ min: 3 }).isString(),
  body('email', 'Невалидный адрес эл. почты').isEmail(),
  body('role').isLength({ min: 3 }).isString(),
];
