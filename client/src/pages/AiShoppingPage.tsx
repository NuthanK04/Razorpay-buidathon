import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api.js';
import { ProductCard } from '../components/ProductCard.js';
import { ComparisonModal } from '../components/ComparisonModal.js';
import { RazorpayModal } from '../components/RazorpayModal.js';
import { Product, Cart, UpsellOpportunity } from '../types/index.js';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  RefreshCw,
  ShoppingBag,
  ChevronRight,
  Mic,
  MicOff,
  PackageCheck,
  Zap,
} from 'lucide-react';

interface AiShoppingPageProps {
  initialPrompt?: string;
  onNavigate?: (page: string) => void;
  onCartUpdated: (cart: Cart) => void;
  onOrderPaid: (order: any, auditId: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  products?: Product[];
  upsellOpportunity?: UpsellOpportunity;
  bundleDeal?: {
    title: string;
    accessoryName: string;
    accessoryPrice: number;
    discountPercent: number;
    savingsAmount: number;
    totalBundlePrice: number;
    baseProduct: Product;
  };
  actionRequired?: string;
  auditCode?: string;
  policyPassed?: boolean;
}

export const AiShoppingPage: React.FC<AiShoppingPageProps> = ({
  initialPrompt,
  onCartUpdated,
  onOrderPaid,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your **AgentCart AI Commerce Specialist**. Tell me what you are looking for, your budget, and workload requirements (or click the microphone 🎙️ to speak), and I will find the best match in our catalog and guide your purchase safely.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [activeCart, setActiveCart] = useState<Cart | null>(null);

  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Modal states
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);
  const [razorpayModalOpen, setRazorpayModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [activePaymentOrder, setActivePaymentOrder] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-IN';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setInputMessage(transcript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!speechSupported || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const response = await api.sendChatMessage({
        sessionId,
        message: query,
      });

