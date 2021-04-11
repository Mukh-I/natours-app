const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const catchErrorFunc = require('./../utils/catchErrorFunc');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! You can only upload images', 400));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchErrorFunc(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filteredFields = (obj, ...allowedFields) => {
  const wantedFields = {};
  Object.keys(obj).forEach(element => {
    if (allowedFields.includes(element)) {
      wantedFields[element] = obj[element];
    }
  });

  return wantedFields;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};

exports.deleteMe = catchErrorFunc(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.updateMe = catchErrorFunc(async (req, res, next) => {
  //create error if user posts password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for updating pasword details, please use /updateMyPassword',
        400
      )
    );
  }
  // filter out unwanted fields that are not allowed to be updated
  const filteredBody = filteredFields(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  // update user
  const UpdatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    user: UpdatedUser
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined!'
  });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
// for admin
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
