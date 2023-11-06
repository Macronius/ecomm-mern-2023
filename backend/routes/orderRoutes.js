import express from 'express';
const router = express.Router();
import {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderTodelivered,
    updateOrderTopaid,
    getOrders
} from '../controllers/orderController.js';
import {admin, protect} from '../middleware/authMiddleware.js'


// ROUTES
router.route("/").get(protect, admin, getOrders).post(protect, addOrderItems);
router.route("/mine").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderTopaid);
router.route("/:id/deliver").put(protect, admin, updateOrderTodelivered);

export default router;