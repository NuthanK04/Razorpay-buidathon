import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config(); // fallback

export const CONFIG = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'agentcart_super_secure_jwt_secret_2026',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_buildathon2026',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'agentcart_razorpay_secret_key_demo',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  ENABLE_FAILURE_SIMULATIONS: process.env.ENABLE_FAILURE_SIMULATIONS !== 'false',
  DEFAULT_MERCHANT_SLUG: process.env.DEFAULT_MERCHANT_SLUG || 'electrotech-apex',
};
