import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController.js';

const router = Router();

router.get('/gateway-status', PaymentController.getGatewayStatus);
router.post('/validate-keys', PaymentController.validateKeys);
router.post('/configure-keys', PaymentController.configureKeys);
router.post('/create-order', PaymentController.createPaymentOrder);
router.post('/verify', PaymentController.verifyPayment);

export default router;
