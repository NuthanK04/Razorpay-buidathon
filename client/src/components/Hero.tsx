import { motion } from 'framer-motion';
import { ArrowDown, Sparkles } from 'lucide-react';

interface HeroProps {
  onExploreClick?: () => void;
  onNewArrivalsClick?: () => void;
}

export function Hero({ onExploreClick, onNewArrivalsClick }: HeroProps) {
  const handleScrollToGrid = () => {
    const el = document.getElementById('featured-essentials');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-background py-16 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Editorial Typography */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start lg:col-span-6 xl:col-span-7"
          >
            {/* Eyebrow */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1 backdrop-blur-sm">
              <Sparkles className="size-3 text-muted-foreground" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                NEW COLLECTION / 2026
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-sans text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl lg:text-7xl leading-[1.06]">
              Objects made for everyday living.
            </h1>

            {/* Supporting Text */}
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Thoughtfully designed essentials crafted from premium materials, built to become part of your everyday ritual.
            </p>

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={onExploreClick || handleScrollToGrid}
                className="group relative inline-flex items-center justify-center rounded-md bg-foreground px-8 py-4 text-xs font-medium uppercase tracking-[0.16em] text-background shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#262624] hover:shadow-md active:translate-y-0 active:scale-[0.98]"
              >
                <span>Explore Collection</span>
                <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>

              <button
                type="button"
                onClick={onNewArrivalsClick || handleScrollToGrid}
                className="inline-flex items-center justify-center rounded-md border border-border bg-card/60 px-7 py-4 text-xs font-medium uppercase tracking-[0.16em] text-foreground backdrop-blur-sm transition-all duration-200 hover:bg-muted hover:border-foreground/30 active:scale-[0.98]"
              >
                View New Arrivals
              </button>
            </div>

            {/* Editorial Metadata Footer */}
            <div className="mt-16 hidden sm:flex items-center gap-10 border-t border-border/70 pt-6 text-xs text-muted-foreground font-mono">
              <div>
                <span className="block text-foreground font-medium">08 ESSENTIALS</span>
                <span>CATALOGUE № 04</span>
              </div>
              <div>
                <span className="block text-foreground font-medium">LIFETIME REPAIR</span>
                <span>CIRCULAR GUARANTEE</span>
              </div>
              <div>
                <span className="block text-foreground font-medium">PORTUGAL & ITALY</span>
                <span>STUDIO WORKSHOPS</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Hero Visual Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative lg:col-span-6 xl:col-span-5"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-b from-[#F2EFE9] to-[#E5E0D5] p-8 shadow-card">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#141413_1px,transparent_1px)] [background-size:24px_24px]" />
              
              <div className="relative flex h-full w-full flex-col items-center justify-between z-10">
                <div className="flex w-full justify-between items-center text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
                  <span>ATELIER ARCHIVE</span>
                  <span>SERIES 2026</span>
                </div>

                <div className="relative my-auto flex flex-col items-center">
                  <div className="relative flex size-48 sm:size-56 items-center justify-center rounded-2xl border border-border/60 bg-background/90 shadow-floating backdrop-blur-md transition-transform duration-700 hover:scale-105">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="120"
                      height="120"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#141413"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="drop-shadow-sm"
                    >
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                      <path d="M3 6h18" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                      <line x1="8" y1="14" x2="16" y2="14" strokeWidth="0.8" opacity="0.4" />
                    </svg>
                    
                    <div className="absolute -bottom-3 rounded-full border border-border bg-background px-3 py-0.5 text-[10px] font-mono uppercase tracking-wider text-foreground shadow-sm">
                      Waxed Canvas 18oz
                    </div>
                  </div>

                  <span className="mt-8 text-center text-xs font-medium uppercase tracking-[0.18em] text-foreground">
                    Studio Tote — Obsidian Black
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Handmade in Porto
                  </span>
                </div>

                <div className="flex w-full items-center justify-between border-t border-border/60 pt-4 text-xs font-mono text-muted-foreground">
                  <span>£128.00</span>
                  <span className="text-foreground font-sans text-[11px] uppercase tracking-wider">In Stock</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 flex justify-center lg:justify-start">
          <button
            type="button"
            onClick={handleScrollToGrid}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Scroll to featured collection"
          >
            <span>Scroll to browse</span>
            <ArrowDown className="size-3.5 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
export default Hero;
