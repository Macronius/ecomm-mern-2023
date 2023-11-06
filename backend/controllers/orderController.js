// middleware
import asyncHandler from "../middleware/asyncHandler.js";
// models
import OrderModel from "../models/orderModel.js";
// import ProductModel from '../models/productModel.js';
// utils

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  // get all required order data from the HTTP request body from the frontend
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  // check if there is an orderItems array and if it is empty
  if (orderItems && orderItems.length === 0) {
    res.status(400); // NOTE: no need for .json({message: "error"}) because errorHandler in effect
    throw new Error("No order items");
  } else {
    const order = new OrderModel({
      orderItems: orderItems.map((d) => ({
        ...d,
        product: d._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    // save order into a variable that can be added to res
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged-in user's orders (get id through token in cookie)
// @route   GET /api/orders/mine
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  // console.log(req._id);
  // console.log("getMyOrders() called from orderController")
  const orders = await OrderModel.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get order by id
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id).populate(
    "user",
    "name email"
  );
  //
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to status delivered
// @route   PUT /api/orders/:id/deliver         NOTE: apparently this is supposed to be GET
// @access  Private/Admin
const updateOrderTodelivered = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id);
  //
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    // save the updated order and store in a constant variable
    const updatedOrder = await order.save();
    //
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to status paid
// @route   PUT /api/orders/:id/pay         NOTE: apparently this is supposed to be GET
// @access  Private/Admin
const updateOrderTopaid = asyncHandler(async (req, res) => {
  const order = await OrderModel.findById(req.params.id);
  // console.log("order from orderController: updateOrderTopaid");
  // console.log(order);
  //
  if (order) {
    // update paid status
    order.isPaid = true;
    // include more data
    // order.paidAt = new Date.now();  // why not this?
    order.paidAt = Date.now();
    order.paymentResult = {
      // NOTE: the following data will come from paypal
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    // save to database
    const updatedOrder = await order.save();
    // respond status & pass in updated order
    res.status(200).json(updatedOrder);
  } else {
    // NOTE: only reason for error is if not found
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await OrderModel.find({}).populate("user", "id name");
  res.status(200).json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderTodelivered,
  updateOrderTopaid,
  getOrders,
};
