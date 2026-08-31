import { describe, it, expect } from 'vitest';
import { CommerceToolsExecutor } from './tools.js';
import { prisma } from '../lib/prisma.js';

describe('Commerce Tools Execution Test Suite', () => {
  it('executes search_products tool and returns deterministic scores', async () => {
    const res = await CommerceToolsExecutor.executeTool('search_products', {
      category: 'laptops',
      budget_max: 80000,
      ram_min: 16,
      gpu_required: true,
      purpose: 'AI development',
    });

    expect(res.success).toBe(true);
    expect(Array.isArray(res.data)).toBe(true);
    expect(res.data.length).toBeGreaterThan(0);
    expect(res.data[0].score).toBeDefined();
    expect(res.data[0].matchReason).toBeDefined();
  });

  it('executes calculate_cart_total tool server-side', async () => {
    const product = await prisma.product.findFirst();
    if (!product) return;

    const res = await CommerceToolsExecutor.executeTool('calculate_cart_total', {
      items: [
        { productId: product.id, quantity: 2, isUpsell: false },
      ],
    });

    expect(res.success).toBe(true);
    expect(res.data.total).toBe(product.price * 2);
  });

  it('executes create_audit_event tool and produces AC-XXXXX code', async () => {
    const merchant = await prisma.merchant.findFirst();
    if (!merchant) return;

    const res = await CommerceToolsExecutor.executeTool('create_audit_event', {
      merchantId: merchant.id,
      actionType: 'TEST_AUDIT_ACTION',
      inputSummary: 'Unit test audit trigger',
      decisionSummary: 'Verified audit emission',
    });

    expect(res.success).toBe(true);
    expect(res.auditId).toMatch(/^AC-\d+$/);
  });
});
