/* Ember — Icon set. Inline SVGs in the app's line+fill style.
   Reused from the Figma nav paths where possible; others matched to the
   same ~2px stroke / soft-corner family (Lucide-equivalent).
   All use currentColor so they inherit `color`. */

function Icon({ d, size = 24, stroke = 2, fill = 'none', viewBox = '0 0 24 24', children, style }) {
  return (
    <svg width={size} height={size} viewBox={viewBox} fill={fill}
      stroke={fill === 'none' ? 'currentColor' : 'none'}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', fl: 0, ...style }}>
      {d ? <path d={d} /> : children}
    </svg>
  );
}

const I = {
  home:   (p) => <Icon {...p} d="M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />,
  report: (p) => <Icon {...p}><rect x="3" y="11" width="4.5" height="9" rx="1.4"/><rect x="9.75" y="4" width="4.5" height="16" rx="1.4"/><rect x="16.5" y="8" width="4.5" height="12" rx="1.4"/></Icon>,
  moon:   (p) => <Icon {...p} d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5Z" />,
  trophy: (p) => <Icon {...p} d="M7 4h10v3a5 5 0 0 1-10 0V4ZM7 5H4.5v1.5A3 3 0 0 0 7 9.4M17 5h2.5v1.5A3 3 0 0 1 17 9.4M9.5 13.5 9 17h6l-.5-3.5M8 20h8M12 17v3" />,
  bell:   (p) => <Icon {...p} d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 0 0 4 0" />,
  user:   (p) => <Icon {...p}><circle cx="12" cy="8.5" r="3.6"/><path d="M5 20a7 7 0 0 1 14 0"/></Icon>,
  brain:  (p) => <Icon {...p} fill="currentColor" viewBox="0 0 24 24"><path d="M9 3.5a3 3 0 0 0-3 3 3 3 0 0 0-1.5 5.6A3 3 0 0 0 6 17.5a3 3 0 0 0 3 3 1.2 1.2 0 0 0 1.2-1.2V4.7A1.2 1.2 0 0 0 9 3.5ZM15 3.5a3 3 0 0 1 3 3 3 3 0 0 1 1.5 5.6A3 3 0 0 1 18 17.5a3 3 0 0 1-3 3 1.2 1.2 0 0 1-1.2-1.2V4.7A1.2 1.2 0 0 1 15 3.5Z"/></Icon>,
  sparkle:(p) => <Icon {...p} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.5l1.7 4.6L18.5 9l-4.8 1.9L12 15.5l-1.7-4.6L5.5 9l4.8-1.9L12 2.5ZM18.5 14l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9.9-2.3Z"/></Icon>,
  clock:  (p) => <Icon {...p}><circle cx="12" cy="12" r="8.3"/><path d="M12 7.5V12l3 1.8"/></Icon>,
  star:   (p) => <Icon {...p} fill="currentColor" d="M12 3.2l2.6 5.3 5.9.86-4.25 4.14 1 5.86L12 16.7l-5.25 2.76 1-5.86L3.5 9.36l5.9-.86L12 3.2Z" />,
  chevR:  (p) => <Icon {...p} d="M9 5l7 7-7 7" />,
  info:   (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.8" r="0.4" fill="currentColor" stroke="currentColor"/></Icon>,
  chevD:  (p) => <Icon {...p} d="M5 9l7 7 7-7" />,
  sun:    (p) => <Icon {...p}><circle cx="12" cy="12" r="4.3"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></Icon>,
  plus:   (p) => <Icon {...p} d="M12 5v14M5 12h14" />,
  userPlus:(p)=> <Icon {...p}><circle cx="9" cy="8" r="3.4"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0M18 8v6M15 11h6"/></Icon>,
  share:  (p) => <Icon {...p}><circle cx="6" cy="12" r="2.6"/><circle cx="17" cy="6" r="2.6"/><circle cx="17" cy="18" r="2.6"/><path d="M8.4 10.8 14.6 7.2M8.4 13.2l6.2 3.6"/></Icon>,
  play:   (p) => <Icon {...p} fill="currentColor" stroke="none" viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5-11-6.5Z"/></Icon>,
  camera: (p) => <Icon {...p}><path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2L8 5h8l1.5 2h2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5v-9Z"/><circle cx="12" cy="13" r="3.3"/></Icon>,
  gamepad:(p) => <Icon {...p}><path d="M7 9h10a4 4 0 0 1 4 4 3 3 0 0 1-5.4 1.8L14 13H10l-1.6 1.8A3 3 0 0 1 3 13a4 4 0 0 1 4-4Z"/><path d="M7.5 11.5v2M6.5 12.5h2M15.7 11.7h.01M17.3 13.3h.01"/></Icon>,
  flame:  (p) => <Icon {...p} fill="currentColor" stroke="none" viewBox="0 0 24 24"><path d="M12 2.2c.2 2.5-.5 4.7-2.3 6.4l-1.2 1.1c-.6.5-1.1 1-1.6 1.6-2.9 3.4-1.6 8.1 2 10.5 2.5 1.7 5.5 2 8.1.5 2.8-1.6 4.4-4.7 4.2-7.9-.2-3-1.9-6-4.3-8.4-.9-.9-1.8-1.7-2.9-2.4-.4-.2-.7-.4-1.1-.5-.5-.1-.9.2-.9.7Zm.9 9.3c.4-.1.7.1 1 .4 1.4 1.9 2.4 4.1 2.2 6.4 0 .3-.4.4-.5.2-.4-2-1.7-3.8-3.3-5-.2-.2-.3-.5-.2-.8.1-.3.4-1 .8-1.2Z"/></Icon>,
  moonStars:(p) => <Icon {...p}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5Z"/><path d="M19 3.5l.5 1.3 1.3.5-1.3.5L19 7.1l-.5-1.3-1.3-.5 1.3-.5L19 3.5Z" fill="currentColor" stroke="none"/></Icon>,
  book:   (p) => <Icon {...p}><path d="M4 19.5V6a2 2 0 0 1 2-2h6v14H6a2 2 0 0 1-2-2Z"/><path d="M20 19.5V6a2 2 0 0 0-2-2h-6v14h6a2 2 0 0 0 2-2Z"/><path d="M12 4v14"/></Icon>,
  zap:    (p) => <Icon {...p}><path d="M13 2 4.5 13.5H11L10 22l9.5-11.5H13L13 2Z"/></Icon>,
  waves:  (p) => <Icon {...p}><path d="M3 10.5c1.5-2.5 3-2.5 4.5 0s3 2.5 4.5 0 3-2.5 4.5 0 3 2.5 4.5 0"/><path d="M3 15c1.5-2.5 3-2.5 4.5 0s3 2.5 4.5 0 3-2.5 4.5 0 3 2.5 4.5 0"/></Icon>,
  pen:    (p) => <Icon {...p}><path d="M4 20.5 8 19.5 18.5 9l-3-3L5 16.5 4 20.5Z"/><path d="M15.5 6l3 3"/></Icon>,
  sunrise:(p) => <Icon {...p}><path d="M3 17h18"/><circle cx="12" cy="12" r="2.5"/><path d="M12 7V5M17.5 9l1.4-1.4M6.5 9 5.1 7.6M20 13h2M2 13h2"/></Icon>,
  arrowUp:  (p) => <Icon {...p} d="M12 19V5M6 11l6-6 6 6" />,
  arrowDown:(p) => <Icon {...p} d="M12 5v14M6 13l6 6 6-6" />,
  calendar:(p)=> <Icon {...p}><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.5h17M8 3v3.5M16 3v3.5"/></Icon>,
  check:  (p) => <Icon {...p} d="M5 12.5l4.5 4.5L19 7" />,
  shield: (p) => <Icon {...p}><path d="M12 3l7 2.5v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9v-6L12 3Z"/><path d="M9 12l2 2 4-4"/></Icon>,
  medal:  (p) => <Icon {...p}><circle cx="12" cy="14" r="5"/><path d="M8.5 9.5 6 3h4l1.5 4M15.5 9.5 18 3h-4l-1.5 4M12 12.4l.9 1.7 1.9.3-1.4 1.3.3 1.9-1.7-.9-1.7.9.3-1.9-1.4-1.3 1.9-.3.9-1.7Z"/></Icon>,
  lock:   (p) => <Icon {...p}><rect x="5" y="10.5" width="14" height="9.5" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></Icon>,
  instagram:(p)=> <Icon {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none"/></Icon>,
  youtube:(p) => <Icon {...p}><rect x="3" y="6" width="18" height="12" rx="3.5"/><path d="M10.5 9.2v5.6l4.5-2.8-4.5-2.8Z" fill="currentColor" stroke="none"/></Icon>,
};

Object.assign(window, { Icon, I, AppIcon });

/* Real-service brand icons rendered as proper app tiles (Simple Icons glyphs).
   Use for actual apps (YouTube, Instagram, …); use the line set `I` for UI. */
const APP_ICON_OVERRIDES = {
  kakaotalk: window.__kakaoIcon || '../uploads/pasted-1781120432098-1.png',
};

function AppIcon({ slug, bg, fg = 'white', size = 56, radius = 16, glyph = 0.54, style }) {
  const override = APP_ICON_OVERRIDES[slug];
  if (override) {
    return (
      <div style={{
        width: size, height: size, borderRadius: radius, flexShrink: 0,
        overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.30)', ...style,
      }}>
        <img src={override} width={size} height={size} alt={slug} style={{ objectFit: 'cover', display: 'block' }} />
      </div>
    );
  }
  const src = (window.__resources && window.__resources[slug]) || `https://cdn.simpleicons.org/${slug}/${fg}`;
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, background: bg, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.30)', ...style,
    }}>
      <img src={src} width={size * glyph} height={size * glyph} alt={slug} />
    </div>
  );
}

const APP_BRANDS = {
  youtube:   { bg: '#FF0000', fg: 'white' },
  instagram: { bg: 'linear-gradient(45deg,#F58529,#DD2A7B,#8134AF)', fg: 'white' },
  tiktok:    { bg: '#000000', fg: 'white' },
  kakaotalk: { bg: '#FEE500', fg: '3C1E1E' },
  netflix:   { bg: '#000000', fg: 'E50914' },
  spotify:   { bg: '#1DB954', fg: 'white' },
  x:           { bg: '#000000', fg: 'white' },
  googlechrome:{ bg: '#FFFFFF', fg: '4285F4' },
  discord:     { bg: '#5865F2', fg: 'white' },
  naver:       { bg: '#03C75A', fg: 'white' },
};
Object.assign(window, { APP_BRANDS });
