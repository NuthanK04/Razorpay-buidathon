import { prisma } from '../lib/prisma.js';
import { ProductScoringWeights, RankedProduct, StructuredIntent } from '../types/index.js';

export class ProductService {
  /**
   * Deterministically score and rank products matching structured intent
   */
  public static async rankProducts(
    intent: StructuredIntent,
    merchantId?: string,
    customWeights?: Partial<ProductScoringWeights>
  ): Promise<RankedProduct[]> {
    // 1. Fetch active products
    const whereClause: any = { active: true };
    if (merchantId) {
      whereClause.merchantId = merchantId;
    }

    const rawProducts = await prisma.product.findMany({
      where: whereClause,
      include: {
        merchant: true,
      },
    });

    if (!rawProducts || rawProducts.length === 0) {
      return [];
    }

    // 2. Fetch merchant settings for scoring weights if available
    let weights: ProductScoringWeights = {
      requirementMatch: 0.35,
      priceFit: 0.25,
      rating: 0.15,
      inventoryAvailability: 0.15,
      merchantPriority: 0.10,
      ...customWeights,
    };

    if (merchantId) {
      const settings = await prisma.merchantSettings.findUnique({
        where: { merchantId },
      });
      if (settings) {
        weights = {
          requirementMatch: settings.rankingWeightMatch,
          priceFit: settings.rankingWeightPrice,
          rating: settings.rankingWeightRating,
          inventoryAvailability: settings.rankingWeightStock,
          merchantPriority: settings.rankingWeightPriority,
          ...customWeights,
        };
      }
    }

    // 3. Score each product
    const scoredProducts: RankedProduct[] = rawProducts.map((p) => {
      let features: string[] = [];
      let specs: Record<string, any> = {};
      let tags: string[] = [];

      try {
        features = typeof p.features === 'string' ? JSON.parse(p.features) : p.features;
      } catch {
        features = [p.features];
      }

      try {
        specs = typeof p.specifications === 'string' ? JSON.parse(p.specifications) : p.specifications;
      } catch {
        specs = {};
      }

      try {
        tags = p.tags ? p.tags.split(',').map((t) => t.trim().toLowerCase()) : [];
      } catch {
        tags = [];
      }

      // Calculate component scores (0 to 1 scale)
      const matchScore = this.calculateRequirementMatchScore(p, specs, tags, intent);
      const priceFitScore = this.calculatePriceFitScore(p.price, intent);
      const ratingScore = Math.min(Math.max((p.rating - 3.0) / 2.0, 0), 1.0); // 3.0-5.0 scale normalized
      const stockScore = p.stock > 10 ? 1.0 : p.stock > 0 ? p.stock / 10.0 : 0.0;
      const merchantPriorityScore = Math.min(Math.max((p.priorityScore || 1.0) / 2.0, 0), 1.0);

      // Weighted combination
      const totalScore =
        weights.requirementMatch * matchScore +
        weights.priceFit * priceFitScore +
        weights.rating * ratingScore +
        weights.inventoryAvailability * stockScore +
        weights.merchantPriority * merchantPriorityScore;

      const matchReason = this.generateExplainabilityReason(
        p.name,
        p.price,
        specs,
        intent,
        matchScore,
        priceFitScore
      );

      return {
        id: p.id,
        merchantId: p.merchantId,
        name: p.name,
        slug: p.slug,
        description: p.description,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        stock: p.stock,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        features,
        specifications: specs,
        tags,
        imageUrl: p.imageUrl,
        score: parseFloat(totalScore.toFixed(4)),
        matchScore: parseFloat(matchScore.toFixed(4)),
        priceFitScore: parseFloat(priceFitScore.toFixed(4)),
        ratingScore: parseFloat(ratingScore.toFixed(4)),
        stockScore: parseFloat(stockScore.toFixed(4)),
        merchantPriorityScore: parseFloat(merchantPriorityScore.toFixed(4)),
        matchReason,
      };
    });

    // 4. Sort descending by score
    scoredProducts.sort((a, b) => b.score - a.score);

    // 5. Assign badges (Best Match, Alternative Option, Budget Option)
    if (scoredProducts.length > 0) {
      scoredProducts[0].badge = 'BEST_MATCH';
    }
    if (scoredProducts.length > 1) {
      scoredProducts[1].badge = 'ALTERNATIVE_OPTION';
    }

    // Find the budget option (lowest price among high match products)
    const budgetCandidates = scoredProducts.filter(
      (p) => p.matchScore >= 0.6 && (!intent.budget_max || p.price <= intent.budget_max * 0.85)
    );
    if (budgetCandidates.length > 0 && scoredProducts.length > 2) {
      const budgetPick = budgetCandidates.sort((a, b) => a.price - b.price)[0];
      if (budgetPick && budgetPick.id !== scoredProducts[0].id && budgetPick.id !== scoredProducts[1].id) {
        budgetPick.badge = 'BUDGET_OPTION';
      } else if (scoredProducts[2]) {
        scoredProducts[2].badge = 'BUDGET_OPTION';
      }
    } else if (scoredProducts[2]) {
      scoredProducts[2].badge = 'BUDGET_OPTION';
    }

    return scoredProducts;
  }

