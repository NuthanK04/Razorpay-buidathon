import { Router } from 'express';
import { AuditController } from '../controllers/auditController.js';

const router = Router();

router.get('/', AuditController.getAuditLogs);
router.get('/:code', AuditController.getAuditByCode);

export default router;
