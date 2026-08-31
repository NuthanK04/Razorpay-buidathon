import { Request, Response } from 'express';
import { AgentCartAgent } from '../ai/agent.js';
import { IntentExtractor } from '../ai/intentExtractor.js';
import { ProductService } from '../services/productService.js';
import { UpsellService } from '../services/upsellService.js';
import { prisma } from '../lib/prisma.js';

export class AiController {
  public static async chat(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, merchantId, message, customerId, contextData } = req.body;

      if (!message) {
        res.status(400).json({ success: false, message: 'Message is required.' });
        return;
      }

      // Find default merchant if not specified
      let resolvedMerchantId = merchantId;
      if (!resolvedMerchantId) {
        const defaultMerchant = await prisma.merchant.findFirst();
        resolvedMerchantId = defaultMerchant?.id || 'default-merchant';
      }

      const sessionKey = sessionId || `session_${Date.now()}`;

      const agentResult = await AgentCartAgent.processMessage({
        sessionId: sessionKey,
        merchantId: resolvedMerchantId,
        message,
        customerId,
        contextData,
      });

      res.json({
        success: true,
        data: agentResult,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'AI processing encountered an unexpected issue.',
        fallbackNotice: 'AI shopping assistance temporarily degraded. You can continue shopping normally via the catalog.',
      });
    }
  }

  public static async extractIntent(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.body;
      if (!query) {
        res.status(400).json({ success: false, message: 'Query is required.' });
        return;
      }

      const intent = IntentExtractor.extractIntent(query);
      res.json({ success: true, data: intent });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async getRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const { query, merchantId, weights } = req.body;
      const intent = query ? IntentExtractor.extractIntent(query) : req.body.intent || {};

      const ranked = await ProductService.rankProducts(intent, merchantId, weights);
      res.json({
        success: true,
        intent,
        count: ranked.length,
        data: {
          bestMatch: ranked[0] || null,
          alternativeOption: ranked[1] || null,
          budgetOption: ranked.find((r) => r.badge === 'BUDGET_OPTION') || ranked[2] || null,
          allRanked: ranked,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async getUpsellOpportunities(req: Request, res: Response): Promise<void> {
    try {
      const { productId, merchantId } = req.body;
      if (!productId) {
        res.status(400).json({ success: false, message: 'productId is required.' });
        return;
      }

      const opportunities = await UpsellService.getRecommendationsForProduct(productId, merchantId);
      res.json({ success: true, count: opportunities.length, data: opportunities });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
