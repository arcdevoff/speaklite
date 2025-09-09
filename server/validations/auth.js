import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Невалидный адрес эл. почты').isEmail(),
  body('password', 'Введите пароль').isLength({ min: 6 }),
];

export const signupValidation = [
  body('email', 'Невалидный адрес эл. почты').isEmail(),
  body('name', 'Введите ваше имя').isLength({ min: 3 }).isString(),
  body('password', 'Введите пароль').isLength({ min: 6 }),
];
