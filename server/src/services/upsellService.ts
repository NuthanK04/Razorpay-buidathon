import { prisma } from '../lib/prisma.js';
import { UpsellOpportunity } from '../types/index.js';

export class UpsellService {
  /**
   * Find intelligent upsell and cross-sell opportunities for a selected product
   */
  public static async getRecommendationsForProduct(
    productId: string,
    merchantId?: string
  ): Promise<UpsellOpportunity[]> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        relationshipsFrom: {
          where: { active: true },
          include: {
            targetProduct: true,
          },
          orderBy: { priority: 'asc' },
        },
      },
    });

    if (!product) {
      return [];
    }

    const opportunities: UpsellOpportunity[] = [];

    // 1. Check explicit merchant-configured relationships
    if (product.relationshipsFrom && product.relationshipsFrom.length > 0) {
      for (const rel of product.relationshipsFrom) {
        if (!rel.targetProduct.active || rel.targetProduct.stock <= 0) continue;

        const discountPercent = rel.discountPercent || 0;
        const discountedPrice = Math.round(rel.targetProduct.price * (1 - discountPercent / 100));

        let suggestedPitch = rel.reason;
        if (!suggestedPitch) {
          if (rel.type === 'WARRANTY') {
            suggestedPitch = `Since this ${product.name} is a high-value investment, the ${rel.targetProduct.name} protects against accidental hardware damage and battery degradation for ₹${discountedPrice.toLocaleString('en-IN')}.`;
          } else if (rel.type === 'ACCESSORY' || rel.type === 'CROSS_SELL') {
            suggestedPitch = `Pairing the ${product.name} with the ${rel.targetProduct.name} maximizes ergonomics and workflow efficiency.`;
          } else {
            suggestedPitch = `Enhance your setup with the ${rel.targetProduct.name} at a special bundle price of ₹${discountedPrice.toLocaleString('en-IN')}.`;
          }
        }

        opportunities.push({
          sourceProductId: product.id,
          targetProductId: rel.targetProduct.id,
          targetProduct: {
            id: rel.targetProduct.id,
            name: rel.targetProduct.name,
            description: rel.targetProduct.description,
            price: rel.targetProduct.price,
            originalPrice: rel.targetProduct.originalPrice,
            category: rel.targetProduct.category,
            imageUrl: rel.targetProduct.imageUrl,
          },
          relationshipType: rel.type as any,
          discountPercent,
          discountedPrice,
          reason: rel.reason || suggestedPitch,
          suggestedPitch,
          priority: rel.priority,
        });
      }
    }

    // 2. If no explicit relationships exist, dynamically find logical accessories/warranties in the same merchant catalog
    if (opportunities.length === 0) {
      const relatedProducts = await prisma.product.findMany({
        where: {
          merchantId: product.merchantId,
          active: true,
          stock: { gt: 0 },
          id: { not: product.id },
          category: { in: ['warranty', 'accessories', 'mice', 'keyboards', 'headphones'] },
        },
        take: 3,
      });

      for (const relProd of relatedProducts) {
        const isWarranty = relProd.category === 'warranty' || relProd.name.toLowerCase().includes('warranty') || relProd.name.toLowerCase().includes('protection');
        const relType = isWarranty ? 'WARRANTY' : 'CROSS_SELL';
        const pitch = isWarranty
          ? `Protect your ${product.name} with ${relProd.name} for just ₹${relProd.price.toLocaleString('en-IN')}.`
          : `Add the complementary ${relProd.name} for ₹${relProd.price.toLocaleString('en-IN')} to complete your setup.`;

        opportunities.push({
          sourceProductId: product.id,
          targetProductId: relProd.id,
          targetProduct: {
            id: relProd.id,
            name: relProd.name,
            description: relProd.description,
            price: relProd.price,
            originalPrice: relProd.originalPrice,
            category: relProd.category,
            imageUrl: relProd.imageUrl,
          },
          relationshipType: relType,
          discountPercent: 0,
          discountedPrice: relProd.price,
          reason: pitch,
          suggestedPitch: pitch,
          priority: isWarranty ? 1 : 2,
        });
      }
    }

    return opportunities;
  }
}
