import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section className="border-b border-border/70 bg-card/60 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <span className="editorial-subhead block mb-3">Studio Gazette</span>
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
            Stay in the loop.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            New collections, studio notes, and occasional things worth knowing.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-md mx-auto">
            {submitted ? (
              <div className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background py-3.5 px-6 font-mono text-xs text-foreground animate-fade-in">
                <Check className="size-4 text-emerald-600" />
                <span>Thank you. You have been added to our studio list.</span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="flex-1 rounded-md border border-border bg-background px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
                  aria-label="Email address for newsletter"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-background transition-all hover:bg-[#262624] active:scale-[0.98]"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="size-3" />
                </button>
              </>
            )}
          </form>

          <p className="mt-4 text-[11px] font-mono text-muted-foreground/80">
            No spam, ever. Unsubscribe at any time with one click.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
