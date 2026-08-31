import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { ProductCard } from '../components/ProductCard.js';
import { Product } from '../types/index.js';
import { Search, RefreshCw, ShoppingBag, Sparkles } from 'lucide-react';
import { useBasket } from '../context/BasketContext.js';

interface CatalogPageProps {
  onSelectProduct: (product: Product) => void;
  onNavigate: (page: string) => void;
  onQuickView?: (product: Product) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  onSelectProduct,
  onNavigate,
  onQuickView,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const { addToBasket } = useBasket();

  const categories = [
    { id: 'all', label: 'All Catalog' },
    { id: 'laptops', label: 'Laptops' },
    { id: 'monitors', label: 'Monitors' },
    { id: 'smartphones', label: 'Smartphones' },
    { id: 'headphones', label: 'Headphones' },
    { id: 'keyboards', label: 'Keyboards' },
    { id: 'mice', label: 'Mice' },
    { id: 'warranty', label: 'Protection Plans' },
    { id: 'accessories', label: 'Accessories' },
  ];

  useEffect(() => {
    fetchCatalog();
  }, [selectedCategory, sortBy]);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery || undefined,
        sort: sortBy,
      });
      if (data && data.length > 0) {
        setProducts(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCatalog();
  };

  const handleAddToCart = (product: Product) => {
    addToBasket(product, 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* Header Banner */}
      <div className="rounded-3xl border border-[#E8E5DD] bg-white p-8 sm:p-10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#8C6D4F] font-semibold block mb-1">
            Verified Inventory & Price Indices
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#141413]">
            Verified Merchant Hardware Catalog
          </h1>
          <p className="text-xs sm:text-sm text-[#737069] mt-2 max-w-2xl leading-relaxed">
            Deterministic price indices, live stock quantities, and verified manufacturer specifications across high-performance hardware and protection plans.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('ai-shopping')}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#141413] hover:bg-[#262624] text-[#FAF9F6] font-medium text-xs uppercase tracking-[0.14em] shadow-xs shrink-0 transition-all hover:-translate-y-0.5"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Ask AI Sales Agent</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap text-xs font-medium uppercase tracking-[0.12em] transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#141413] text-[#FAF9F6] shadow-xs'
                  : 'bg-white text-[#737069] hover:text-[#141413] hover:bg-[#F4F2EC] border border-[#E8E5DD]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input & Sort */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#A19F9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, specs, tags..."
              className="w-full bg-white border border-[#E8E5DD] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#141413] placeholder-[#A19F9A] focus:outline-none focus:border-[#141413] shadow-xs font-medium"
            />
          </form>

          <div className="flex items-center gap-2 text-xs text-[#737069] font-mono self-end">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#E8E5DD] rounded-lg px-3 py-1.5 text-xs text-[#141413] focus:outline-none focus:border-[#141413] shadow-xs font-medium"
            >
              <option value="rating">Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products 4-Column Grid with Animated Add-to-Basket */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-xs text-[#141413] font-mono gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-[#8C6D4F]" />
          <span>Loading catalog inventory...</span>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelect={() => {
                onSelectProduct(prod);
                onNavigate('ai-shopping');
              }}
              onQuickView={onQuickView}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl border border-[#E8E5DD] bg-white text-[#737069] text-xs space-y-2 shadow-xs">
          <ShoppingBag className="w-10 h-10 mx-auto text-[#A19F9A]" />
          <p className="font-semibold text-[#141413]">No products found</p>
          <p>Try adjusting your category or search query.</p>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
