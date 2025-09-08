import express  from "express";
const router = express.Router();

    
import {protect, admin} from '../middlewares/authMiddleware.js';


 


import {
    createOrder,
    searchOrders,
    getAllOrders,
    deleteOrder
} from '../controllers/ordersController.js';

// Create a new order
router.post('/' /*, protect */ , createOrder);

// Search orders by ID, username, phone, or email
router.get('/search', /* protect, admin, */ searchOrders);

// Get all orders
router.get('/', /* protect, admin, */ getAllOrders);

// Delete an order by ID
router.delete('/:id', /* protect, admin, */  deleteOrder);

export default router;

// POST /api/orders → create a new order

// GET /api/orders/search?searchTerm=... → search orders

// GET /api/orders → get all orders

// DELETE /api/orders/:id → delete order