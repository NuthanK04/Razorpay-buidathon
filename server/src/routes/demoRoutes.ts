import { Router } from 'express';
import { DemoController } from '../controllers/demoController.js';

const router = Router();

router.get('/status', DemoController.getDemoStatus);
router.post('/toggle-simulation', DemoController.toggleSimulation);

export default router;
