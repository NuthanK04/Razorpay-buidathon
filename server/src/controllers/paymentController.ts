import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService.js';
import { prisma } from '../lib/prisma.js';

export class PaymentController {
  public static async getGatewayStatus(req: Request, res: Response): Promise<void> {
    try {
      const merchantId = req.query.merchantId ? String(req.query.merchantId) : undefined;
      const status = await PaymentService.getGatewayStatus(merchantId);
      res.json({ success: true, data: status });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async validateKeys(req: Request, res: Response): Promise<void> {
    try {
      const { keyId, keySecret } = req.body;
      const result = await PaymentService.validateKeys(keyId, keySecret);
      res.json({ success: result.valid, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  public static async configureKeys(req: Request, res: Response): Promise<void> {
    try {
      const { merchantId, keyId, keySecret } = req.body;

      if (!keyId || !keySecret) {
        res.status(400).json({ success: false, message: 'Both keyId and keySecret are required.' });
        return;
      }

      // First test keys with Razorpay API
      const validation = await PaymentService.validateKeys(keyId, keySecret);

      let targetMerchantId = merchantId;
      if (!targetMerchantId) {
        const defaultMerchant = await prisma.merchant.findFirst();
        targetMerchantId = defaultMerchant?.id;
      }

      if (!targetMerchantId) {
        res.status(404).json({ success: false, message: 'Merchant not found to attach keys.' });
        return;
      }

      // Upsert into MerchantSettings
      const updated = await prisma.merchantSettings.upsert({
        where: { merchantId: targetMerchantId },
        update: {
          razorpayKeyId: keyId.trim(),
          razorpayKeySecret: keySecret.trim(),
        },
        create: {
          merchantId: targetMerchantId,
          razorpayKeyId: keyId.trim(),
          razorpayKeySecret: keySecret.trim(),
        },
      });

      res.json({
        success: true,
        message: validation.valid
          ? 'Razorpay API keys verified and configured successfully!'
          : 'Razorpay keys saved (note: connection test returned: ' + validation.message + ')',
        data: {
          merchantId: targetMerchantId,
          keyId: keyId.trim(),
          isValid: validation.valid,
          validationMessage: validation.message,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async createPaymentOrder(req: Request, res: Response): Promise<void> {
    try {
      const { orderId, merchantId, simulateFailure } = req.body;

      if (!orderId) {
        res.status(400).json({ success: false, message: 'orderId is required.' });
        return;
      }

      let resolvedMerchantId = merchantId;
      if (!resolvedMerchantId) {
        const order = await prisma.order.findUnique({ where: { id: orderId } });
        resolvedMerchantId = order?.merchantId || 'default-merchant';
      }

      const rzpOrder = await PaymentService.createRazorpayOrder(
        orderId,
        resolvedMerchantId,
        Boolean(simulateFailure)
      );

      res.json({ success: true, data: rzpOrder });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || 'Payment initiation failed.',
        isFailureHandled: true,
      });
    }
  }

  public static async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature, isSimulated } = req.body;

      if (!orderId || !razorpayOrderId || !razorpayPaymentId) {
        res.status(400).json({
          success: false,
          message: 'Missing required payment verification parameters (orderId, razorpayOrderId, razorpayPaymentId).',
        });
        return;
      }

      const verificationResult = await PaymentService.verifyPayment({
        orderId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature: razorpaySignature || 'simulated_sig_test',
        isSimulated: Boolean(isSimulated),
      });

      if (!verificationResult.success) {
        res.status(400).json({ success: false, data: verificationResult });
        return;
      }

      res.json({ success: true, data: verificationResult });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
