import { Router } from 'express';
import { MerchantController } from '../controllers/merchantController.js';

const router = Router();

router.get('/list', MerchantController.getMerchantsList);
router.get('/:merchantId/dashboard', MerchantController.getDashboard);
router.put('/:merchantId/settings', MerchantController.updateSettings);

export default router;
