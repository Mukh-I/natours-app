/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

const stripe = Stripe(
  'pk_test_51Grd0VGilvkt9V8CuABXvHEOtdobzUuULTbJvHXq8XHWa313oazrQ0GxvTLSfD4FyT3KGVVzDf9O6Y3W9oG73QYq00wNyvN1Ad'
);

export const bookTour = async tourId => {
  try {
    // get checkout seesion from api
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // console.log(session);
    // create checkout & charge card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    showAlert('error', err);
  }
};
