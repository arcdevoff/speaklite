import { body } from 'express-validator';

export const addValidation = [
  body('name', 'Введите название').notEmpty().isString(),
  body('description', 'Введите описание').optional().isString(),
  body('language', 'Введите язык темы').notEmpty().isString(),
  body('image', 'Загрузить изображение').notEmpty().isString(),
];
