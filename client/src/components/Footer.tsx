interface FooterProps {
  onNavigateSection?: (sectionId: string) => void;
}

export function Footer({ onNavigateSection }: FooterProps) {
  const handleScroll = (id: string) => {
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer className="bg-background border-t border-border/80 pt-16 pb-12 text-xs">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 pb-16 border-b border-border/70">
          {/* Brand & Mission Statement */}
          <div className="col-span-2 md:col-span-5">
            <span className="font-sans text-xl font-bold tracking-[0.25em] text-foreground">
              ATELIER
            </span>
            <p className="mt-4 max-w-sm text-muted-foreground leading-relaxed">
              An independent studio dedicated to the craft of durable, functional carry goods and everyday apparel. Designed in London, crafted in artisanal European workshops.
            </p>
            <div className="mt-6 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <span className="inline-block size-2 rounded-full bg-emerald-600" />
              <span>Studio open for bespoke commissions</span>
            </div>
          </div>

          {/* Column: Shop */}
          <div className="col-span-1 md:col-span-2 md:col-start-7">
            <h4 className="font-medium uppercase tracking-[0.14em] text-foreground mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5 text-muted-foreground">
              <li>
                <button
                  type="button"
                  onClick={() => handleScroll('featured-essentials')}
                  className="hover:text-foreground transition-colors"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScroll('featured-essentials')}
                  className="hover:text-foreground transition-colors"
                >
                  Bags
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScroll('featured-essentials')}
                  className="hover:text-foreground transition-colors"
                >
                  Accessories
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScroll('featured-essentials')}
                  className="hover:text-foreground transition-colors"
                >
                  Essentials
                </button>
              </li>
            </ul>
          </div>

          {/* Column: About */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-medium uppercase tracking-[0.14em] text-foreground mb-4">
              About
            </h4>
            <ul className="space-y-2.5 text-muted-foreground">
              <li>
                <button
                  type="button"
                  onClick={() => handleScroll('brand-story')}
                  className="hover:text-foreground transition-colors"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleScroll('collection-story')}
                  className="hover:text-foreground transition-colors"
                >
                  Materials
                </button>
              </li>
              <li>
                <span className="cursor-pointer hover:text-foreground transition-colors">
                  Journal
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-foreground transition-colors">
                  Contact
                </span>
              </li>
            </ul>
          </div>

          {/* Column: Follow */}
          <div className="col-span-2 sm:col-span-1 md:col-span-2">
            <h4 className="font-medium uppercase tracking-[0.14em] text-foreground mb-4">
              Follow
            </h4>
            <ul className="space-y-2.5 text-muted-foreground">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors"
                > 
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Pinterest
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground font-mono text-[11px]">
          <div>
            © 2026 ATELIER • All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="cursor-pointer hover:text-foreground transition-colors">
              Privacy
            </span>
            <span className="cursor-pointer hover:text-foreground transition-colors">
              Terms
            </span>
            <span className="cursor-pointer hover:text-foreground transition-colors">
              Shipping
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
