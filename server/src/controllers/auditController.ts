import { Request, Response } from 'express';
import { AuditService } from '../services/auditService.js';
import { prisma } from '../lib/prisma.js';

export class AuditController {
  public static async getAuditLogs(req: Request, res: Response): Promise<void> {
    try {
      const { merchantId, actionType, policyResult, limit } = req.query;

      let resolvedMerchantId = String(merchantId || '');
      if (!resolvedMerchantId || resolvedMerchantId === 'default') {
        const m = await prisma.merchant.findFirst();
        resolvedMerchantId = m?.id || 'default-merchant';
      }

      const logs = await AuditService.getMerchantAuditLogs(resolvedMerchantId, {
        actionType: actionType ? String(actionType) : undefined,
        policyResult: policyResult ? String(policyResult) : undefined,
        limit: limit ? parseInt(String(limit), 10) : 100,
      });

      res.json({ success: true, count: logs.length, data: logs });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async getAuditByCode(req: Request, res: Response): Promise<void> {
    try {
      const code = String(req.params.code);
      const log = await prisma.auditLog.findUnique({
        where: { auditCode: code },
        include: {
          order: { include: { items: true, payments: true } },
          merchant: true,
        },
      });

      if (!log) {
        res.status(404).json({ success: false, message: 'Audit record not found.' });
        return;
      }

      res.json({ success: true, data: log });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
