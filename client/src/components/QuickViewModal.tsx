import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { useBasket } from '@/context/BasketContext';
import { getProductImageUrl } from '@/utils/productImages';
import {
  AddToBasketButton,
  AddToBasketImage,
  AddToBasketTarget,
  addToBasket,
  type AddToBasketImageHandle,
  type AddToBasketTargetHandle,
} from './motion-ui/add-to-basket';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const imageRef = useRef<AddToBasketImageHandle>(null);
  const targetRef = useRef<AddToBasketTargetHandle>(null);
  const { addToBasket: addToGlobalBasket, getItemQuantity, headerBasketRef } = useBasket();
  const [isAdding, setIsAdding] = useState(false);
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    if (product) {
      setImgSrc(getProductImageUrl(product));
    }
  }, [product]);

  if (!product) return null;

  const currentCount = getItemQuantity(product.id);
  const isRupee = typeof product.price === 'number' && product.price >= 1000;
  const formattedPrice = isRupee
    ? `₹${product.price.toLocaleString('en-IN')}`
    : `£${product.price}`;

  const handleAdd = async () => {
    if (isAdding) return;
    setIsAdding(true);

    const target = targetRef.current || headerBasketRef.current;

    const landed = await addToBasket({
      image: imageRef.current,
      basket: target,
    });

    if (landed) {
      addToGlobalBasket(product, 1);
    }
    setIsAdding(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
        />

        <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl border border-[#E8E5DD] bg-white p-6 sm:p-8 text-left shadow-2xl transition-all"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 z-20 flex size-9 items-center justify-center rounded-full text-[#737069] hover:bg-[#F4F2EC] hover:text-[#141413]"
              aria-label="Close product quick view"
            >
              <X className="size-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 relative flex flex-col items-center justify-center rounded-2xl border border-[#E8E5DD] bg-[#FAF9F6] p-6">
                <div className="absolute top-3 right-3 z-10">
                  <AddToBasketTarget
                    ref={targetRef}
                    className="flex size-9 items-center justify-center rounded-lg border border-[#E8E5DD] bg-white text-[#141413]"
                  >
                    <BasketIcon />
                  </AddToBasketTarget>
                </div>

                <AddToBasketImage
                  ref={imageRef}
                  className="flex size-48 items-center justify-center overflow-hidden rounded-xl"
                >
                  <img
                    src={imgSrc}
                    alt={product.name}
                    onError={() => {
                      setImgSrc('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80');
                    }}
                    className="size-full object-cover rounded-xl"
                  />
                </AddToBasketImage>

                {product.badge && (
                  <span className="mt-4 inline-flex items-center gap-1 rounded-full border border-[#E8E5DD] bg-white px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#737069]">
                    <Sparkles className="size-2.5 text-[#8C6D4F]" />
                    <span>{product.badge}</span>
                  </span>
                )}
              </div>

              <div className="md:col-span-7 flex flex-col">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#737069]">
                  <span>{product.category || 'Verified Item'}</span>
                  <span>•</span>
                  <span>{product.origin || 'Certified Stock'}</span>
                </div>

                <h3 className="mt-2 text-2xl font-semibold text-[#141413] tracking-tight">
                  {product.name}
                </h3>

                <p className="mt-1 text-xs text-[#737069] leading-relaxed">
                  {product.description}
                </p>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-mono text-2xl font-semibold text-[#141413]">
                    {formattedPrice}
                  </span>
                  <span className="text-xs text-emerald-700 font-medium">
                    Verified Gateway Protection
                  </span>
                </div>

                <div className="mt-6 space-y-2 border-t border-[#E8E5DD] pt-4 text-xs">
                  {product.material && (
                    <div className="flex justify-between text-[#737069]">
                      <span className="font-medium text-[#141413]">Specification:</span>
                      <span>{product.material}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex justify-between text-[#737069]">
                      <span className="font-medium text-[#141413]">Dimensions:</span>
                      <span className="font-mono">{product.dimensions}</span>
                    </div>
                  )}
                </div>

                {product.details && product.details.length > 0 && (
                  <div className="mt-4 space-y-1.5 border-t border-[#E8E5DD] pt-3">
                    {product.details.slice(0, 3).map((detail, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#737069]">
                        <Check className="size-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-2">
                  <AddToBasketButton
                    onClick={handleAdd}
                    disabled={isAdding}
                    className="w-full py-4"
                  >
                    {isAdding ? 'Adding to basket...' : `Add to basket • ${formattedPrice}`}
                  </AddToBasketButton>

                  <span className="text-center font-mono text-[11px] text-[#737069]">
                    {currentCount} currently in your basket
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

function BasketIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 11-1 9" />
      <path d="m19 11-4-7" />
      <path d="M2 11h20" />
      <path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" />
      <path d="M4.5 15.5h15" />
      <path d="m5 11 4-7" />
      <path d="m9 11 1 9" />
    </svg>
  );
}

export default QuickViewModal;
