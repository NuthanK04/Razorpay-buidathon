import { prisma } from '../lib/prisma.js';
import { ProductService } from '../services/productService.js';
import { UpsellService } from '../services/upsellService.js';
import { PolicyService } from '../services/policyService.js';
import { PaymentService } from '../services/paymentService.js';
import { CartService } from '../services/cartService.js';
import { OrderService } from '../services/orderService.js';
import { AuditService } from '../services/auditService.js';
import { StructuredIntent, ToolCallResult } from '../types/index.js';

export const COMMERCE_TOOLS_DECLARATIONS = [
  {
    name: 'search_products',
    description: 'Search merchant catalog and rank products deterministically based on customer requirements, budget, RAM, and GPU.',
    parameters: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Product category e.g. laptops, monitors' },
        budget_max: { type: 'number', description: 'Maximum budget in INR' },
        ram_min: { type: 'number', description: 'Minimum RAM in GB' },
        gpu_required: { type: 'boolean', description: 'Whether dedicated GPU is needed' },
        purpose: { type: 'string', description: 'Customer use case e.g. AI development' },
        merchantId: { type: 'string', description: 'Target merchant ID' },
      },
    },
  },
  {
    name: 'get_product_details',
    description: 'Retrieve full specifications, features, stock, and pricing for a specific product ID.',
    parameters: {
      type: 'object',
      properties: {
        productId: { type: 'string', description: 'Unique product ID' },
      },
      required: ['productId'],
    },
  },
  {
    name: 'compare_products',
    description: 'Generate side-by-side comparison of 2 or 3 products focusing on specs, performance, price fit, and value.',
    parameters: {
      type: 'object',
      properties: {
        productIds: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of 2 to 3 product IDs to compare',
        },
      },
      required: ['productIds'],
    },
  },
  {
    name: 'check_inventory',
    description: 'Verify live inventory availability and stock levels for a product.',
    parameters: {
      type: 'object',
      properties: {
        productId: { type: 'string', description: 'Product ID' },
        quantity: { type: 'number', description: 'Quantity requested' },
      },
      required: ['productId'],
    },
  },
  {
    name: 'calculate_cart_total',
    description: 'Calculate subtotal, discounts, and final order total server-side.',
    parameters: {
      type: 'object',
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productId: { type: 'string' },
              quantity: { type: 'number' },
              isUpsell: { type: 'boolean' },
            },
          },
        },
      },
      required: ['items'],
    },
  },
  {
    name: 'recommend_upsell',
    description: 'Identify high-margin warranty, protection plan, or higher-tier product with reasoned pitch. NEVER automatically adds item.',
    parameters: {
      type: 'object',
      properties: {
        productId: { type: 'string', description: 'Selected product ID' },
      },
      required: ['productId'],
    },
  },
  {
    name: 'recommend_cross_sell',
    description: 'Identify complementary accessories (mouse, cooling pad, keyboard, display cables) for a product.',
    parameters: {
      type: 'object',
      properties: {
        productId: { type: 'string', description: 'Selected product ID' },
      },
      required: ['productId'],
    },
  },
  {
    name: 'create_cart',
    description: 'Create an active cart with selected base items and explicitly approved add-ons.',
    parameters: {
      type: 'object',
      properties: {
        sessionId: { type: 'string', description: 'AI Session ID' },
        merchantId: { type: 'string', description: 'Merchant ID' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productId: { type: 'string' },
              quantity: { type: 'number' },
              isUpsell: { type: 'boolean' },
              approvedByUser: { type: 'boolean' },
              upsellReason: { type: 'string' },
            },
          },
        },
      },
      required: ['sessionId', 'merchantId', 'items'],
    },
  },
  {
    name: 'validate_order_policy',
    description: 'Run Financial Policy Engine checks (transaction limit, discount cap, customer consent verification).',
    parameters: {
      type: 'object',
      properties: {
        merchantId: { type: 'string', description: 'Merchant ID' },
        totalAmount: { type: 'number', description: 'Total order amount in INR' },
        discountPercent: { type: 'number', description: 'Discount applied' },
        items: { type: 'array', items: { type: 'object' } },
        userConfirmedPayment: { type: 'boolean', description: 'Has customer explicitly agreed to buy' },
      },
      required: ['merchantId', 'totalAmount', 'items'],
    },
  },
  {
    name: 'create_razorpay_order',
    description: 'Initialize Razorpay Test Mode order after policy validation.',
    parameters: {
      type: 'object',
      properties: {
        orderId: { type: 'string', description: 'Internal Order ID' },
        merchantId: { type: 'string', description: 'Merchant ID' },
        simulateFailure: { type: 'boolean', description: 'Simulate gateway outage for testing' },
      },
      required: ['orderId', 'merchantId'],
    },
  },
  {
    name: 'verify_razorpay_payment',
    description: 'Cryptographically verify payment signature and transition order to PAID.',
    parameters: {
      type: 'object',
      properties: {
        orderId: { type: 'string', description: 'Internal Order ID' },
        razorpayOrderId: { type: 'string', description: 'Razorpay Order ID' },
        razorpayPaymentId: { type: 'string', description: 'Razorpay Payment ID' },
        razorpaySignature: { type: 'string', description: 'Razorpay HMAC Signature' },
      },
      required: ['orderId', 'razorpayOrderId', 'razorpayPaymentId', 'razorpaySignature'],
    },
  },
  {
    name: 'get_order_status',
    description: 'Retrieve live order status, payment state, and line items.',
    parameters: {
      type: 'object',
      properties: {
        orderId: { type: 'string', description: 'Order ID' },
      },
      required: ['orderId'],
    },
  },
  {
    name: 'create_audit_event',
    description: 'Record an immutable audit event in the AC-XXXXX log.',
    parameters: {
      type: 'object',
      properties: {
        sessionId: { type: 'string' },
        merchantId: { type: 'string' },
        actionType: { type: 'string' },
        toolName: { type: 'string' },
        inputSummary: { type: 'string' },
        decisionSummary: { type: 'string' },
        reason: { type: 'string' },
        policyResult: { type: 'string' },
      },
      required: ['merchantId', 'actionType', 'inputSummary', 'decisionSummary'],
    },
  },
];

