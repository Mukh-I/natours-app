const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('./../models/tourModel');
const catchErrorFunc = require('./../utils/catchErrorFunc');
//const AppError = require('./../utils/appError');

exports.getCheckoutSession = catchErrorFunc(async (req, res, next) => {
  console.log('B', process.env.STRIPE_SECRET_KEY)
  const tour = await Tour.findById(req.params.tourId);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    client_reference_id: req.user.id,
    customer_email: req.user.email,
    line_items: [
      {
        name: `${tour.name} tour`,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        quantity: 1,
        amount: tour.price * 100,
        description: tour.summary,
        currency: 'usd'
      }
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/`
  });

  res.status(200).json({
    status: 'success',
    session
  });
});
