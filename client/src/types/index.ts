export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  imageUrl?: string;
  category?: 'Bags' | 'Apparel' | 'Accessories' | 'Essentials' | string;
  material?: string;
  dimensions?: string;
  origin?: string;
  color?: string;
  badge?: string;
  details?: string[];
  score?: number;
  specifications?: Record<string, any>;
  stock?: number;
  matchReason?: string;
}

export interface CartItem {
  id?: string;
  productId?: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  isUpsell?: boolean;
  approvedByUser?: boolean;
  upsellReason?: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  totalAmount?: number;
  totalQuantity?: number;
}

export interface Order {
  id: string;
  orderId?: string;
  orderNumber?: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  totalAmount?: number;
  customerName?: string;
  isAiAssisted?: boolean;
  hasUpsell?: boolean;
  status: string;
  createdAt: string;
  auditId?: string;
  paymentId?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action?: string;
  details?: string;
  policyResult?: string;
  executionResult?: string;
  auditCode?: string;
  actionType?: string;
  toolName?: string;
  decisionSummary?: string;
  inputSummary?: string;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface MerchantMetrics {
  revenue?: any;
  performance?: any;
  experiment?: any;
  dailyTrends?: any[];
  recentOrders?: any[];
  totalRevenue?: number;
  totalOrders?: number;
  avgOrderValue?: number;
  conversionRate?: number;
  agenticGrowthRate?: number;
  upsellConversionRate?: number;
  autonomousTransactions?: number;
  activeAgents?: number;
}

export interface UpsellOpportunity {
  id: string;
  originalProductId: string;
  targetProductId: string;
  targetProduct: Product;
  suggestedProduct?: Product;
  discountPercentage: number;
  discountedPrice: number;
  confidenceScore: number;
  relationshipType: string;
  rationale?: string;
  reason?: string;
}

export interface AddToBasketImageHandle {
  getElement: () => HTMLElement | null;
  getRect: () => DOMRect | null;
}

export interface AddToBasketTargetHandle {
  getElement: () => HTMLElement | null;
  getRect: () => DOMRect | null;
  react: () => void;
}

export interface AddToBasketParams {
  image: AddToBasketImageHandle | null;
  basket: AddToBasketTargetHandle | null;
  duration?: number;
}
