export function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 440" role="img" aria-label="Developer working at a clean desk" className={className}>
      <defs>
        <linearGradient id="hero-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#fce7f3" />
        </linearGradient>
      </defs>
      <ellipse cx="280" cy="392" rx="220" ry="26" fill="#e2e8f0" />
      <rect x="70" y="48" width="420" height="280" rx="28" fill="url(#hero-bg)" opacity="0.7" />
      <rect x="330" y="86" width="112" height="86" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3" />
      <path d="M346 140l24-26 18 16 26-34 22 44" fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="360" cy="108" r="8" fill="#fbbf24" />
      <rect x="118" y="238" width="300" height="16" rx="8" fill="#f59e0b" />
      <rect x="140" y="254" width="14" height="126" rx="6" fill="#d97706" />
      <rect x="382" y="254" width="14" height="126" rx="6" fill="#d97706" />
      <rect x="214" y="176" width="118" height="66" rx="8" fill="#1e293b" />
      <rect x="222" y="184" width="102" height="50" rx="4" fill="#38bdf8" />
      <path d="M236 200h42M236 214h64M236 228h30" stroke="#e0f2fe" strokeWidth="5" strokeLinecap="round" />
      <rect x="206" y="240" width="134" height="8" rx="4" fill="#0f172a" />
      <circle cx="286" cy="120" r="28" fill="#fcd9b6" />
      <path d="M258 116c2-24 18-36 36-32 16 4 22 18 18 34-8-10-18-14-30-12-10 2-18 6-24 10z" fill="#1f2937" />
      <path d="M250 168c8-22 24-32 40-32s34 10 42 32l10 70h-102z" fill="#f97316" />
      <path d="M252 178l-30 44 18 10 30-36" fill="#f97316" />
      <path d="M326 178l28 42-16 12-28-34" fill="#f97316" />
      <circle cx="232" cy="236" r="9" fill="#fcd9b6" />
      <circle cx="344" cy="236" r="9" fill="#fcd9b6" />
      <path d="M262 238h56v18h-56z" fill="#1e3a8a" />
      <rect x="446" y="270" width="54" height="70" rx="8" fill="#fb7185" />
      <path d="M473 270c-18-28-8-58 0-70 8 12 18 42 0 70z" fill="#22c55e" />
      <path d="M473 250c-24-8-34-30-34-46 16 4 32 18 34 46z" fill="#16a34a" />
      <path d="M473 250c24-8 34-30 34-46-16 4-32 18-34 46z" fill="#4ade80" />
      <rect x="92" y="120" width="10" height="118" rx="5" fill="#94a3b8" />
      <path d="M62 120h70l-14-34h-42z" fill="#fbbf24" />
      <circle cx="97" cy="126" r="8" fill="#fde68a" />
      <rect x="150" y="300" width="70" height="46" rx="8" fill="#a78bfa" />
      <path d="M160 316h50M160 330h34" stroke="#ede9fe" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function TeamIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 360" role="img" aria-label="Team collaborating around a table" className={className}>
      <ellipse cx="260" cy="322" rx="200" ry="22" fill="#e2e8f0" />
      <rect x="120" y="210" width="280" height="14" rx="7" fill="#f59e0b" />
      <rect x="150" y="224" width="12" height="92" rx="6" fill="#d97706" />
      <rect x="358" y="224" width="12" height="92" rx="6" fill="#d97706" />
      <circle cx="170" cy="120" r="24" fill="#fcd9b6" />
      <path d="M146 116c0-20 14-32 30-28 14 4 18 16 14 30-10-8-28-8-44-2z" fill="#111827" />
      <path d="M138 168c6-22 20-32 34-32s28 10 34 32l8 44h-84z" fill="#38bdf8" />
      <circle cx="350" cy="120" r="24" fill="#fcd9b6" />
      <path d="M326 112c4-20 18-30 34-26 12 4 16 16 12 30-12-8-30-8-46-4z" fill="#7c2d12" />
      <path d="M316 168c6-22 20-32 34-32s28 10 34 32l8 44h-84z" fill="#fb7185" />
      <circle cx="260" cy="96" r="26" fill="#fcd9b6" />
      <path d="M234 92c2-22 16-34 34-30 16 4 22 18 18 32-10-10-34-10-52-2z" fill="#1f2937" />
      <path d="M224 150c8-24 22-34 36-34s28 10 36 34l10 62h-92z" fill="#f97316" />
      <rect x="214" y="168" width="92" height="46" rx="6" fill="#1e293b" />
      <rect x="222" y="176" width="76" height="30" rx="3" fill="#a7f3d0" />
      <path d="M232 188h40M232 198h56" stroke="#065f46" strokeWidth="4" strokeLinecap="round" />
      <rect x="130" y="182" width="64" height="32" rx="5" fill="#334155" />
      <rect x="326" y="182" width="64" height="32" rx="5" fill="#334155" />
      <circle cx="92" cy="250" r="26" fill="#bbf7d0" />
      <path d="M92 224v52M70 250h44" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" />
      <rect x="410" y="236" width="44" height="58" rx="8" fill="#fda4af" />
      <path d="M432 236c-14-22-6-44 0-54 6 10 14 32 0 54z" fill="#22c55e" />
    </svg>
  );
}

