const catchErrorFunc = require('./../utils/catchErrorFunc');
const AppError = require('./../utils/appError');
const ApiFeatures = require('./../utils/ApiFeatures');

exports.deleteOne = Module =>
  catchErrorFunc(async (req, res, next) => {
    const doc = await Module.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError(`Can't find document with that ID`, 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Module =>
  catchErrorFunc(async (req, res, next) => {
    const doc = await Module.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError(`can't find document with that ID`, 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = Module =>
  catchErrorFunc(async (req, res, _next) => {
    const newDoc = await Module.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc
      }
    });
  });

exports.getOne = (Module, popOptions) =>
  catchErrorFunc(async (req, res, next) => {
    let query = Module.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError(`Can't find document with that ID`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAll = Module =>
  catchErrorFunc(async (req, res, next) => {
    // To allow for nested Get reivew on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new ApiFeatures(Module.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    });
  });
