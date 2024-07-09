// Please don't change the pre-written code
// Import the necessary modules here

import { createNewOrderRepo } from "../model/order.repository.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";

export const createNewOrder = async (req, res, next) => {
  try {
    const {
      shippingInfo,
      orderedItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const user = req.user._id;

    // Validate required fields
    if (!shippingInfo || !orderedItems || !paymentInfo || !itemsPrice || !taxPrice || !shippingPrice || !totalPrice) {
      return next(new ErrorHandler(400, "All fields are required"));
    }

    const orderData = {
      shippingInfo,
      orderedItems,
      user,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
    };

    const newOrder = await createNewOrderRepo(orderData);

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
  // Write your code here for placing a new order
};
