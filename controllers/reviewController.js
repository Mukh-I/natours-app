const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');
// const catchErrorFunc = require('./../utils/catchErrorFunc');

exports.setTourUserId = async (req, res, next) => {
  // set tourId /userId
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
