import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { ProductVisual } from './ProductVisual';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export function SearchModal({ isOpen, onClose, products, onSelectProduct }: SearchModalProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return products.slice(0, 4);
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.material && p.material.toLowerCase().includes(q))
    );
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:pt-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-2xl text-left"
          >
            {/* Search Input Bar */}
            <div className="relative flex items-center border-b border-border/80 pb-4">
              <Search className="size-5 text-muted-foreground mr-3" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search studio pieces, materials, bags..."
                className="w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Quick Suggestions / Results */}
            <div className="mt-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {query.trim() ? `Search Results (${results.length})` : 'Popular Essentials'}
              </span>

              <div className="mt-3 divide-y divide-border/60 max-h-80 overflow-y-auto">
                {results.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    No studio pieces match "{query}".
                  </div>
                ) : (
                  results.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="flex w-full items-center justify-between py-3 text-left transition-colors hover:bg-muted/50 rounded-lg px-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-md border border-border bg-muted/60">
                          <ProductVisual id={product.image} size={28} />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-foreground">
                            {product.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {product.description}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-medium text-foreground">
                          £{product.price}
                        </span>
                        <ArrowRight className="size-3 text-muted-foreground" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}

export default SearchModal;
