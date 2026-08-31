import { useRef, useState, useEffect } from 'react';
import {
  AddToBasketButton,
  AddToBasketImage,
  AddToBasketTarget,
  addToBasket,
  type AddToBasketImageHandle,
  type AddToBasketTargetHandle,
} from '@/components/motion-ui/add-to-basket';
import { Product } from '@/types';
import { useBasket } from '@/context/BasketContext';
import { getProductImageUrl } from '@/utils/productImages';
import { Eye, Sparkles } from 'lucide-react';

export interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onSelect?: (product: Product) => void;
  onCompare?: () => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({
  product,
  onQuickView,
  onSelect,
  onAddToCart,
}: ProductCardProps) {
  const image = useRef<AddToBasketImageHandle>(null);
  const basket = useRef<AddToBasketTargetHandle>(null);
  const { addToBasket: addToGlobalBasket, getItemQuantity } = useBasket();
  
  const globalQty = getItemQuantity(product.id);
  const [count, setCount] = useState(globalQty);
  const [isAdding, setIsAdding] = useState(false);
  const [imgSrc, setImgSrc] = useState(() => getProductImageUrl(product));

  useEffect(() => {
    setCount(globalQty);
  }, [globalQty]);

  useEffect(() => {
    setImgSrc(getProductImageUrl(product));
  }, [product]);

  // Determine formatted currency
  const formattedPrice =
    typeof product.price === 'number'
      ? product.price >= 1000
        ? `₹${product.price.toLocaleString('en-IN')}`
        : `£${product.price}`
      : `₹${product.price}`;

  const add = async () => {
    if (isAdding) return;
    setIsAdding(true);

    const landed = await addToBasket({
      image: image.current,
      basket: basket.current,
    });

    if (landed) {
      setCount((value) => value + 1);
      addToGlobalBasket(product, 1);
      if (onAddToCart) {
        onAddToCart(product);
      }
    }
    setIsAdding(false);
  };

  const handleDetails = () => {
    if (onQuickView) {
      onQuickView(product);
    } else if (onSelect) {
      onSelect(product);
    }
  };

  return (
    <div className="group relative flex w-full max-w-[320px] mx-auto flex-col items-center gap-6 rounded-2xl border border-[#E8E5DD] bg-white p-5 shadow-xs transition-all duration-300 hover:border-[#D0CBC0] hover:shadow-card hover:-translate-y-1">
      {/* Top Bar: Badge & Target Basket Icon */}
      <div className="w-full flex items-center justify-between z-20">
        {product.badge ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#E8E5DD] bg-[#FAF9F6] px-2.5 py-0.5 text-[10px] font-mono font-medium tracking-wider uppercase text-[#737069]">
            <Sparkles className="size-2.5 text-[#8C6D4F]" />
            <span>{product.badge}</span>
          </span>
        ) : product.score ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-800">
            <span>{Math.round(product.score * 100)}% Match</span>
          </span>
        ) : (
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#737069] font-medium">
            {product.category || 'Hardware'}
          </span>
        )}

        {/* Target Basket Icon (Positioned Upper-Right) */}
        <AddToBasketTarget
          ref={basket}
          aria-label={`Basket target for ${product.name}`}
          className="flex size-9 items-center justify-center rounded-lg border border-[#E8E5DD] bg-[#FAF9F6] text-[#141413] transition-colors hover:bg-[#F4F2EC]"
        >
          <BasketIcon />
        </AddToBasketTarget>
      </div>

      {/* Product Image Container */}
      <div className="relative z-30 flex items-center justify-center w-full my-1">
        <AddToBasketImage
          ref={image}
          className="flex size-40 sm:size-44 items-center justify-center overflow-hidden rounded-xl border border-[#E8E5DD]/70 bg-[#FAF9F6] p-2 transition-all duration-300 group-hover:bg-[#F4F2EC]"
        >
          <img
            src={imgSrc}
            alt={product.name}
            onError={() => {
              setImgSrc('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80');
            }}
            className="h-full w-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </AddToBasketImage>

        {/* Quick View Floating Pill on Hover */}
        {(onQuickView || onSelect) && (
          <button
            type="button"
            onClick={handleDetails}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-40 flex items-center gap-1.5 rounded-full bg-[#141413]/90 px-3.5 py-1.5 text-[11px] font-medium text-[#FAF9F6] backdrop-blur-md hover:bg-[#141413] hover:scale-105 shadow-sm"
            aria-label={`Quick view ${product.name}`}
          >
            <Eye className="size-3" />
            <span>Details</span>
          </button>
        )}
      </div>

      {/* Title, Description & Price */}
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1 text-left">
          <h3 className="truncate text-sm font-semibold text-[#141413] tracking-tight" title={product.name}>
            {product.name}
          </h3>
          <p className="line-clamp-2 text-xs text-[#737069] leading-relaxed min-h-[32px]">
            {product.description}
          </p>
        </div>

        <span className="shrink-0 font-mono text-sm tabular-nums font-semibold text-[#141413] pt-0.5">
          {formattedPrice}
        </span>
      </div>

      {/* Add To Basket Action Button */}
      <div className="w-full space-y-2">
        <AddToBasketButton
          className="w-full"
          onClick={add}
          disabled={isAdding}
          aria-label={`Add ${product.name} to basket`}
        >
          {isAdding ? 'Adding...' : 'Add to basket'}
        </AddToBasketButton>

        {/* Counter */}
        <div className="text-center font-mono text-[11px] text-[#737069]">
          {count > 0 ? (
            <span className="text-[#141413] font-semibold">{count} in basket</span>
          ) : (
            <span>0 in basket</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

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
      aria-hidden="true"
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
