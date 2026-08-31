import { Request, Response } from 'express';
import { OrderService } from '../services/orderService.js';
import { prisma } from '../lib/prisma.js';

export class OrderController {
  public static async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { merchantId, cartId, customerId, items, customerName, customerEmail, customerPhone, isAiAssisted } = req.body;

      let resolvedMerchantId = merchantId;
      if (!resolvedMerchantId) {
        const m = await prisma.merchant.findFirst();
        resolvedMerchantId = m?.id || 'default-merchant';
      }

      const order = await OrderService.createOrder({
        merchantId: resolvedMerchantId,
        cartId,
        customerId,
        items: items || [],
        customerName,
        customerEmail,
        customerPhone,
        isAiAssisted: isAiAssisted ?? true,
      });

      res.status(201).json({ success: true, data: order });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  public static async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const order = await OrderService.getOrderById(id);

      if (!order) {
        res.status(404).json({ success: false, message: 'Order not found.' });
        return;
      }

      res.json({ success: true, data: order });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async listOrders(req: Request, res: Response): Promise<void> {
    try {
      const { merchantId, status, limit } = req.query;

      const whereClause: any = {};
      if (merchantId) whereClause.merchantId = String(merchantId);
      if (status) whereClause.status = String(status);

      const orders = await prisma.order.findMany({
        where: whereClause,
        include: {
          items: true,
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
        take: limit ? parseInt(String(limit), 10) : 50,
      });

      res.json({ success: true, count: orders.length, data: orders });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
