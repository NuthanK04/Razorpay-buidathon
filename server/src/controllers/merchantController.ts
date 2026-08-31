import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analyticsService.js';
import { prisma } from '../lib/prisma.js';

export class MerchantController {
  public static async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const merchantId = String(req.params.merchantId || '');

      let resolvedMerchantId = merchantId;
      if (!resolvedMerchantId || resolvedMerchantId === 'default' || resolvedMerchantId === 'undefined') {
        const m = await prisma.merchant.findFirst();
        resolvedMerchantId = m?.id || 'default-merchant';
      }

      const metrics = await AnalyticsService.getMerchantDashboardMetrics(resolvedMerchantId);
      const merchant = await prisma.merchant.findUnique({
        where: { id: resolvedMerchantId },
        include: { settings: true, policies: true },
      });

      res.json({
        success: true,
        merchant,
        data: metrics,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async getMerchantsList(req: Request, res: Response): Promise<void> {
    try {
      const merchants = await prisma.merchant.findMany({
        include: {
          settings: true,
          _count: {
            select: { products: true, orders: true },
          },
        },
      });

      res.json({ success: true, count: merchants.length, data: merchants });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      const merchantId = String(req.params.merchantId);
      const {
        maxTransactionAmount,
        maxDiscountPercent,
        upsellRequiresApproval,
        rankingWeightMatch,
        rankingWeightPrice,
        rankingWeightRating,
        rankingWeightStock,
        rankingWeightPriority,
        simulatePaymentFailure,
        simulatePolicyViolation,
        simulateAiDown,
        razorpayKeyId,
        razorpayKeySecret,
      } = req.body;

      const updated = await prisma.merchantSettings.upsert({
        where: { merchantId },
        update: {
          maxTransactionAmount: maxTransactionAmount !== undefined ? parseFloat(maxTransactionAmount) : undefined,
          maxDiscountPercent: maxDiscountPercent !== undefined ? parseFloat(maxDiscountPercent) : undefined,
          upsellRequiresApproval: upsellRequiresApproval !== undefined ? Boolean(upsellRequiresApproval) : undefined,
          rankingWeightMatch: rankingWeightMatch !== undefined ? parseFloat(rankingWeightMatch) : undefined,
          rankingWeightPrice: rankingWeightPrice !== undefined ? parseFloat(rankingWeightPrice) : undefined,
          rankingWeightRating: rankingWeightRating !== undefined ? parseFloat(rankingWeightRating) : undefined,
          rankingWeightStock: rankingWeightStock !== undefined ? parseFloat(rankingWeightStock) : undefined,
          rankingWeightPriority: rankingWeightPriority !== undefined ? parseFloat(rankingWeightPriority) : undefined,
          simulatePaymentFailure: simulatePaymentFailure !== undefined ? Boolean(simulatePaymentFailure) : undefined,
          simulatePolicyViolation: simulatePolicyViolation !== undefined ? Boolean(simulatePolicyViolation) : undefined,
          simulateAiDown: simulateAiDown !== undefined ? Boolean(simulateAiDown) : undefined,
          razorpayKeyId: razorpayKeyId !== undefined ? String(razorpayKeyId).trim() : undefined,
          razorpayKeySecret: razorpayKeySecret !== undefined ? String(razorpayKeySecret).trim() : undefined,
        },
        create: {
          merchantId,
          maxTransactionAmount: maxTransactionAmount ? parseFloat(maxTransactionAmount) : 100000,
          maxDiscountPercent: maxDiscountPercent ? parseFloat(maxDiscountPercent) : 15,
          upsellRequiresApproval: upsellRequiresApproval ?? true,
          razorpayKeyId: razorpayKeyId ? String(razorpayKeyId).trim() : undefined,
          razorpayKeySecret: razorpayKeySecret ? String(razorpayKeySecret).trim() : undefined,
        },
      });

      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
