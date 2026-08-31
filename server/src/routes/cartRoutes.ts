import { Router } from 'express';
import { CartController } from '../controllers/cartController.js';

const router = Router();

router.get('/:sessionId', CartController.getCart);
router.post('/items', CartController.addItem);
router.delete('/:cartId/items/:itemId', CartController.removeItem);

export default router;
