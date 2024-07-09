import OrderModel from "./order.schema.js";

export const createNewOrderRepo = async (data) => {
  try {
    const order = new OrderModel(data);
    await order.save();
    return order;
  } catch (error) {
    throw new Error("Failed to create new order");
  }
  // Write your code here for placing a new order
};
