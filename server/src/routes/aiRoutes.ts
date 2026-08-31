import { Router } from 'express';
import { AiController } from '../controllers/aiController.js';

const router = Router();

router.post('/chat', AiController.chat);
router.post('/intent', AiController.extractIntent);
router.post('/recommend', AiController.getRecommendations);
router.post('/upsell', AiController.getUpsellOpportunities);

export default router;
