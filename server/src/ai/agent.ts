import { IntentExtractor } from './intentExtractor.js';
import { CommerceToolsExecutor } from './tools.js';
import { prisma } from '../lib/prisma.js';
import { AuditService } from '../services/auditService.js';
import { ProductService } from '../services/productService.js';
import { UpsellService } from '../services/upsellService.js';
import { CartService } from '../services/cartService.js';
import { OrderService } from '../services/orderService.js';
import { PaymentService } from '../services/paymentService.js';
import { StructuredIntent } from '../types/index.js';

export interface AgentProcessInput {
  sessionId: string;
  merchantId: string;
  message: string;
  customerId?: string;
  contextData?: Record<string, any>;
}

export interface AgentProcessOutput {
  sessionId: string;
  reply: string;
  intent: StructuredIntent;
  products?: any[];
  upsellOpportunity?: any;
  cart?: any;
  order?: any;
  paymentOrder?: any;
  auditCode?: string;
  actionRequired?: 'NONE' | 'SELECT_PRODUCT' | 'APPROVE_UPSELL' | 'CONFIRM_ORDER' | 'PAY_NOW' | 'CLARIFY';
  policyCheckPassed?: boolean;
}

export class AgentCartAgent {
  /**
   * Primary agent conversational loop and multi-turn state machine
   */
  public static async processMessage(input: AgentProcessInput): Promise<AgentProcessOutput> {
    const { sessionId, merchantId, message, customerId, contextData } = input;

    // 1. Get or create AI Session
    let session = await prisma.aiSession.findUnique({
      where: { sessionId },
    });

    if (!session) {
      session = await prisma.aiSession.create({
        data: {
          sessionId,
          merchantId,
          customerId,
          status: 'ACTIVE',
        },
      });
    }

    // 2. Persist User Message
    await prisma.aiMessage.create({
      data: {
        aiSessionId: session.id,
        role: 'user',
        content: message,
      },
    });

    // 3. Extract Intent
    const intent = IntentExtractor.extractIntent(message);

    // Save intent in session
    await prisma.aiSession.update({
      where: { id: session.id },
      data: { intentSummary: JSON.stringify(intent) },
    });

    // Log Intent extraction in Audit Log
    const auditRecord = await AuditService.logAction({
      sessionId,
      merchantId,
      actionType: 'INTENT_EXTRACTION',
      toolName: 'extract_intent',
      inputSummary: message.length > 80 ? `${message.substring(0, 80)}...` : message,
      decisionSummary: `Extracted intent: Category: ${intent.category || 'General'}, Budget: ₹${intent.budget_max || 'Flexible'}, RAM: ${intent.ram_min || 'Any'}GB, GPU: ${intent.gpu_required ? 'Yes' : 'No'}`,
      reason: intent.purpose || 'Customer natural query parsing',
    });

    const lower = message.toLowerCase();

    // SCENARIO A: Clarification needed
    if (intent.is_clarification_needed && !contextData?.selectedProductId && !lower.includes('compare') && !lower.includes('yes') && !lower.includes('buy')) {
      const reply = intent.clarification_question || 'What is your maximum budget and primary use case?';
      await this.saveAssistantMessage(session.id, reply);
      return {
        sessionId,
        reply,
        intent,
        actionRequired: 'CLARIFY',
        auditCode: auditRecord.auditCode,
      };
    }

    // SCENARIO B: Product Comparison Request (e.g. "Compare the first two", "Which is better value?")
    if (lower.includes('compare') || lower.includes('better value') || lower.includes('best value') || lower.includes('difference')) {
      const ranked = await ProductService.rankProducts(intent, merchantId);
      const topProducts = ranked.slice(0, 2);

      if (topProducts.length >= 2) {
        const p1 = topProducts[0];
        const p2 = topProducts[1];

        const comparisonPitch = `Here is how the top two options compare:
• **${p1.name} (₹${p1.price.toLocaleString('en-IN')})**: Offers the best overall performance-to-price ratio with ${p1.specifications.ram || '16GB'} RAM and ${p1.specifications.gpu || 'dedicated GPU'}. Scored highest (${p1.score * 100}%) on your requirements.
• **${p2.name} (₹${p2.price.toLocaleString('en-IN')})**: Strong alternative option at ₹${p2.price.toLocaleString('en-IN')}, featuring ${p2.specifications.cpu || 'high-tier processor'}.

**Verdict**: **${p1.name}** is the strongest match for your budget and AI development workload. Would you like to select it?`;

        await this.saveAssistantMessage(session.id, comparisonPitch);
        return {
          sessionId,
          reply: comparisonPitch,
          intent,
          products: topProducts,
          actionRequired: 'SELECT_PRODUCT',
          auditCode: auditRecord.auditCode,
        };
      }
    }

    // SCENARIO C: Product Selection (e.g. "I like the first one", "Select ASUS", "Add laptop to cart")
    if (
      lower.includes('like the first') ||
      lower.includes('first one') ||
      lower.includes('select') ||
      lower.includes('choose') ||
      contextData?.action === 'SELECT_PRODUCT' ||
      contextData?.selectedProductId
    ) {
      let selectedProduct: any = null;
      if (contextData?.selectedProductId) {
        selectedProduct = await prisma.product.findUnique({ where: { id: contextData.selectedProductId } });
      } else {
        const ranked = await ProductService.rankProducts(intent, merchantId);
        selectedProduct = ranked[0];
      }

      if (selectedProduct) {
        // Add selected product to cart
        const cart = await CartService.getOrCreateCart(sessionId, merchantId, customerId);
        await CartService.addItem(cart.id, selectedProduct.id, 1, false, true);
        const updatedCart = await CartService.recalculateCart(cart.id);

        // Detect intelligent Upsell / Cross-Sell Opportunity
        const opportunities = await UpsellService.getRecommendationsForProduct(selectedProduct.id, merchantId);
        const bestUpsell = opportunities[0];

        let reply = '';
        if (bestUpsell) {
          reply = `Great choice! I have added **${selectedProduct.name}** (₹${selectedProduct.price.toLocaleString('en-IN')}) to your cart.\n\n💡 **Recommended Protection & Performance Upgrade**:\n${bestUpsell.suggestedPitch}\n\n*Would you like to add the ${bestUpsell.targetProduct.name} for ₹${bestUpsell.discountedPrice.toLocaleString('en-IN')}?* (Click Yes to add, or proceed without it).`;

          // Track upsell impression
          await prisma.aiSession.update({
            where: { id: session.id },
            data: { upsellOfferedCount: { increment: 1 } },
          });

          await AuditService.logAction({
            sessionId,
            merchantId,
            actionType: 'UPSELL_OFFERED',
            toolName: 'recommend_upsell',
            inputSummary: `Selected product: ${selectedProduct.name}`,
            decisionSummary: `Suggested ${bestUpsell.targetProduct.name} (₹${bestUpsell.discountedPrice})`,
            reason: bestUpsell.reason,
            policyResult: 'PASSED',
          });

          await this.saveAssistantMessage(session.id, reply);
          return {
            sessionId,
            reply,
            intent,
            cart: updatedCart,
            upsellOpportunity: bestUpsell,
            actionRequired: 'APPROVE_UPSELL',
            auditCode: auditRecord.auditCode,
          };
        } else {
          reply = `I have added **${selectedProduct.name}** to your cart for ₹${selectedProduct.price.toLocaleString('en-IN')}. Your total is ₹${updatedCart.total.toLocaleString('en-IN')}. Please confirm when you are ready to complete payment.`;
          await this.saveAssistantMessage(session.id, reply);
          return {
            sessionId,
            reply,
            intent,
            cart: updatedCart,
            actionRequired: 'CONFIRM_ORDER',
            auditCode: auditRecord.auditCode,
          };
        }
      }
    }

    // SCENARIO D: Customer Approves Upsell ("Yes", "Add warranty", "Add it", "Sure")
    if (
      (lower === 'yes' || lower.includes('add warranty') || lower.includes('add it') || lower.includes('sure') || lower.includes('accept') || contextData?.action === 'ACCEPT_UPSELL') &&
      contextData?.upsellProductId
    ) {
      const cart = await CartService.getOrCreateCart(sessionId, merchantId, customerId);
      const upsellProd = await prisma.product.findUnique({ where: { id: contextData.upsellProductId } });

      if (upsellProd) {
        await CartService.addItem(
          cart.id,
          upsellProd.id,
          1,
          true,
          true,
          'Customer approved recommended warranty/protection plan'
        );
        const updatedCart = await CartService.recalculateCart(cart.id);

        await prisma.aiSession.update({
          where: { id: session.id },
          data: {
            upsellAcceptedCount: { increment: 1 },
            totalGeneratedRevenue: { increment: updatedCart.total },
          },
        });

        await AuditService.logAction({
          sessionId,
          merchantId,
          actionType: 'UPSELL_ACCEPTED',
          toolName: 'create_cart',
          inputSummary: `Upsell product ID: ${upsellProd.name}`,
          decisionSummary: `Added approved upsell (${upsellProd.name}) - New Total: ₹${updatedCart.total.toLocaleString('en-IN')}`,
          reason: 'Customer gave explicit affirmative consent.',
          policyResult: 'PASSED',
        });

        const reply = `Perfect! The **${upsellProd.name}** (₹${upsellProd.price.toLocaleString('en-IN')}) has been added.\n\nYour updated cart total is **₹${updatedCart.total.toLocaleString('en-IN')}**.\n\nPlease confirm your purchase to proceed to secure Razorpay checkout.`;

        await this.saveAssistantMessage(session.id, reply);
        return {
          sessionId,
          reply,
          intent,
          cart: updatedCart,
          actionRequired: 'CONFIRM_ORDER',
          auditCode: auditRecord.auditCode,
        };
      }
    }

    // SCENARIO E: Customer Declines Upsell ("No", "Skip", "Just laptop", "No thanks")
    if (lower === 'no' || lower.includes('no thanks') || lower.includes('skip') || lower.includes('just the') || contextData?.action === 'DECLINE_UPSELL') {
      const cart = await CartService.getOrCreateCart(sessionId, merchantId, customerId);
      const reply = `Understood! Proceeding with your base selection. Your cart total is **₹${cart.total.toLocaleString('en-IN')}**.\n\nPlease confirm your purchase when ready to launch checkout.`;
      await this.saveAssistantMessage(session.id, reply);
      return {
        sessionId,
        reply,
        intent,
        cart,
        actionRequired: 'CONFIRM_ORDER',
        auditCode: auditRecord.auditCode,
      };
    }

    // SCENARIO F: Purchase Confirmation & Razorpay Order Generation
    if (lower.includes('confirm') || lower.includes('proceed to pay') || lower.includes('pay now') || contextData?.action === 'CONFIRM_PURCHASE') {
      const cart = await CartService.getOrCreateCart(sessionId, merchantId, customerId);
      if (cart.items.length === 0) {
        const reply = 'Your cart is empty. Please select a product first.';
        await this.saveAssistantMessage(session.id, reply);
        return { sessionId, reply, intent, actionRequired: 'SELECT_PRODUCT' };
      }

      // 1. Create Internal Order
      const order = await OrderService.createOrder({
        merchantId,
        cartId: cart.id,
        customerId,
        items: cart.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          isUpsell: i.isUpsell,
          approvedByUser: i.approvedByUser,
          upsellReason: i.upsellReason || undefined,
        })),
        isAiAssisted: true,
      });

      // 2. Initialize Razorpay Test Mode Order
      const rzpOrder = await PaymentService.createRazorpayOrder(order.id, merchantId, Boolean(contextData?.simulateFailure));

      const reply = `Order **#${order.orderNumber}** validated by Policy Engine (Total: ₹${order.totalAmount.toLocaleString('en-IN')}).\n\nLaunching secure Razorpay Test Mode checkout...`;

      await this.saveAssistantMessage(session.id, reply);
      return {
        sessionId,
        reply,
        intent,
        order,
        paymentOrder: rzpOrder,
        actionRequired: 'PAY_NOW',
        policyCheckPassed: true,
        auditCode: auditRecord.auditCode,
      };
    }

    // SCENARIO G: Default Search & Rank Flow (Initial or Refined Prompt)
    const rankedProducts = await ProductService.rankProducts(intent, merchantId);
    const topPicks = rankedProducts.slice(0, 3);

    let reply = '';
    if (topPicks.length > 0) {
      const best = topPicks[0];
      const countMsg = `I found **${rankedProducts.length}** matching products in our catalog. Here are the strongest recommendations:`;
      const bestMsg = `\n\n🌟 **Top Recommendation: ${best.name}** — ₹${best.price.toLocaleString('en-IN')}\n• *Why it fits*: ${best.matchReason}\n• *Specs*: ${best.specifications.ram || '16GB'} RAM | ${best.specifications.gpu || 'Dedicated GPU'} | ${best.specifications.cpu || 'Multi-core CPU'}`;

      reply = `${countMsg}${bestMsg}\n\nYou can click **Select** on any card, ask me to **Compare** the options, or refine your requirements!`;
    } else {
      reply = `I searched our catalog for "${message}" but couldn't find an exact match under your specific constraints. Would you like to adjust your budget or explore related categories?`;
    }

    await this.saveAssistantMessage(session.id, reply);
    return {
      sessionId,
      reply,
      intent,
      products: topPicks,
      actionRequired: 'SELECT_PRODUCT',
      auditCode: auditRecord.auditCode,
    };
  }

  private static async saveAssistantMessage(aiSessionId: string, content: string) {
    await prisma.aiMessage.create({
      data: {
        aiSessionId,
        role: 'assistant',
        content,
      },
    });
  }
}
