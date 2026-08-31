import { Router } from 'express';
import { ProductController } from '../controllers/productController.js';

const router = Router();

router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);
router.post('/search', ProductController.searchAndRank);
router.post('/', ProductController.createProduct);

export default router;
