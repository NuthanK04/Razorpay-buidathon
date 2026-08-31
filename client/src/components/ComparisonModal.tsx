import React from 'react';
import { Product } from '../types/index.js';
import { X, Check, ArrowRight } from 'lucide-react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  if (!isOpen || products.length < 2) return null;

  const p1 = products[0];
  const p2 = products[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              Side-by-Side Product Comparison
            </h3>
            <p className="text-xs text-slate-500">AI-driven requirement fit & specification matrix</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 text-slate-500 font-semibold uppercase tracking-wider w-1/4">
                  Feature / Spec
                </th>
                <th className="py-3 px-4 text-slate-900 font-bold w-3/8 bg-indigo-50/50 rounded-t-lg">
                  <div className="text-xs text-indigo-600 font-mono mb-0.5 font-bold">Top Match</div>
                  {p1.name}
                </th>
                <th className="py-3 px-4 text-slate-900 font-bold w-3/8">
                  <div className="text-xs text-slate-500 font-mono mb-0.5 font-bold">Alternative Option</div>
                  {p2.name}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
              <tr>
                <td className="py-3 px-4 text-slate-500 font-medium">Price</td>
                <td className="py-3 px-4 font-bold text-emerald-700 text-sm bg-indigo-50/50">
                  ₹{p1.price.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-4 font-bold text-slate-900 text-sm">
                  ₹{p2.price.toLocaleString('en-IN')}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-500 font-medium">AI Match Score</td>
                <td className="py-3 px-4 bg-indigo-50/50 font-mono font-bold text-indigo-700">
                  {p1.score ? `${Math.round(p1.score * 100)}% Match` : '96% Match'}
                </td>
                <td className="py-3 px-4 font-mono font-bold text-slate-700">
                  {p2.score ? `${Math.round(p2.score * 100)}% Match` : '88% Match'}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-500 font-medium">RAM</td>
                <td className="py-3 px-4 text-slate-800 bg-indigo-50/50 font-medium">
                  {p1.specifications?.ram || '16GB DDR5'}
                </td>
                <td className="py-3 px-4 text-slate-700">
                  {p2.specifications?.ram || '16GB DDR5'}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-500 font-medium">Dedicated GPU</td>
                <td className="py-3 px-4 text-slate-800 bg-indigo-50/50 font-medium">
                  {p1.specifications?.gpu || 'NVIDIA RTX 4060 8GB'}
                </td>
                <td className="py-3 px-4 text-slate-700">
                  {p2.specifications?.gpu || 'NVIDIA RTX 4050 6GB'}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-500 font-medium">Processor (CPU)</td>
                <td className="py-3 px-4 text-slate-800 bg-indigo-50/50 font-medium">
                  {p1.specifications?.cpu || 'AMD Ryzen 7 7735HS'}
                </td>
                <td className="py-3 px-4 text-slate-700">
                  {p2.specifications?.cpu || 'Intel Core i5-13450HX'}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-500 font-medium">Inventory Stock</td>
                <td className="py-3 px-4 text-emerald-700 bg-indigo-50/50 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  In Stock ({p1.stock} units)
                </td>
                <td className="py-3 px-4 text-emerald-700 font-medium">
                  In Stock ({p2.stock} units)
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-500 font-medium">Why AI Recommended</td>
                <td className="py-3 px-4 text-[11px] text-slate-800 bg-indigo-50/50 leading-relaxed font-medium">
                  {p1.matchReason || 'Best tensor performance to price ratio below budget.'}
                </td>
                <td className="py-3 px-4 text-[11px] text-slate-600 leading-relaxed">
                  {p2.matchReason || 'Strong build quality with Intel CPU architecture.'}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className="py-4 px-4"></td>
                <td className="py-4 px-4 bg-indigo-50/50 rounded-b-lg">
                  <button
                    onClick={() => {
                      onSelectProduct(p1);
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all"
                  >
                    <span>Select {p1.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => {
                      onSelectProduct(p2);
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 transition-all"
                  >
                    <span>Select {p2.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
