export function MarqueeText() {
  const text = "ZMIENIAMY SIĘ DLA WAS • ACRO CLINIC PREMIUM • PERFORMANCE GEAR • "
  
  return (
    <div className="relative overflow-hidden bg-brand-gold py-4 my-20">
      <div className="flex whitespace-nowrap">
        <div
          className="flex animate-marquee"
          style={{
            animation: 'marquee-scroll 20s linear infinite',
          }}
        >
          <span className="font-[family-name:var(--font-heading)] font-bold text-3xl md:text-5xl text-black tracking-tight uppercase">
            {text}
          </span>
          <span className="font-[family-name:var(--font-heading)] font-bold text-3xl md:text-5xl text-black tracking-tight uppercase">
            {text}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
        }
      `}</style>
    </div>
  )
}
