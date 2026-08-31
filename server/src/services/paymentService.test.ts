import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { PaymentService } from './paymentService.js';
import { prisma } from '../lib/prisma.js';

describe('Razorpay Payment Pipeline Test Suite', () => {
  it('creates a Razorpay Test Mode order with policy validation', async () => {
    const merchant = await prisma.merchant.findFirst();
    const product = await prisma.product.findFirst();

    if (!merchant || !product) return;

    await prisma.merchantSettings.upsert({
      where: { merchantId: merchant.id },
      update: { simulatePaymentFailure: false },
      create: { merchantId: merchant.id, simulatePaymentFailure: false },
    });

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-TEST-${Date.now().toString().slice(-4)}`,
        merchantId: merchant.id,
        status: 'PENDING',
        subtotal: product.price,
        totalAmount: product.price,
        currency: 'INR',
        policyValidationStatus: 'PENDING',
        items: {
          create: [
            {
              productId: product.id,
              productName: product.name,
              quantity: 1,
              unitPrice: product.price,
              totalPrice: product.price,
            },
          ],
        },
      },
    });

    const paymentOrder = await PaymentService.createRazorpayOrder(order.id, merchant.id);

    expect(paymentOrder).toBeDefined();
    expect(paymentOrder.id).toBeDefined();
    expect(paymentOrder.amount).toBe(Math.round(product.price * 100));
    expect(paymentOrder.currency).toBe('INR');
  });

  it('rejects tampered or invalid payment signatures securely', async () => {
    const order = await prisma.order.findFirst();
    if (!order) return;

    const verification = await PaymentService.verifyPayment({
      orderId: order.id,
      razorpayOrderId: 'order_test_fake123',
      razorpayPaymentId: 'pay_test_fake456',
      razorpaySignature: 'invalid_tampered_signature_789',
      isSimulated: false,
    });

    expect(verification.success).toBe(false);
    expect(verification.status).toBe('FAILED');
    expect(verification.auditId).toBeDefined();
  });
});
