import express from 'express';
import cors from 'cors';
import { CONFIG } from './config/index.js';
import productRoutes from './routes/productRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import merchantRoutes from './routes/merchantRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import demoRoutes from './routes/demoRoutes.js';

const app = express();

// Security & Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id'],
}));
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'AgentCart Backend',
    version: '1.0.0',
    track: 'AI Growth & Agentic Commerce (Razorpay AI Buildathon 2026)',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/products', productRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/merchant', merchantRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/demo', demoRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[AgentCart Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(CONFIG.PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 AgentCart Server running on http://localhost:${CONFIG.PORT}`);
    console.log(`💳 Razorpay Test Mode: Active (${CONFIG.RAZORPAY_KEY_ID})`);
    console.log(`🤖 AgentCart Commerce Agent: Initialized & Ready`);
    console.log(`=======================================================`);
  });
}

export default app;
