// Soft, slowly-morphing color washes behind the hero text - built with animated SVG
// gradients (SMIL <animate> on each shape's `d`) rather than a blur filter, since a
// CSS/SVG blur on an animated path silently freezes compositing in some renderers.
export default function HeroBackground() {
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    return (
      <svg className="hero-bg" viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="heroGlowStatic" cx="55%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#c9703f" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#c9703f" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1400" height="700" fill="url(#heroGlowStatic)" />
      </svg>
    );
  }

  return (
    <svg className="hero-bg" viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="heroGlow1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c9703f" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#c9703f" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="heroGlow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8a6450" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8a6450" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="heroGlow3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e9c9b6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#e9c9b6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path fill="url(#heroGlow1)">
        <animate
          attributeName="d"
          dur="10s"
          repeatCount="indefinite"
          values="
            M820,120 C1000,60 1180,140 1240,280 C1300,420 1180,520 1020,500 C860,480 760,380 760,260 C760,200 780,150 820,120 Z;
            M700,180 C920,40 1260,80 1300,260 C1340,440 1140,560 940,480 C740,400 660,320 680,240 C700,160 650,220 700,180 Z;
            M900,60 C1100,100 1340,220 1260,380 C1180,540 980,520 860,440 C740,360 700,260 740,180 C780,100 800,30 900,60 Z;
            M820,120 C1000,60 1180,140 1240,280 C1300,420 1180,520 1020,500 C860,480 760,380 760,260 C760,200 780,150 820,120 Z"
        />
      </path>
      <path fill="url(#heroGlow2)">
        <animate
          attributeName="d"
          dur="8s"
          repeatCount="indefinite"
          values="
            M750,50 C900,20 1020,100 1000,200 C980,300 860,330 760,290 C660,250 620,150 660,90 C680,65 710,55 750,50 Z;
            M650,120 C850,0 1080,60 1040,220 C1000,380 800,380 680,300 C560,220 520,200 580,140 C610,110 600,140 650,120 Z;
            M820,0 C980,40 1120,180 1000,280 C880,380 680,340 620,240 C560,140 620,60 700,20 C740,0 760,-10 820,0 Z;
            M750,50 C900,20 1020,100 1000,200 C980,300 860,330 760,290 C660,250 620,150 660,90 C680,65 710,55 750,50 Z"
        />
      </path>
      <path fill="url(#heroGlow3)">
        <animate
          attributeName="d"
          dur="13s"
          repeatCount="indefinite"
          values="
            M900,350 C1080,300 1280,380 1300,480 C1320,580 1180,640 1020,620 C860,600 780,500 800,420 C820,370 850,360 900,350 Z;
            M760,420 C980,280 1260,320 1340,460 C1420,600 1180,680 980,640 C780,600 680,540 700,460 C720,380 680,460 760,420 Z;
            M1000,280 C1200,340 1380,480 1260,580 C1140,680 900,640 800,540 C700,440 740,340 840,300 C900,276 940,264 1000,280 Z;
            M900,350 C1080,300 1280,380 1300,480 C1320,580 1180,640 1020,620 C860,600 780,500 800,420 C820,370 850,360 900,350 Z"
        />
      </path>
    </svg>
  );
}
