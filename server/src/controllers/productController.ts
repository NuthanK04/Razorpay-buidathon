import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { ProductService } from '../services/productService.js';
import { IntentExtractor } from '../ai/intentExtractor.js';

export class ProductController {
  public static async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const { category, search, minPrice, maxPrice, merchantId, sort } = req.query;

      const whereClause: any = { active: true };
      if (merchantId) whereClause.merchantId = String(merchantId);
      if (category && category !== 'all') whereClause.category = String(category);
      if (search) {
        whereClause.OR = [
          { name: { contains: String(search) } },
          { description: { contains: String(search) } },
          { tags: { contains: String(search) } },
        ];
      }
      if (minPrice || maxPrice) {
        whereClause.price = {};
        if (minPrice) whereClause.price.gte = parseFloat(String(minPrice));
        if (maxPrice) whereClause.price.lte = parseFloat(String(maxPrice));
      }

      let orderBy: any = { priorityScore: 'desc' };
      if (sort === 'price_asc') orderBy = { price: 'asc' };
      if (sort === 'price_desc') orderBy = { price: 'desc' };
      if (sort === 'rating') orderBy = { rating: 'desc' };

      const products = await prisma.product.findMany({
        where: whereClause,
        orderBy,
        include: {
          merchant: { select: { id: true, storeName: true, slug: true } },
          relationshipsFrom: {
            include: { targetProduct: true },
          },
        },
      });

      const formatted = products.map((p) => {
        let features = [];
        let specs = {};
        try { features = JSON.parse(p.features); } catch { features = [p.features]; }
        try { specs = JSON.parse(p.specifications); } catch { specs = {}; }
        return {
          ...p,
          features,
          specifications: specs,
          tags: p.tags ? p.tags.split(',') : [],
        };
      });

      res.json({ success: true, count: formatted.length, data: formatted });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          merchant: true,
          relationshipsFrom: {
            where: { active: true },
            include: { targetProduct: true },
          },
        },
      });

      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      let features = [];
      let specs = {};
      try { features = JSON.parse(product.features); } catch { features = [product.features]; }
      try { specs = JSON.parse(product.specifications); } catch { specs = {}; }

      res.json({
        success: true,
        data: {
          ...product,
          features,
          specifications: specs,
          tags: product.tags ? product.tags.split(',') : [],
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async searchAndRank(req: Request, res: Response): Promise<void> {
    try {
      const { query, category, budget_max, ram_min, gpu_required, merchantId } = req.body;

      const intent = query
        ? IntentExtractor.extractIntent(query)
        : {
            category,
            budget_max: budget_max ? parseFloat(budget_max) : undefined,
            ram_min: ram_min ? parseInt(ram_min, 10) : undefined,
            gpu_required: Boolean(gpu_required),
          };

      const ranked = await ProductService.rankProducts(intent, merchantId);
      res.json({ success: true, count: ranked.length, intent, data: ranked });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  public static async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { merchantId, name, description, category, price, originalPrice, stock, features, specifications, tags, imageUrl } = req.body;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const product = await prisma.product.create({
        data: {
          merchantId,
          name,
          slug: `${slug}-${Date.now().toString().slice(-4)}`,
          description,
          category,
          price: parseFloat(price),
          originalPrice: originalPrice ? parseFloat(originalPrice) : null,
          stock: parseInt(stock, 10) || 10,
          features: typeof features === 'string' ? features : JSON.stringify(features || []),
          specifications: typeof specifications === 'string' ? specifications : JSON.stringify(specifications || {}),
          tags: Array.isArray(tags) ? tags.join(',') : (tags || ''),
          imageUrl,
        },
      });

      res.status(201).json({ success: true, data: product });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
