import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from 'react';
import { motion, useAnimationControls } from 'framer-motion';

export interface AddToBasketImageHandle {
  getElement: () => HTMLElement | null;
  getRect: () => DOMRect | null;
}

export interface AddToBasketTargetHandle {
  getElement: () => HTMLElement | null;
  getRect: () => DOMRect | null;
  react: () => void;
}

export interface AddToBasketOptions {
  image: AddToBasketImageHandle | null;
  basket: AddToBasketTargetHandle | null;
  duration?: number;
}

/**
 * signature addToBasket physics flight animation
 */
export async function addToBasket({
  image,
  basket,
  duration = 600,
}: AddToBasketOptions): Promise<boolean> {
  if (!image || !basket) return true;

  const imageEl = image.getElement();
  const basketEl = basket.getElement();

  if (!imageEl || !basketEl) return true;

  const startRect = imageEl.getBoundingClientRect();
  const endRect = basketEl.getBoundingClientRect();

  if (startRect.width === 0 || startRect.height === 0) return true;

  // Create clone for the flight animation
  const clone = imageEl.cloneNode(true) as HTMLElement;
  clone.style.position = 'fixed';
  clone.style.top = `${startRect.top}px`;
  clone.style.left = `${startRect.left}px`;
  clone.style.width = `${startRect.width}px`;
  clone.style.height = `${startRect.height}px`;
  clone.style.margin = '0';
  clone.style.pointerEvents = 'none';
  clone.style.zIndex = '999999';
  clone.style.transformOrigin = 'center center';
  clone.style.willChange = 'transform, opacity';
  clone.style.boxShadow = '0 12px 30px -4px rgba(20, 20, 19, 0.25), 0 4px 10px rgba(0, 0, 0, 0.1)';
  clone.style.borderRadius = '12px';
  clone.style.backgroundColor = '#FAF9F6';
  clone.style.overflow = 'hidden';

  // Ensure svg or img inside clone fits proportionally
  const allSvg = clone.querySelectorAll('svg');
  allSvg.forEach((svg) => {
    svg.style.transition = 'none';
  });

  document.body.appendChild(clone);

  // Target delta coordinates
  const startCenterX = startRect.left + startRect.width / 2;
  const startCenterY = startRect.top + startRect.height / 2;
  const endCenterX = endRect.left + endRect.width / 2;
  const endCenterY = endRect.top + endRect.height / 2;

  const deltaX = endCenterX - startCenterX;
  const deltaY = endCenterY - startCenterY;

  // Calculate high arc curve
  const midDeltaY = deltaY < 0 ? deltaY * 0.7 - 40 : -50;

  return new Promise<boolean>((resolve) => {
    const animation = clone.animate(
      [
        {
          transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)',
          opacity: 1,
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
        },
        {
          transform: `translate3d(${deltaX * 0.35}px, ${midDeltaY}px, 0) scale(0.95) rotate(-4deg)`,
          opacity: 0.95,
          offset: 0.4,
        },
        {
          transform: `translate3d(${deltaX * 0.75}px, ${deltaY * 0.7}px, 0) scale(0.55) rotate(6deg)`,
          opacity: 0.85,
          offset: 0.75,
        },
        {
          transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.18) rotate(0deg)`,
          opacity: 0.1,
          filter: 'drop-shadow(0 0 0 rgba(0,0,0,0))',
        },
      ],
      {
        duration: duration,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards',
      }
    );

    animation.onfinish = () => {
      if (clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
      // Trigger target pulse
      basket.react();
      resolve(true);
    };

    animation.oncancel = () => {
      if (clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
      basket.react();
      resolve(true);
    };
  });
}

/**
 * AddToBasketImage wrapper component
 */
export interface AddToBasketImageProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const AddToBasketImage = forwardRef<AddToBasketImageHandle, AddToBasketImageProps>(
  ({ children, className = '', ...props }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        getElement: () => internalRef.current,
        getRect: () => (internalRef.current ? internalRef.current.getBoundingClientRect() : null),
      }),
      []
    );

    return (
      <div
        ref={internalRef}
        className={`relative transition-transform duration-300 ease-out hover:scale-[1.03] ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AddToBasketImage.displayName = 'AddToBasketImage';

/**
 * AddToBasketTarget basket icon target with Apple-style tactile spring reaction
 */
export interface AddToBasketTargetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const AddToBasketTarget = forwardRef<AddToBasketTargetHandle, AddToBasketTargetProps>(
  ({ children, className = '', ...props }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const controls = useAnimationControls();
    const [isPulsing, setIsPulsing] = useState(false);

    const triggerReaction = useCallback(async () => {
      setIsPulsing(true);
      await controls.start({
        scale: [1, 1.2, 0.94, 1.06, 1],
        rotate: [0, -6, 4, -2, 0],
        transition: {
          duration: 0.55,
          ease: [0.175, 0.885, 0.32, 1.275],
        },
      });
      setTimeout(() => setIsPulsing(false), 300);
    }, [controls]);

    useImperativeHandle(
      ref,
      () => ({
        getElement: () => internalRef.current,
        getRect: () => (internalRef.current ? internalRef.current.getBoundingClientRect() : null),
        react: triggerReaction,
      }),
      [triggerReaction]
    );

    return (
      <motion.div
        ref={internalRef}
        animate={controls}
        className={`relative inline-flex items-center justify-center transition-all duration-200 hover:scale-105 ${
          isPulsing ? 'ring-2 ring-foreground/20 ring-offset-2 ring-offset-background' : ''
        } ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
AddToBasketTarget.displayName = 'AddToBasketTarget';

/**
 * AddToBasketButton styled action button
 */
export interface AddToBasketButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export const AddToBasketButton = forwardRef<HTMLButtonElement, AddToBasketButtonProps>(
  ({ children = 'Add to basket', className = '', onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={`group relative flex items-center justify-center rounded-md bg-[#141413] px-4 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-[#FAF9F6] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#262624] hover:shadow-md active:translate-y-0 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);
AddToBasketButton.displayName = 'AddToBasketButton';
