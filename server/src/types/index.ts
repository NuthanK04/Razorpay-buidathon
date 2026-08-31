export interface StructuredIntent {
  category?: string;
  budget_max?: number;
  budget_min?: number;
  ram_min?: number;
  gpu_required?: boolean;
  screen_size_min?: number;
  brand_preference?: string[];
  purpose?: string;
  priority?: 'performance_value' | 'budget_first' | 'premium_quality' | 'portability' | 'battery_life';
  raw_query?: string;
  is_clarification_needed?: boolean;
  clarification_question?: string;
}

export interface ProductScoringWeights {
  requirementMatch: number; // default 0.35
  priceFit: number;         // default 0.25
  rating: number;           // default 0.15
  inventoryAvailability: number; // default 0.15
  merchantPriority: number; // default 0.10
}

export interface RankedProduct {
  id: string;
  merchantId: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  stock: number;
  rating: number;
  reviewsCount: number;
  features: string[];
  specifications: Record<string, any>;
  tags: string[];
  imageUrl?: string | null;
  score: number;
  matchScore: number;
  priceFitScore: number;
  ratingScore: number;
  stockScore: number;
  merchantPriorityScore: number;
  badge?: 'BEST_MATCH' | 'ALTERNATIVE_OPTION' | 'BUDGET_OPTION' | 'POPULAR_CHOICE';
  matchReason: string;
}

export interface UpsellOpportunity {
  sourceProductId: string;
  targetProductId: string;
  targetProduct: {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number | null;
    category: string;
    imageUrl?: string | null;
  };
  relationshipType: 'UPSELL' | 'CROSS_SELL' | 'ACCESSORY' | 'WARRANTY';
  discountPercent: number;
  discountedPrice: number;
  reason: string;
  suggestedPitch: string;
  priority: number;
}

export interface PolicyValidationResult {
  isValid: boolean;
  policyCode: string;
  policyName: string;
  policyResult: 'PASSED' | 'VIOLATION' | 'BYPASS';
  message: string;
  details?: Record<string, any>;
}

export interface ComprehensivePolicyCheck {
  isAllowed: boolean;
  violations: PolicyValidationResult[];
  passedPolicies: PolicyValidationResult[];
  explanation: string;
}

export interface ToolCallResult {
  toolName: string;
  success: boolean;
  data: any;
  explanation: string;
  policyCheck?: ComprehensivePolicyCheck;
  auditId?: string;
}

export interface RazorpayOrderCreationResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  keyId: string;
  isSimulated?: boolean;
}

export interface PaymentVerificationRequest {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  isSimulated?: boolean;
}

export interface PaymentVerificationResponse {
  success: boolean;
  orderId: string;
  orderNumber: string;
  paymentId?: string;
  status: 'PAID' | 'FAILED';
  message: string;
  auditId: string;
}
