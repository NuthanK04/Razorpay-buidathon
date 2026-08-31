import { describe, it, expect, beforeAll } from 'vitest';
import { PolicyService } from './policyService.js';
import { prisma } from '../lib/prisma.js';

describe('Financial Policy Engine Test Suite', () => {
  let seededProductId: string;

  beforeAll(async () => {
    const product = await prisma.product.findFirst({ where: { active: true } });
    seededProductId = product ? product.id : 'test-prod';
  });

  it('blocks transactions that exceed MAX_TRANSACTION_AMOUNT limit', async () => {
    const result = await PolicyService.validateOrderPolicy({
      merchantId: 'test-merchant',
      totalAmount: 150000, // Exceeds 100,000 INR
      items: [],
      userConfirmedPayment: true,
    });

    expect(result.isAllowed).toBe(false);
    expect(result.violations.some((v) => v.policyCode === 'MAX_TRANSACTION_AMOUNT')).toBe(true);
  });

  it('blocks unapproved upsell items under UPSELL_REQUIRES_CUSTOMER_APPROVAL', async () => {
    const result = await PolicyService.validateOrderPolicy({
      merchantId: 'test-merchant',
      totalAmount: 75000,
      items: [
        {
          productId: seededProductId,
          quantity: 1,
          isUpsell: true,
          approvedByUser: false, // Customer did not approve!
        },
      ],
      userConfirmedPayment: true,
    });

    expect(result.isAllowed).toBe(false);
    expect(result.violations.some((v) => v.policyCode === 'UPSELL_REQUIRES_CUSTOMER_APPROVAL')).toBe(true);
  });

  it('approves compliant orders within bounds with verified consent and stock', async () => {
    const result = await PolicyService.validateOrderPolicy({
      merchantId: 'test-merchant',
      totalAmount: 77498,
      items: [
        {
          productId: seededProductId,
          quantity: 1,
          isUpsell: false,
          approvedByUser: true,
        },
      ],
      userConfirmedPayment: true,
    });

    expect(result.isAllowed).toBe(true);
    expect(result.violations.length).toBe(0);
    expect(result.passedPolicies.length).toBeGreaterThan(0);
  });
});
