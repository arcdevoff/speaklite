import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let path;

    if (req.route.path == '/upload/image') {
      path = 'uploads/image';
    }

    cb(null, path);
  },
  filename: function (req, file, cb) {
    const fileUniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${fileUniqueName}.${file.mimetype.split('/')[1]}`);
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 150000000,
  },
  fileFilter: (req, file, cb) => {
    let types = [];

    if (req.route.path == '/upload/image') {
      types = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    }

    if (!types.includes(file.mimetype)) {
      return cb(new Error('TYPE_ERROR'));
    }

    cb(null, true);
  },
});
