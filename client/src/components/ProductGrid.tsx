import { useState } from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
}

export function ProductGrid({ products, onQuickView }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Bags', 'Apparel', 'Accessories'];

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section
      id="featured-essentials"
      className="scroll-mt-24 border-b border-border/70 bg-background py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 border-b border-border/70">
          <div>
            <span className="editorial-subhead block mb-2">Curated Objects</span>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Featured essentials
            </h2>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-muted-foreground">
              A considered selection of everyday pieces designed with purpose.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.12em] transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-foreground text-background shadow-sm'
                    : 'border border-border/80 bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Column Responsive Grid (4 Desktop, 2 Tablet, 1 Mobile) */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* Catalog Subtext */}
        <div className="mt-16 text-center text-xs font-mono text-muted-foreground">
          <span>Showing {filteredProducts.length} of {products.length} catalog items • All pieces backed by complimentary lifetime repairs</span>
        </div>
      </div>
    </section>
  );
}

export default ProductGrid;
