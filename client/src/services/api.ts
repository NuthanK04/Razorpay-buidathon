import axios from 'axios';
import { Product, Cart, Order, AuditLog, MerchantMetrics, UpsellOpportunity } from '../types/index.js';

const API_BASE = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Products
  async getProducts(params?: { category?: string; search?: string; minPrice?: number; maxPrice?: number; sort?: string }): Promise<Product[]> {
    const res = await apiClient.get('/products', { params });
    return res.data.data;
  },

  async getProductById(id: string): Promise<Product> {
    const res = await apiClient.get(`/products/${id}`);
    return res.data.data;
  },

  // AI Agent
  async sendChatMessage(payload: {
    sessionId: string;
    message: string;
    merchantId?: string;
    contextData?: Record<string, any>;
  }) {
    const res = await apiClient.post('/ai/chat', payload);
    return res.data.data;
  },

  async extractIntent(query: string) {
    const res = await apiClient.post('/ai/intent', { query });
    return res.data.data;
  },

  async getRecommendations(query: string, merchantId?: string) {
    const res = await apiClient.post('/ai/recommend', { query, merchantId });
    return res.data.data;
  },

  async getUpsellOpportunities(productId: string, merchantId?: string): Promise<UpsellOpportunity[]> {
    const res = await apiClient.post('/ai/upsell', { productId, merchantId });
    return res.data.data;
  },

  // Cart
  async getCart(sessionId: string, merchantId?: string): Promise<Cart> {
    const res = await apiClient.get(`/cart/${sessionId}`, { params: { merchantId } });
    return res.data.data;
  },

  async addToCart(payload: {
    sessionId: string;
    productId: string;
    quantity?: number;
    isUpsell?: boolean;
    approvedByUser?: boolean;
    upsellReason?: string;
    merchantId?: string;
  }): Promise<Cart> {
    const res = await apiClient.post('/cart/items', payload);
    return res.data.data;
  },

  async removeFromCart(cartId: string, itemId: string): Promise<Cart> {
    const res = await apiClient.delete(`/cart/${cartId}/items/${itemId}`);
    return res.data.data;
  },

  // Orders
  async createOrder(payload: {
    merchantId?: string;
    cartId?: string;
    items: any[];
    customerName?: string;
    customerEmail?: string;
    isAiAssisted?: boolean;
  }): Promise<Order> {
    const res = await apiClient.post('/orders', payload);
    return res.data.data;
  },

  async getOrder(id: string): Promise<Order> {
    const res = await apiClient.get(`/orders/${id}`);
    return res.data.data;
  },

  // Payments
  async getPaymentGatewayStatus(merchantId?: string) {
    const res = await apiClient.get('/payments/gateway-status', { params: { merchantId } });
    return res.data.data;
  },

  async validateRazorpayKeys(payload: { keyId: string; keySecret: string }) {
    const res = await apiClient.post('/payments/validate-keys', payload);
    return res.data;
  },

  async configureRazorpayKeys(payload: { keyId: string; keySecret: string; merchantId?: string }) {
    const res = await apiClient.post('/payments/configure-keys', payload);
    return res.data;
  },

  async createPaymentOrder(orderId: string, simulateFailure = false) {
    const res = await apiClient.post('/payments/create-order', { orderId, simulateFailure });
    return res.data.data;
  },

  async verifyPayment(payload: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    isSimulated?: boolean;
  }) {
    const res = await apiClient.post('/payments/verify', payload);
    return res.data.data;
  },

  // Merchant
  async getMerchantDashboard(merchantId?: string): Promise<{ merchant: any; data: MerchantMetrics }> {
    const res = await apiClient.get(`/merchant/${merchantId || 'default'}/dashboard`);
    return res.data;
  },

  async getMerchantsList() {
    const res = await apiClient.get('/merchant/list');
    return res.data.data;
  },

  async updateMerchantSettings(merchantId: string, settings: any) {
    const res = await apiClient.put(`/merchant/${merchantId}/settings`, settings);
    return res.data.data;
  },

  // Audit
  async getAuditLogs(params?: { actionType?: string; policyResult?: string; limit?: number }): Promise<AuditLog[]> {
    const res = await apiClient.get('/audit', { params });
    return res.data.data;
  },

  async getAuditByCode(code: string): Promise<AuditLog> {
    const res = await apiClient.get(`/audit/${code}`);
    return res.data.data;
  },

  // Demo Controls
  async getDemoStatus() {
    const res = await apiClient.get('/demo/status');
    return res.data.data;
  },

  async toggleSimulation(type: 'payment' | 'policy' | 'ai', enabled: boolean) {
    const res = await apiClient.post('/demo/toggle-simulation', { type, enabled });
    return res.data;
  },
};
