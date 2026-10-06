const CATEGORY_COLORS: Record<string, string> = {
  "T-Shirts": "#e8e2d8",
  Hoodies: "#d9cfc1",
  Jackets: "#cdd3d8",
  Pants: "#d6d2c4",
  Shorts: "#e3ddd0",
  Sweatshirts: "#ded6c8",
  Polos: "#dde3dd",
  Footwear: "#e6e6e6",
  Accessories: "#e8ddd2",
  Sweaters: "#ddd3c6",
  Shirts: "#e2e6e0",
};

const DEFAULT_BG = "#e6e3dd";

const LINE = `stroke="#17171a" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" fill="#17171a" fill-opacity="0.07"`;
const STROKE = `stroke="#17171a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" fill="none"`;

// Hand-drawn "flat sketch" garment illustrations (fashion technical-drawing style),
// one per seeded category, in a shared 240x240 coordinate space.
const CATEGORY_ICONS: Record<string, string> = {
  "T-Shirts": `
    <path ${LINE} d="M90 50 L90 35 Q120 48 150 35 L150 50 L190 70 L175 100 L150 85 L150 205 L90 205 L90 85 L65 100 L50 70 Z"/>
    <path ${STROKE} d="M90 35 Q120 48 150 35"/>
  `,
  Hoodies: `
    <path ${LINE} d="M93 68 L93 90 L150 90 L150 68 L188 85 L173 112 L150 100 L150 210 L90 210 L90 100 L67 112 L52 85 Z"/>
    <path ${LINE} d="M80 70 Q120 20 160 70 Q145 58 120 58 Q95 58 80 70 Z"/>
    <path ${STROKE} d="M113 68 L113 92 M131 68 L131 92"/>
    <circle cx="113" cy="94" r="2.5" fill="#17171a"/>
    <circle cx="131" cy="94" r="2.5" fill="#17171a"/>
    <rect ${STROKE} x="100" y="150" width="40" height="30" rx="3"/>
  `,
  Jackets: `
    <path ${LINE} d="M90 65 L90 210 L150 210 L150 65 Z"/>
    <path ${STROKE} d="M90 65 L120 95 L150 65"/>
    <path ${LINE} d="M90 70 L55 85 L63 130 L90 118 Z"/>
    <path ${LINE} d="M150 70 L185 85 L177 130 L150 118 Z"/>
    <path ${STROKE} d="M120 95 L120 205"/>
  `,
  Pants: `
    <path ${LINE} d="M75 40 L165 40 L170 210 L140 210 L120 100 L100 210 L70 210 Z"/>
    <path ${STROKE} d="M75 40 L165 40"/>
  `,
  Shorts: `
    <path ${LINE} d="M75 50 L165 50 L168 150 L138 150 L120 100 L102 150 L72 150 Z"/>
    <path ${STROKE} d="M75 50 L165 50"/>
  `,
  Sweatshirts: `
    <path ${LINE} d="M88 38 L88 50 L152 50 L152 38 L192 68 L176 98 L152 83 L152 205 L88 205 L88 83 L64 98 L48 68 Z"/>
    <path ${STROKE} d="M88 38 L152 38"/>
    <path ${STROKE} d="M93 195 L147 195"/>
  `,
  Polos: `
    <path ${LINE} d="M90 50 L90 35 Q120 48 150 35 L150 50 L190 70 L175 100 L150 85 L150 205 L90 205 L90 85 L65 100 L50 70 Z"/>
    <path ${STROKE} d="M103 40 L120 62 L137 40"/>
    <path ${STROKE} d="M120 62 L120 95"/>
    <circle cx="120" cy="72" r="2.2" fill="#17171a"/>
    <circle cx="120" cy="84" r="2.2" fill="#17171a"/>
  `,
  Footwear: `
    <path ${LINE} d="M42 168 Q42 142 72 136 L98 132 Q108 112 130 100 Q152 88 170 96 L182 104 Q198 110 198 132 L198 158 Q198 172 184 172 L54 172 Q42 172 42 168 Z"/>
    <path ${STROKE} d="M98 132 L104 170 M130 100 L138 170 M164 94 L170 170"/>
    <path ${STROKE} d="M42 168 L198 168"/>
  `,
  Accessories: `
    <path ${LINE} d="M58 135 Q58 78 120 78 Q182 78 182 135 Z"/>
    <path ${LINE} d="M58 135 L34 141 Q27 144 34 148 L58 144 Z"/>
    <circle cx="120" cy="86" r="4" fill="#17171a"/>
    <path ${STROKE} d="M90 78 Q120 100 150 78"/>
  `,
  Sweaters: `
    <path ${LINE} d="M88 55 L88 68 L152 68 L152 55 L192 76 L176 105 L152 92 L152 205 L88 205 L88 92 L64 105 L48 76 Z"/>
    <path ${STROKE} d="M88 68 Q120 80 152 68"/>
    <path ${STROKE} d="M93 125 L147 125 M93 145 L147 145 M93 165 L147 165 M93 185 L147 185"/>
  `,
  Shirts: `
    <path ${LINE} d="M93 50 L93 60 L120 85 L147 60 L147 50 L188 72 L173 100 L147 86 L147 210 L93 210 L93 86 L67 100 L52 72 Z"/>
    <path ${STROKE} d="M120 85 L120 210"/>
    <circle cx="120" cy="105" r="2" fill="#17171a"/>
    <circle cx="120" cy="130" r="2" fill="#17171a"/>
    <circle cx="120" cy="155" r="2" fill="#17171a"/>
    <circle cx="120" cy="180" r="2" fill="#17171a"/>
  `,
};

function monogram(name: string, category: string): string {
  const letter = (name.trim().charAt(0) || "A").toUpperCase();
  const label = category.toUpperCase();
  return `
    <text x="300" y="400" font-family="Inter, system-ui, sans-serif" font-size="240" font-weight="700" fill="#17171a" fill-opacity="0.1" text-anchor="middle" dominant-baseline="middle">${letter}</text>
    ${label ? `<text x="300" y="742" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="#17171a" fill-opacity="0.5" text-anchor="middle">${label}</text>` : ""}
  `;
}

export function productPlaceholder(name: string, category = ""): string {
  const bg = CATEGORY_COLORS[category] ?? DEFAULT_BG;
  const icon = CATEGORY_ICONS[category];

  const content = icon
    ? `<g transform="translate(150 160) scale(1.25)">${icon}</g>
       <text x="300" y="742" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="#17171a" fill-opacity="0.5" text-anchor="middle">${category.toUpperCase()}</text>`
    : monogram(name, category);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
    <rect width="600" height="800" fill="${bg}"/>
    ${content}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
