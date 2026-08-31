import { Shield, Feather } from 'lucide-react';

export function CollectionStory() {
  return (
    <section id="collection-story" className="scroll-mt-24 border-b border-border/70 bg-background py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          {/* Left: Large Editorial Visual Feature */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-[#ECE7DF] via-[#F4F1EA] to-[#E2DDD3] p-8 shadow-card">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  <span>ATELIER ARCHIVE № 26</span>
                  <span>MATERIAL STUDY</span>
                </div>

                <div className="my-auto flex flex-col items-center justify-center text-center">
                  <div className="relative flex size-40 sm:size-48 items-center justify-center rounded-2xl border border-border/70 bg-background/95 p-6 shadow-floating backdrop-blur-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="96"
                      height="96"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#141413"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="7" width="20" height="13" rx="3" />
                      <path d="M7 7V5a3 3 0 0 1 6 0v2" />
                      <line x1="2" y1="12" x2="22" y2="12" strokeWidth="1" opacity="0.6" />
                      <path d="M7 12v8" strokeWidth="1.2" />
                      <path d="M17 12v8" strokeWidth="1.2" />
                    </svg>
                  </div>
                  <span className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-foreground">
                    Somerset 24oz Duck Canvas
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">
                    Milled in England • Finished with Organic Beeswax
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-border/60 pt-4 text-[11px] font-mono text-muted-foreground">
                  <span>CIRCULAR WORKSHOP</span>
                  <span>PORTO / VALENCIA / DUNDEE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Narrative & Functional Details */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start">
            <span className="editorial-subhead block mb-3">Our Philosophy</span>
            
            <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl leading-tight">
              Designed to last.
            </h2>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
              Every piece is created with considered materials, functional details, and a timeless point of view. We avoid trend-driven disposability in favor of artifacts that develop character and patinas with every journey.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <div className="rounded-xl border border-border/70 bg-card p-5">
                <div className="flex size-9 items-center justify-center rounded-md bg-muted text-foreground mb-3">
                  <Feather className="size-4" />
                </div>
                <h4 className="text-sm font-medium text-foreground">
                  Considered Weight
                </h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Calibrated heft and structural drape that feels substantial in hand without unnecessary bulk.
                </p>
              </div>

              <div className="rounded-xl border border-border/70 bg-card p-5">
                <div className="flex size-9 items-center justify-center rounded-md bg-muted text-foreground mb-3">
                  <Shield className="size-4" />
                </div>
                <h4 className="text-sm font-medium text-foreground">
                  Lifetime Service
                </h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Every seam, zipper, and hardware component is engineered to be serviceable and repaired for life.
                </p>
              </div>
            </div>

            <blockquote className="mt-8 border-l-2 border-foreground pl-4 text-xs italic text-muted-foreground font-serif text-sm">
              "We believe true luxury is quiet utility: an object that answers every demand of your day while never calling for attention."
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CollectionStory;
