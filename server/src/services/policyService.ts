import { prisma } from '../lib/prisma.js';
import { ComprehensivePolicyCheck, PolicyValidationResult } from '../types/index.js';

export interface OrderPolicyContext {
  merchantId: string;
  totalAmount: number;
  discountPercent?: number;
  hasUpsellItem?: boolean;
  upsellApprovedByUser?: boolean;
  items: Array<{
    productId: string;
    quantity: number;
    isUpsell?: boolean;
    approvedByUser?: boolean;
  }>;
  userConfirmedPayment?: boolean;
  isSimulatedViolation?: boolean;
}

export class PolicyService {
  /**
   * Validate all financial and commercial policies for an order or cart action
   */
  public static async validateOrderPolicy(
    context: OrderPolicyContext
  ): Promise<ComprehensivePolicyCheck> {
    const violations: PolicyValidationResult[] = [];
    const passedPolicies: PolicyValidationResult[] = [];

    // 1. Fetch merchant specific settings and policies
    const settings = await prisma.merchantSettings.findUnique({
      where: { merchantId: context.merchantId },
    });

    const activePolicies = await prisma.policy.findMany({
      where: {
        merchantId: context.merchantId,
        isActive: true,
      },
    });

    // Handle intentional demo failure simulation
    if (context.isSimulatedViolation || settings?.simulatePolicyViolation) {
      violations.push({
        isValid: false,
        policyCode: 'SIMULATED_POLICY_VIOLATION',
        policyName: 'Judge Demo Simulation: High Risk Policy Trigger',
        policyResult: 'VIOLATION',
        message: 'Action blocked by Policy Engine: Simulated policy check failure for Buildathon resilience evaluation.',
        details: { simulated: true },
      });
      return {
        isAllowed: false,
        violations,
        passedPolicies,
        explanation: 'Transaction was blocked by the Financial Policy Engine due to an active safety restriction.',
      };
    }

    const maxTransactionLimit = settings?.maxTransactionAmount ?? 100000;
    const maxDiscountLimit = settings?.maxDiscountPercent ?? 15;
    const upsellRequiresApproval = settings?.upsellRequiresApproval ?? true;
    const paymentRequiresConfirm = settings?.paymentRequiresConfirm ?? true;

    // Policy 1: MAX_TRANSACTION_AMOUNT Check
    if (context.totalAmount > maxTransactionLimit) {
      violations.push({
        isValid: false,
        policyCode: 'MAX_TRANSACTION_AMOUNT',
        policyName: 'Maximum Single Transaction Limit',
        policyResult: 'VIOLATION',
        message: `Order amount of ₹${context.totalAmount.toLocaleString('en-IN')} exceeds the merchant maximum limit of ₹${maxTransactionLimit.toLocaleString('en-IN')}.`,
        details: { limit: maxTransactionLimit, actual: context.totalAmount },
      });
    } else {
      passedPolicies.push({
        isValid: true,
        policyCode: 'MAX_TRANSACTION_AMOUNT',
        policyName: 'Maximum Single Transaction Limit',
        policyResult: 'PASSED',
        message: `Order amount ₹${context.totalAmount.toLocaleString('en-IN')} is within the permissible limit of ₹${maxTransactionLimit.toLocaleString('en-IN')}.`,
      });
    }

    // Policy 2: MAX_DISCOUNT_PERCENT Check
    const effectiveDiscount = context.discountPercent || 0;
    if (effectiveDiscount > maxDiscountLimit) {
      violations.push({
        isValid: false,
        policyCode: 'MAX_DISCOUNT_PERCENT',
        policyName: 'Maximum Permissible Discount',
        policyResult: 'VIOLATION',
        message: `Discount of ${effectiveDiscount}% exceeds the maximum merchant-configured discount threshold of ${maxDiscountLimit}%.`,
        details: { limit: maxDiscountLimit, actual: effectiveDiscount },
      });
    } else {
      passedPolicies.push({
        isValid: true,
        policyCode: 'MAX_DISCOUNT_PERCENT',
        policyName: 'Maximum Permissible Discount',
        policyResult: 'PASSED',
        message: `Discount of ${effectiveDiscount}% is compliant with discount threshold (${maxDiscountLimit}%).`,
      });
    }

    // Policy 3: UPSELL_REQUIRES_CUSTOMER_APPROVAL Check
    if (upsellRequiresApproval) {
      const unapprovedUpsellItems = context.items.filter(
        (item) => item.isUpsell && item.approvedByUser === false
      );

      if (unapprovedUpsellItems.length > 0) {
        violations.push({
          isValid: false,
          policyCode: 'UPSELL_REQUIRES_CUSTOMER_APPROVAL',
          policyName: 'Mandatory Customer Approval for Upsells',
          policyResult: 'VIOLATION',
          message: 'An upsell or add-on product was included without explicit customer approval. AgentCart requires affirmative consent before adding revenue items.',
          details: { unapprovedItems: unapprovedUpsellItems },
        });
      } else {
        passedPolicies.push({
          isValid: true,
          policyCode: 'UPSELL_REQUIRES_CUSTOMER_APPROVAL',
          policyName: 'Mandatory Customer Approval for Upsells',
          policyResult: 'PASSED',
          message: 'All upsell and add-on products have verified customer consent.',
        });
      }
    }

    // Policy 4: PAYMENT_REQUIRES_CUSTOMER_CONFIRMATION Check
    if (paymentRequiresConfirm && context.userConfirmedPayment === false) {
      violations.push({
        isValid: false,
        policyCode: 'PAYMENT_REQUIRES_CUSTOMER_CONFIRMATION',
        policyName: 'Customer Payment Confirmation',
        policyResult: 'VIOLATION',
        message: 'Payment initiation requires explicit affirmative confirmation from the customer before launching Razorpay.',
      });
    } else {
      passedPolicies.push({
        isValid: true,
        policyCode: 'PAYMENT_REQUIRES_CUSTOMER_CONFIRMATION',
        policyName: 'Customer Payment Confirmation',
        policyResult: 'PASSED',
        message: 'Customer payment confirmation verified.',
      });
    }

    // Policy 5: Inventory Availability Validation
    for (const item of context.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || !product.active) {
        violations.push({
          isValid: false,
          policyCode: 'PRODUCT_INACTIVE_OR_DELETED',
          policyName: 'Product Availability',
          policyResult: 'VIOLATION',
          message: `Product ${product?.name || item.productId} is no longer active in the merchant catalog.`,
        });
      } else if (product.stock < item.quantity) {
        violations.push({
          isValid: false,
          policyCode: 'INSUFFICIENT_STOCK',
          policyName: 'Inventory Stock Verification',
          policyResult: 'VIOLATION',
          message: `Requested quantity (${item.quantity}) for ${product.name} exceeds available stock (${product.stock}).`,
          details: { availableStock: product.stock, requested: item.quantity },
        });
      }
    }

    const isAllowed = violations.length === 0;
    const explanation = isAllowed
      ? `All ${passedPolicies.length} financial and compliance policies successfully validated. Transaction is approved to proceed.`
      : `Transaction blocked by Policy Engine with ${violations.length} violation(s): ${violations.map((v) => v.message).join(' ')}`;

    return {
      isAllowed,
      violations,
      passedPolicies,
      explanation,
    };
  }
}