export function CtaIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 400" role="img" aria-label="Two specialists planning a website launch" className={className}>
      <defs>
        <linearGradient id="cta-blob" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="55%" stopColor="#fca5a5" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
      </defs>
      <path d="M96 120c40-70 150-92 236-58 86 34 130 120 96 196-34 76-150 110-244 76C90 300 56 190 96 120z" fill="url(#cta-blob)" opacity="0.85" />
      <ellipse cx="260" cy="352" rx="190" ry="20" fill="#e2e8f0" />
      <rect x="130" y="238" width="260" height="14" rx="7" fill="#7c3aed" />
      <rect x="156" y="252" width="12" height="92" rx="6" fill="#6d28d9" />
      <rect x="352" y="252" width="12" height="92" rx="6" fill="#6d28d9" />
      <circle cx="190" cy="150" r="24" fill="#fcd9b6" />
      <path d="M166 146c0-22 14-34 32-30 14 4 18 18 14 32-12-8-30-8-46-2z" fill="#111827" />
      <path d="M156 200c6-22 20-32 34-32s28 10 34 32l8 40h-84z" fill="#0ea5e9" />
      <circle cx="330" cy="150" r="24" fill="#fcd9b6" />
      <path d="M306 142c4-20 18-30 34-26 12 4 16 16 12 30-12-8-30-8-46-4z" fill="#7c2d12" />
      <path d="M296 200c6-22 20-32 34-32s28 10 34 32l8 40h-84z" fill="#f43f5e" />
      <rect x="214" y="192" width="92" height="48" rx="6" fill="#1e293b" />
      <rect x="222" y="200" width="76" height="32" rx="3" fill="#bfdbfe" />
      <path d="M232 212h44M232 222h58" stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round" />
      <rect x="366" y="270" width="48" height="62" rx="8" fill="#fb923c" />
      <path d="M390 270c-16-24-6-48 0-58 6 10 16 34 0 58z" fill="#22c55e" />
      <path d="M390 252c-20-8-28-26-28-40 14 4 26 16 28 40z" fill="#16a34a" />
      <circle cx="118" cy="286" r="22" fill="#a7f3d0" />
      <path d="M108 286l8 8 16-18" stroke="#059669" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function BrandMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Silk City Tech logo">
      <defs>
        <linearGradient id="brand-hex" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#fb7185" />
        </linearGradient>
      </defs>
      <path d="M32 4l24 14v28L32 60 8 46V18z" fill="url(#brand-hex)" />
      <path d="M32 12l17 10v20L32 52 15 42V22z" fill="#ffffff" opacity="0.92" />
      <path d="M24 24v16M40 24v16M24 32h16" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
