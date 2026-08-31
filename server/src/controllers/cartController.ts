import { Request, Response } from 'express';
import { CartService } from '../services/cartService.js';
import { prisma } from '../lib/prisma.js';

export class CartController {
  public static async getCart(req: Request, res: Response): Promise<void> {
    try {
      const sessionId = String(req.params.sessionId);
      const { merchantId } = req.query;

      let resolvedMerchantId = String(merchantId || '');
      if (!resolvedMerchantId) {
        const m = await prisma.merchant.findFirst();
        resolvedMerchantId = m?.id || 'default-merchant';
      }

      const cart = await CartService.getOrCreateCart(sessionId, resolvedMerchantId);
      res.json({ success: true, data: cart });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async addItem(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, merchantId, productId, quantity, isUpsell, approvedByUser, upsellReason } = req.body;

      if (!sessionId || !productId) {
        res.status(400).json({ success: false, message: 'sessionId and productId are required.' });
        return;
      }

      let resolvedMerchantId = merchantId;
      if (!resolvedMerchantId) {
        const m = await prisma.merchant.findFirst();
        resolvedMerchantId = m?.id || 'default-merchant';
      }

      const cart = await CartService.getOrCreateCart(sessionId, resolvedMerchantId);
      const updatedCart = await CartService.addItem(
        cart.id,
        productId,
        quantity || 1,
        Boolean(isUpsell),
        approvedByUser ?? true,
        upsellReason
      );

      res.json({ success: true, data: updatedCart });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  public static async removeItem(req: Request, res: Response): Promise<void> {
    try {
      const cartId = String(req.params.cartId);
      const itemId = String(req.params.itemId);
      const updatedCart = await CartService.removeItem(cartId, itemId);
      res.json({ success: true, data: updatedCart });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
