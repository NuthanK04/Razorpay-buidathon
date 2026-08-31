export function BrandValues() {
  const values = [
    {
      number: '01',
      title: 'Materials',
      description: 'Premium materials selected for durability and everyday use.',
      detail: 'From paraffin-waxed Scottish cottons to vegetable-tanned Tuscan hides, every raw element is ethically sourced and chosen for how gracefully it ages.',
    },
    {
      number: '02',
      title: 'Function',
      description: 'Designed around the way people actually live.',
      detail: 'Ergonomic proportions, intuitive pocket placements, and weather-proof closures that serve your real-world daily commute and global travels.',
    },
    {
      number: '03',
      title: 'Longevity',
      description: 'Timeless products made to stay relevant beyond seasons.',
      detail: 'We reject seasonal turnover. Our silhouettes are engineered to outlive fleeting trends and remain indispensable companions for decades.',
    },
  ];

  return (
    <section id="brand-story" className="scroll-mt-24 border-b border-border/70 bg-background py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <span className="editorial-subhead block mb-3">Core Pillars</span>
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground sm:text-4xl md:text-5xl">
            Made with intention.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            Three guiding commitments that inform every sketch, pattern, and stitch in our studio.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 divide-y md:divide-y-0 md:divide-x divide-border/80">
          {values.map((v, index) => (
            <div
              key={v.number}
              className={`flex flex-col pt-8 md:pt-0 ${
                index !== 0 ? 'md:pl-8 lg:pl-12' : ''
              }`}
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs font-semibold text-muted-foreground tracking-wider">
                  {v.number} —
                </span>
                <h3 className="text-xl font-medium tracking-tight text-foreground">
                  {v.title}
                </h3>
              </div>

              <p className="mt-4 text-sm font-medium text-foreground leading-snug">
                {v.description}
              </p>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {v.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrandValues;
