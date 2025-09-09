import { MulterError } from 'multer';

export default (err, req, res, next) => {
  if (err instanceof MulterError) {
    return res.status(400).json({ message: 'Ошибка при загрузке файла' });
  } else if (err.message === 'TYPE_ERROR') {
    return res.status(400).send({ message: 'Неверный тип файла (png, jpeg, webp, gif)' });
  }

  next();
};