  private static calculateRequirementMatchScore(
    product: any,
    specs: Record<string, any>,
    tags: string[],
    intent: StructuredIntent
  ): number {
    let matchPoints = 0;
    let totalCriteria = 0;

    // Category match
    if (intent.category) {
      totalCriteria += 2;
      if (
        product.category.toLowerCase().includes(intent.category.toLowerCase()) ||
        intent.category.toLowerCase().includes(product.category.toLowerCase())
      ) {
        matchPoints += 2;
      }
    }

    // RAM match (e.g. 16GB)
    if (intent.ram_min) {
      totalCriteria += 3;
      const ramSpec = specs.ram || specs.RAM || '';
      const ramNum = parseInt(String(ramSpec).replace(/\D/g, ''), 10) || 0;
      if (ramNum >= intent.ram_min) {
        matchPoints += 3;
      } else if (ramNum > 0) {
        matchPoints += Math.max(0, (ramNum / intent.ram_min) * 2);
      }
    }

    // GPU match
    if (intent.gpu_required) {
      totalCriteria += 3;
      const gpuSpec = (specs.gpu || specs.GPU || specs.graphics || '').toLowerCase();
      const isDedicated =
        gpuSpec.includes('rtx') ||
        gpuSpec.includes('gtx') ||
        gpuSpec.includes('radeon') ||
        gpuSpec.includes('dedicated') ||
        gpuSpec.includes('nvidia') ||
        tags.includes('dedicated-gpu') ||
        tags.includes('gpu');

      if (isDedicated) {
        matchPoints += 3;
      } else if (gpuSpec.length > 0) {
        matchPoints += 1;
      }
    }

    // Purpose / use case match (e.g. "AI development", "coding", "gaming")
    if (intent.purpose) {
      totalCriteria += 2;
      const purposeLower = intent.purpose.toLowerCase();
      const textToSearch = `${product.name} ${product.description} ${tags.join(' ')}`.toLowerCase();
      if (purposeLower.includes('ai') || purposeLower.includes('machine learning')) {
        if (textToSearch.includes('ai') || textToSearch.includes('tensor') || textToSearch.includes('rtx') || tags.includes('ai-ready')) {
          matchPoints += 2;
        }
      } else if (textToSearch.includes(purposeLower)) {
        matchPoints += 2;
      } else {
        matchPoints += 1;
      }
    }

    // Brand preference
    if (intent.brand_preference && intent.brand_preference.length > 0) {
      totalCriteria += 1;
      const brandMatch = intent.brand_preference.some((b) =>
        product.name.toLowerCase().includes(b.toLowerCase())
      );
      if (brandMatch) matchPoints += 1;
    }

    if (totalCriteria === 0) return 0.8; // Default baseline if no hard specs given
    return Math.min(1.0, matchPoints / totalCriteria);
  }

  private static calculatePriceFitScore(price: number, intent: StructuredIntent): number {
    if (!intent.budget_max) return 0.8;

    if (price <= intent.budget_max) {
      // Optimal price is between 70% and 98% of budget (maximizing specs within budget)
      const ratio = price / intent.budget_max;
      if (ratio >= 0.65 && ratio <= 1.0) {
        return 1.0;
      }
      return 0.75 + (ratio * 0.25);
    } else {
      // Penalize exceeding budget
      const overagePercent = (price - intent.budget_max) / intent.budget_max;
      if (overagePercent > 0.3) return 0.05; // 30% over budget is heavily penalized
      return Math.max(0.1, 1.0 - (overagePercent * 3));
    }
  }

  private static generateExplainabilityReason(
    name: string,
    price: number,
    specs: Record<string, any>,
    intent: StructuredIntent,
    matchScore: number,
    priceFitScore: number
  ): string {
    const reasons: string[] = [];

    if (intent.ram_min && specs.ram) {
      reasons.push(`satisfies your ${specs.ram} RAM requirement`);
    }
    if (intent.gpu_required && specs.gpu) {
      reasons.push(`features a dedicated ${specs.gpu} GPU`);
    }
    if (intent.budget_max && price <= intent.budget_max) {
      const formattedPrice = `₹${price.toLocaleString('en-IN')}`;
      const savings = intent.budget_max - price;
      if (savings > 2000) {
        reasons.push(`stays comfortably under your ₹${intent.budget_max.toLocaleString('en-IN')} budget at ${formattedPrice}`);
      } else {
        reasons.push(`fits your ₹${intent.budget_max.toLocaleString('en-IN')} budget at ${formattedPrice}`);
      }
    }
    if (intent.purpose && (intent.purpose.toLowerCase().includes('ai') || intent.purpose.toLowerCase().includes('development'))) {
      reasons.push('delivers high tensor/CUDA throughput optimal for local AI workloads');
    }

    if (reasons.length === 0) {
      return `Top-rated product in category with verified stock and strong price-to-performance value.`;
    }

    return `Strongest match because it ${reasons.join(', ')}.`;
  }
}