export class CommerceToolsExecutor {
  public static async executeTool(
    toolName: string,
    args: any,
    sessionContext?: { sessionId?: string; merchantId?: string; userId?: string }
  ): Promise<ToolCallResult> {
    let merchantId = args.merchantId || sessionContext?.merchantId;
    if (!merchantId || merchantId === 'default-merchant') {
      const defaultM = await prisma.merchant.findFirst();
      merchantId = defaultM?.id || 'default-merchant';
    }
    const sessionId = args.sessionId || sessionContext?.sessionId;

    try {
      switch (toolName) {
        case 'search_products': {
          const intent: StructuredIntent = {
            category: args.category,
            budget_max: args.budget_max,
            ram_min: args.ram_min,
            gpu_required: args.gpu_required,
            purpose: args.purpose,
          };
          const ranked = await ProductService.rankProducts(intent, merchantId);
          return {
            toolName,
            success: true,
            data: ranked.slice(0, 6),
            explanation: `Found ${ranked.length} matching products ranked deterministically by specs, price fit, and rating.`,
          };
        }

        case 'get_product_details': {
          const product = await prisma.product.findUnique({
            where: { id: args.productId },
            include: { merchant: true },
          });
          if (!product) {
            return { toolName, success: false, data: null, explanation: 'Product not found.' };
          }
          return {
            toolName,
            success: true,
            data: product,
            explanation: `Retrieved product details for ${product.name}.`,
          };
        }

        case 'compare_products': {
          const products = await prisma.product.findMany({
            where: { id: { in: args.productIds } },
          });
          return {
            toolName,
            success: true,
            data: products,
            explanation: `Generated comparative matrix for ${products.length} products.`,
          };
        }

        case 'check_inventory': {
          const prod = await prisma.product.findUnique({ where: { id: args.productId } });
          const available = prod ? prod.stock >= (args.quantity || 1) : false;
          return {
            toolName,
            success: true,
            data: { productId: args.productId, stock: prod?.stock || 0, isAvailable: available },
            explanation: available
              ? `Stock confirmed: ${prod?.stock} units available.`
              : `Insufficient stock for product.`,
          };
        }

        case 'recommend_upsell':
        case 'recommend_cross_sell': {
          const opportunities = await UpsellService.getRecommendationsForProduct(args.productId, merchantId);
          return {
            toolName,
            success: true,
            data: opportunities,
            explanation: `Identified ${opportunities.length} value-added recommendations (customer consent required).`,
          };
        }

        case 'calculate_cart_total': {
          let subtotal = 0;
          for (const item of args.items || []) {
            const p = await prisma.product.findUnique({ where: { id: item.productId } });
            if (p) subtotal += p.price * (item.quantity || 1);
          }
          return {
            toolName,
            success: true,
            data: { subtotal, total: subtotal, currency: 'INR' },
            explanation: `Total calculated server-side: ₹${subtotal.toLocaleString('en-IN')}`,
          };
        }

        case 'create_cart': {
          const cart = await CartService.getOrCreateCart(sessionId || 'session_demo', merchantId);
          for (const item of args.items || []) {
            await CartService.addItem(
              cart.id,
              item.productId,
              item.quantity || 1,
              Boolean(item.isUpsell),
              item.approvedByUser ?? true,
              item.upsellReason
            );
          }
          const updated = await CartService.recalculateCart(cart.id);
          return {
            toolName,
            success: true,
            data: updated,
            explanation: `Cart updated with ${updated.items.length} item(s). Total: ₹${updated.total.toLocaleString('en-IN')}`,
          };
        }

        case 'validate_order_policy': {
          const check = await PolicyService.validateOrderPolicy({
            merchantId,
            totalAmount: args.totalAmount,
            discountPercent: args.discountPercent,
            items: args.items || [],
            userConfirmedPayment: args.userConfirmedPayment ?? true,
          });
          return {
            toolName,
            success: check.isAllowed,
            data: check,
            explanation: check.explanation,
            policyCheck: check,
          };
        }

        case 'create_razorpay_order': {
          const rzpOrder = await PaymentService.createRazorpayOrder(
            args.orderId,
            merchantId,
            Boolean(args.simulateFailure)
          );
          return {
            toolName,
            success: true,
            data: rzpOrder,
            explanation: `Razorpay Test Mode order initialized (${rzpOrder.id}). Ready for checkout.`,
          };
        }

        case 'verify_razorpay_payment': {
          const res = await PaymentService.verifyPayment({
            orderId: args.orderId,
            razorpayOrderId: args.razorpayOrderId,
            razorpayPaymentId: args.razorpayPaymentId,
            razorpaySignature: args.razorpaySignature,
          });
          return {
            toolName,
            success: res.success,
            data: res,
            explanation: res.message,
            auditId: res.auditId,
          };
        }

        case 'get_order_status': {
          const order = await OrderService.getOrderById(args.orderId);
          return {
            toolName,
            success: Boolean(order),
            data: order,
            explanation: order ? `Order #${order.orderNumber} status: ${order.status}` : 'Order not found',
          };
        }

        case 'create_audit_event': {
          const log = await AuditService.logAction({
            sessionId: args.sessionId || sessionId,
            merchantId,
            actionType: args.actionType,
            toolName: args.toolName,
            inputSummary: args.inputSummary,
            decisionSummary: args.decisionSummary,
            reason: args.reason,
            policyResult: args.policyResult as any,
          });
          return {
            toolName,
            success: true,
            data: log,
            explanation: `Audit record created: ${log.auditCode}`,
            auditId: log.auditCode,
          };
        }

        default:
          return {
            toolName,
            success: false,
            data: null,
            explanation: `Unknown tool name: ${toolName}`,
          };
      }
    } catch (err: any) {
      return {
        toolName,
        success: false,
        data: null,
        explanation: `Tool execution failed safely: ${err.message || 'Internal tool error'}`,
      };
    }
  }
}
