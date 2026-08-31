import { Router } from 'express';
import { OrderController } from '../controllers/orderController.js';

const router = Router();

router.get('/', OrderController.listOrders);
router.get('/:id', OrderController.getOrderById);
router.post('/', OrderController.createOrder);

export default router;
