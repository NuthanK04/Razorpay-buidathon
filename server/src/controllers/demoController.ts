import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

export class DemoController {
  public static async getDemoStatus(req: Request, res: Response): Promise<void> {
    try {
      const merchant = await prisma.merchant.findFirst({
        where: { slug: 'electrotech-apex' },
        include: { settings: true },
      });

      const customer = await prisma.customer.findFirst();
      const productCount = await prisma.product.count();
      const orderCount = await prisma.order.count();
      const auditCount = await prisma.auditLog.count();

      res.json({
        success: true,
        data: {
          merchant,
          customer,
          stats: {
            products: productCount,
            orders: orderCount,
            auditLogs: auditCount,
          },
          simulationFlags: {
            simulatePaymentFailure: merchant?.settings?.simulatePaymentFailure || false,
            simulatePolicyViolation: merchant?.settings?.simulatePolicyViolation || false,
            simulateAiDown: merchant?.settings?.simulateAiDown || false,
          },
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async toggleSimulation(req: Request, res: Response): Promise<void> {
    try {
      const { type, enabled } = req.body; // type: 'payment' | 'policy' | 'ai'

      const merchant = await prisma.merchant.findFirst({
        where: { slug: 'electrotech-apex' },
        include: { settings: true },
      });

      if (!merchant) {
        res.status(404).json({ success: false, message: 'Default demo merchant not found.' });
        return;
      }

      const updateData: any = {};
      if (type === 'payment') updateData.simulatePaymentFailure = Boolean(enabled);
      if (type === 'policy') updateData.simulatePolicyViolation = Boolean(enabled);
      if (type === 'ai') updateData.simulateAiDown = Boolean(enabled);

      const updatedSettings = await prisma.merchantSettings.upsert({
        where: { merchantId: merchant.id },
        update: updateData,
        create: {
          merchantId: merchant.id,
          ...updateData,
        },
      });

      res.json({
        success: true,
        message: `Simulation ${type} flag set to ${enabled}`,
        data: updatedSettings,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