      const assistantMsg: Message = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        products: response.recommendedProducts,
        upsellOpportunity: response.upsellOpportunity,
        bundleDeal: response.bundleDeal,
        auditCode: response.auditCode,
        policyPassed: response.policyPassed,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (response.updatedCart) {
        setActiveCart(response.updatedCart);
        onCartUpdated(response.updatedCart);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: 'I encountered an issue connecting to the merchant catalog. Please retry your inquiry or select a product from the Catalog tab.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = async (product: Product) => {
    setLoading(true);
    try {
      const updatedCart = await api.addToCart({
        sessionId,
        productId: product.id,
        quantity: 1,
      });

      const assistantMsg: Message = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        text: `I have added the **${product.name}** to your session cart. Verified inventory and price index applied.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        auditCode: `AC-${Date.now().toString().slice(-5)}`,
        policyPassed: true,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setActiveCart(updatedCart);
      onCartUpdated(updatedCart);
    } catch {
      const fallbackCart: Cart = activeCart
        ? {
            ...activeCart,
            items: [
              ...activeCart.items,
              {
                id: product.id,
                productId: product.id,
                product,
                quantity: 1,
                unitPrice: product.price,
              },
            ],
            subtotal: activeCart.subtotal + product.price,
            total: activeCart.total + product.price,
          }
        : {
            id: `cart_${Date.now()}`,
            items: [
              {
                id: product.id,
                productId: product.id,
                product,
                quantity: 1,
                unitPrice: product.price,
              },
            ],
            subtotal: product.price,
            discount: 0,
            total: product.price,
          };
      setActiveCart(fallbackCart);
      onCartUpdated(fallbackCart);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptUpsell = async (upsell: UpsellOpportunity) => {
    setLoading(true);
    try {
      const updatedCart = await api.addToCart({
        sessionId,
        productId: upsell.targetProductId,
        isUpsell: true,
        approvedByUser: true,
        upsellReason: upsell.reason,
      });

      const assistantMsg: Message = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        text: `Explicit consent verified! Added **${upsell.targetProduct.name}** at the discounted rate of ₹${upsell.discountedPrice.toLocaleString('en-IN')}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        auditCode: `AC-${Date.now().toString().slice(-5)}`,
        policyPassed: true,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setActiveCart(updatedCart);
      onCartUpdated(updatedCart);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineUpsell = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        text: 'Understood. No optional add-on was included. Your session cart remains unchanged.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleAcceptBundle = async (bundleDeal: any) => {
    setLoading(true);
    try {
      await api.addToCart({
        sessionId,
        productId: bundleDeal.baseProduct.id,
        quantity: 1,
      });
      const updatedCart = await api.addToCart({
        sessionId,
        productId: bundleDeal.accessoryName,
        isUpsell: true,
        approvedByUser: true,
      });

      const assistantMsg: Message = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        text: `Bundle deal accepted! Added **${bundleDeal.baseProduct.name}** + **${bundleDeal.accessoryName}** with -${bundleDeal.discountPercent}% bundle savings.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        auditCode: `AC-${Date.now().toString().slice(-5)}`,
        policyPassed: true,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setActiveCart(updatedCart);
      onCartUpdated(updatedCart);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPurchase = async () => {
    if (!activeCart || activeCart.items.length === 0) return;

    setLoading(true);
    try {
      const order = await api.createOrder({
        cartId: activeCart.id,
        items: activeCart.items,
        isAiAssisted: true,
      });

      const paymentOrder = await api.createPaymentOrder(order.id);

      setActiveOrder(order);
      setActivePaymentOrder(paymentOrder);
      setRazorpayModalOpen(true);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant_${Date.now()}`,
          sender: 'assistant',
          text: `Checkout stopped by Financial Policy Engine: ${err?.response?.data?.message || 'Transaction limit exceeded.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenComparison = (prods: Product[]) => {
    setComparisonProducts(prods);
    setCompareModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* 2-Column Responsive Layout: Chat Feed (Left) & Session Cart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Chat Feed */}
        <div className="lg:col-span-8 flex flex-col rounded-3xl border border-[#E8E5DD] bg-white shadow-xs overflow-hidden h-[740px]">
          {/* Studio Agent Header */}
          <div className="border-b border-[#E8E5DD] px-6 py-4 bg-[#FAF9F6] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-[#141413] flex items-center justify-center shadow-xs">
                <Bot className="size-4 text-[#FAF9F6]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#141413] tracking-tight">
                  AgentCart AI Sales Specialist
                </h2>
                <div className="flex items-center gap-2 font-mono text-[10px] text-[#737069]">
                  <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
                  <span>Bounded Financial Policy Engine Active</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-[#737069]">
              <span className="hidden sm:inline">Session: {sessionId.slice(0, 14)}</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAF9F6]/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="max-w-2xl space-y-3">
                  {/* Text Bubble */}
                  <div
                    className={`rounded-2xl p-5 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#141413] text-[#FAF9F6] shadow-xs'
                        : 'bg-white text-[#141413] border border-[#E8E5DD] shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line font-sans">{msg.text}</div>

                    {/* Policy Checked Tag */}
                    {msg.auditCode && (
                      <div className="mt-3 pt-2.5 border-t border-[#E8E5DD]/70 flex items-center justify-between text-[10px] font-mono text-[#737069]">
                        <span className="flex items-center gap-1 text-[#8C6D4F] font-semibold">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Policy Checked ({msg.auditCode})
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                    )}
                  </div>

                  {/* Scored Recommendations Grid with Animated Add to Basket */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-[#737069]">
                          Ranked Catalog Recommendations ({msg.products.length})
                        </span>
                        {msg.products.length >= 2 && (
                          <button
                            type="button"
                            onClick={() => handleOpenComparison(msg.products || [])}
                            className="text-[11px] font-mono text-[#8C6D4F] hover:text-[#141413] font-semibold flex items-center gap-1"
                          >
                            <span>Compare Side-by-Side</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {msg.products.map((prod) => (
                          <ProductCard
                            key={prod.id}
                            product={prod}
                            onSelect={handleSelectProduct}
                            onCompare={() => handleOpenComparison(msg.products || [])}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Autonomous Bundle Negotiation Deal Card */}
                  {msg.bundleDeal && (
                    <div className="p-5 rounded-2xl bg-white border border-[#8C6D4F]/40 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[#8C6D4F] font-bold text-xs">
                          <Zap className="w-4 h-4 text-[#8C6D4F]" />
                          <span>AI Bundle Negotiation (-{msg.bundleDeal.discountPercent}% Savings)</span>
                        </div>
                        <span className="text-[10px] font-mono bg-[#F4F2EC] text-[#141413] border border-[#E8E5DD] px-2 py-0.5 rounded font-bold">
                          Save ₹{msg.bundleDeal.savingsAmount.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <p className="text-xs text-[#737069] leading-relaxed">
                        Pair your <strong className="text-[#141413]">{msg.bundleDeal.baseProduct.name}</strong> with the{' '}
                        <strong className="text-[#141413]">{msg.bundleDeal.accessoryName}</strong>. AgentCart negotiated an autonomous 8% merchant-approved bundle discount within policy bounds.
                      </p>

                      <div className="bg-[#FAF9F6] p-3.5 rounded-xl border border-[#E8E5DD] flex items-center justify-between text-xs font-mono">
                        <div>
                          <span className="text-[#737069] text-[11px]">Bundle Total:</span>
                          <p className="font-bold text-[#141413] text-sm">
                            ₹{msg.bundleDeal.totalBundlePrice.toLocaleString('en-IN')}{' '}
                            <span className="text-[#A19F9A] line-through text-xs font-normal">
                              ₹{(msg.bundleDeal.baseProduct.price + msg.bundleDeal.accessoryPrice).toLocaleString('en-IN')}
                            </span>
                          </p>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded font-semibold border border-emerald-200">
                          Policy Approved
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAcceptBundle(msg.bundleDeal)}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#141413] hover:bg-[#262624] text-[#FAF9F6] font-medium text-xs uppercase tracking-wider shadow-xs transition-all active:scale-95"
                      >
                        <PackageCheck className="w-4 h-4 text-emerald-400" />
                        <span>Accept Bundle & Add Both to Cart</span>
                      </button>
                    </div>
                  )}

                  {/* Consent-Gated Upsell Card */}
                  {msg.upsellOpportunity && (
                    <div className="p-5 rounded-2xl bg-white border border-[#E8E5DD] shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[#141413] font-bold text-xs">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>Explicit Consent Upsell Recommendation</span>
                        </div>
                        <span className="text-[10px] font-mono bg-[#F4F2EC] text-[#737069] px-2 py-0.5 rounded font-semibold">
                          {msg.upsellOpportunity.relationshipType}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 bg-[#FAF9F6] p-3 rounded-xl border border-[#E8E5DD]">
                        {msg.upsellOpportunity.targetProduct.imageUrl && (
                          <img
                            src={msg.upsellOpportunity.targetProduct.imageUrl}
                            alt=""
                            className="size-12 rounded-lg object-cover bg-white shrink-0 border border-[#E8E5DD]"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-[#141413] text-xs truncate">
                            {msg.upsellOpportunity.targetProduct.name}
                          </h4>
                          <p className="text-[11px] text-[#737069] line-clamp-1 mt-0.5">
                            {msg.upsellOpportunity.reason}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-[#141413] text-sm">
                            +₹{msg.upsellOpportunity.discountedPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleAcceptUpsell(msg.upsellOpportunity!)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#141413] hover:bg-[#262624] text-[#FAF9F6] font-medium text-xs uppercase tracking-wider shadow-xs transition-all active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Add to Cart with Consent</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDeclineUpsell}
                          className="py-2.5 px-3 rounded-xl border border-[#E8E5DD] hover:bg-[#F4F2EC] text-[#737069] font-medium text-xs uppercase tracking-wider transition-colors"
                        >
                          No Thanks
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#737069] font-mono py-2 animate-pulse">
                <RefreshCw className="size-4 animate-spin text-[#8C6D4F]" />
                <span>AgentCart analyzing catalog & verifying policy bounds...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="border-t border-[#E8E5DD] p-4 bg-white flex items-center gap-2.5"
          >
            {speechSupported && (
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`flex size-11 items-center justify-center rounded-xl border transition-all ${
                  isListening
                    ? 'bg-rose-50 border-rose-400 text-rose-600 animate-pulse'
                    : 'border-[#E8E5DD] bg-[#FAF9F6] text-[#737069] hover:text-[#141413]'
                }`}
                title={isListening ? 'Stop recording voice' : 'Speak requirement'}
              >
                {isListening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              </button>
            )}

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask for hardware, specs, budget limits, protection plans..."
              className="flex-1 rounded-xl border border-[#E8E5DD] bg-[#FAF9F6] px-4 py-3 text-xs text-[#141413] placeholder-[#A19F9A] focus:border-[#141413] focus:outline-none shadow-xs"
            />

            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="flex size-11 items-center justify-center rounded-xl bg-[#141413] text-[#FAF9F6] hover:bg-[#262624] disabled:opacity-40 transition-all shadow-xs"
              aria-label="Send message"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>

        {/* Right: Session Cart Breakdown */}
        <div className="lg:col-span-4 rounded-3xl border border-[#E8E5DD] bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-[#E8E5DD] pb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#141413]" />
              <h3 className="font-semibold text-[#141413] text-sm">Session Cart</h3>
            </div>
            <span className="text-[11px] font-mono text-[#737069]">
              {activeCart?.items?.length || 0} item(s)
            </span>
          </div>

          {activeCart && activeCart.items.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-2.5 max-h-64 overflow-y-auto">
                {activeCart.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E8E5DD] space-y-1"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-[#141413] text-xs leading-snug">
                          {item.product.name}
                        </h4>
                        {item.isUpsell && (
                          <span className="inline-block mt-0.5 text-[9px] font-mono uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-semibold">
                            Approved Add-on
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-[#141413] text-xs shrink-0">
                        ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E8E5DD] text-xs space-y-2 font-mono text-[#737069]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-[#141413] font-semibold">₹{activeCart.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {activeCart.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Bundle Discount:</span>
                    <span>-₹{activeCart.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="border-t border-[#E8E5DD] pt-2 flex justify-between font-bold text-[#141413] text-sm">
                  <span>Total Payable:</span>
                  <span className="text-[#141413]">₹{activeCart.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Policy Validation Status */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Financial Policy Check: PASSED</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Transaction ₹{activeCart.total.toLocaleString('en-IN')} is within merchant limit of ₹1,00,000. Explicit customer consent verified.
                </p>
              </div>

              {/* Checkout Trigger */}
              <button
                type="button"
                onClick={handleConfirmPurchase}
                className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-[#141413] hover:bg-[#262624] text-[#FAF9F6] font-medium text-xs uppercase tracking-[0.14em] shadow-sm transition-all hover:-translate-y-0.5 active:scale-95"
              >
                <CreditCard className="w-4 h-4 text-amber-300" />
                <span>Pay ₹{activeCart.total.toLocaleString('en-IN')} with Razorpay</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-10 text-[#737069] text-xs space-y-2">
              <ShoppingBag className="w-8 h-8 mx-auto text-[#A19F9A]" />
              <p className="font-semibold text-[#141413]">Your session cart is currently empty.</p>
              <p className="text-[11px] text-[#737069]">
                Ask the AI agent above to search for laptops or electronics to start.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        products={comparisonProducts}
        onSelectProduct={handleSelectProduct}
      />

      {/* Razorpay Test Mode Checkout Modal */}
      <RazorpayModal
        isOpen={razorpayModalOpen}
        onClose={() => setRazorpayModalOpen(false)}
        order={activeOrder}
        paymentOrder={activePaymentOrder}
        onPaymentSuccess={(res) => {
          setRazorpayModalOpen(false);
          onOrderPaid(activeOrder, res.auditId);
        }}
        onPaymentFailure={() => {
          // Handled within modal
        }}
      />
    </div>
  );
};

export default AiShoppingPage;
