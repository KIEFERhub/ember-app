/* Ember — Flame State System  ★ core brand asset ★  (v3: blue-perfect + wind)
   The flame is a STATUS system, not a warning.
   Intuition: "the better you restrain, the calmer & cooler the flame."
     · color  : perfect control = BLUE fire (hottest/purest) → teal → gold → orange → deep red.
                wide deviation across the 5 steps so each state reads distinctly.
     · motion : restrained = STABLE, upright, slow, gentle.  overuse = STRONG WIND —
                the flame leans, gusts and whips faster & harder the worse it gets.
     · size   : restrained = big & healthy; overuse shrinks toward a struggling ember.
   Built in layers (rim/mid/core/tip) + an animated turbulence ripple so it moves
   like real fire.  The flame is its own organic shape (logo stays in the header).

   <FlameState score={0..100} size={number} showLabel />  higher = more restraint = better.
*/

const FLAME_BODY = "M62 196 C28 193 16 159 29 127 C36 109 29 95 41 77 C47 67 43 56 39 45 C52 58 54 45 55 31 C56 19 65 9 64 24 C62 41 75 51 83 71 C93 93 97 123 86 151 C80 176 60 196 62 196 Z";
const TONGUE = "M7 26 C2 22 3 12 7 0 C11 12 13 22 7 26 Z";

//                                                   ── color (cool→warm) ──   ─ glow ─   ─ motion: calm→wind ─
const FLAME_STATES = [
  { min: 80, key: 'pristine', label: '푸른불',   desc: '가장 환하게 타오르고 있어요',   scale: 1.0,  rim: '#1E40AF', mid: '#3B82F6', core: '#9FD4FF', tip: '#EAF6FF', glow: 0.55, disp: 4,  speed: 3.4, wind: 0.6, windDur: 5.2, tongues: 2, twinkle: true },
  { min: 60, key: 'steady',   label: '잔잔',     desc: '잔잔하게 빛나고 있어요',     scale: 0.9,  rim: '#0E7490', mid: '#1FBFB8', core: '#9FF0E0', tip: '#E6FFFA', glow: 0.46, disp: 5,  speed: 3.0, wind: 1.8, windDur: 4.4, tongues: 2, twinkle: true },
  { min: 40, key: 'flicker',  label: '일렁',     desc: '부드럽게 일렁이고 있어요',     scale: 0.78, rim: '#D9831F', mid: '#F2A93B', core: '#FBE08C', tip: '#FFF4CC', glow: 0.34, disp: 7,  speed: 2.4, wind: 5,   windDur: 3.0, tongues: 2, twinkle: false },
  { min: 20, key: 'windy',    label: '흔들림',   desc: '바람에 흔들리고 있어요',     scale: 0.64, rim: '#E0451C', mid: '#F26B22', core: '#FBA24A', tip: '#FFD08A', glow: 0.26, disp: 10, speed: 1.7, wind: 11,  windDur: 1.9, tongues: 3, twinkle: false },
  { min: 0,  key: 'storm',    label: '휘몰아침', desc: '거센 바람에 휘청이고 있어요', scale: 0.54, rim: '#7E1D12', mid: '#C7301C', core: '#F2632A', tip: '#FBA24A', glow: 0.20, disp: 14, speed: 1.2, wind: 18,  windDur: 1.2, tongues: 3, twinkle: false },
];

function flameStateFor(score) {
  return FLAME_STATES.find(s => score >= s.min) || FLAME_STATES[FLAME_STATES.length - 1];
}

function FlameState({ score = 75, size = 168, showLabel = false }) {
  const st = flameStateFor(score);
  const uid = React.useId().replace(/:/g, '');
  const ratio = 200 / 120;
  const w = size * st.scale;
  const h = w * ratio;
  const fid = `fire-${uid}`;

  const layer = (s, fill, cls, dur) => (
    <g style={{ transformBox: 'view-box', transformOrigin: '60px 196px', transform: `scale(${s})` }}>
      <path className={cls} d={FLAME_BODY} fill={fill}
        style={{ transformBox: 'view-box', transformOrigin: '60px 196px', animationDuration: dur }} />
    </g>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%' }}>
      <div style={{ position: 'relative', width: size, height: h, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        {/* glow halo — colored to match the flame */}
        <div style={{
          position: 'absolute', bottom: '4%', left: '50%', transform: 'translateX(-50%)',
          width: w * 1.7, height: w * 1.7, borderRadius: '9999px',
          background: `radial-gradient(circle, ${hexA(st.mid, st.glow)} 0%, ${hexA(st.rim, st.glow * 0.5)} 32%, rgba(0,0,0,0) 68%)`,
          filter: 'blur(3px)', pointerEvents: 'none',
        }} />

        {/* twinkle sparks — only the calm (good) states */}
        {st.twinkle && [0, 1, 2, 3].map(i => (
          <span key={i} className="ember-spark" style={{
            left: `${[24, 68, 40, 80][i]}%`, bottom: `${[58, 50, 80, 66][i]}%`,
            animationDelay: `${i * 0.5}s`, width: i % 2 ? 5 : 7, height: i % 2 ? 5 : 7,
            background: `radial-gradient(circle, ${st.tip} 0%, ${st.mid} 60%, rgba(0,0,0,0) 100%)`,
          }} />
        ))}

        <svg width={w} height={h} viewBox="0 0 120 200" style={{ position: 'relative', zIndex: 1, overflow: 'visible' }}>
          <defs>
            <linearGradient id={`rim-${uid}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={st.rim} /><stop offset="70%" stopColor={st.rim} /><stop offset="100%" stopColor={st.mid} />
            </linearGradient>
            <linearGradient id={`mid-${uid}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={st.mid} /><stop offset="100%" stopColor={st.core} />
            </linearGradient>
            <linearGradient id={`core-${uid}`} x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={st.core} /><stop offset="100%" stopColor={st.tip} />
            </linearGradient>
            <filter id={fid} x="-60%" y="-30%" width="220%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency="0.013 0.028" numOctaves="2" seed={2} result="n">
                <animate attributeName="baseFrequency" dur={`${st.speed * 3}s`} values="0.013 0.028;0.022 0.055;0.013 0.028" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="n" xChannelSelector="R" yChannelSelector="G">
                <animate attributeName="scale" dur={`${st.speed}s`} values={`${st.disp * 0.5};${st.disp};${st.disp * 0.5}`} repeatCount="indefinite" />
              </feDisplacementMap>
            </filter>
          </defs>

          {/* wind wrapper — leans & gusts from the base; amplitude grows as restraint drops */}
          <g className="flame-wind" style={{ transformBox: 'view-box', transformOrigin: '60px 196px', ['--wind']: st.wind, animationDuration: `${st.windDur}s` }}>
            <g filter={`url(#${fid})`}>
              {layer(1,    `url(#rim-${uid})`,  'flame-l flame-sway',    `${st.speed * 1.6}s`)}
              {layer(0.78, `url(#mid-${uid})`,  'flame-l flame-breathe', `${st.speed * 1.2}s`)}
              {layer(0.5,  `url(#core-${uid})`, 'flame-l flame-breathe2', `${st.speed}s`)}
              <g style={{ transformBox: 'view-box', transformOrigin: '60px 196px', transform: 'scale(0.26)' }}>
                <path className="flame-l flame-breathe" d={FLAME_BODY} fill={st.tip} style={{ transformBox: 'view-box', transformOrigin: '60px 196px', animationDuration: `${st.speed * 0.8}s` }} />
              </g>

              {/* licking tongues — blown sideways harder with wind */}
              {Array.from({ length: st.tongues }).map((_, i) => (
                <g key={i} transform={`translate(${[46, 70, 58][i]} ${[40, 56, 18][i]}) scale(${[0.9, 0.7, 1.1][i]})`}>
                  <g className="flame-tongue" style={{ transformBox: 'fill-box', transformOrigin: '50% 100%', ['--drift']: st.wind, animationDuration: `${st.windDur * 0.7}s`, animationDelay: `${i * 0.5}s` }}>
                    <path d={TONGUE} fill={st.mid} />
                  </g>
                </g>
              ))}
            </g>
          </g>
        </svg>
      </div>

      {showLabel && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ font: 'var(--h2)', color: 'var(--fg-1)' }}>{st.label}</div>
          <div style={{ font: 'var(--caption)', color: 'var(--fg-2)', marginTop: 4 }}>{st.desc}</div>
        </div>
      )}
    </div>
  );
}

function hexA(hex, a) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

(function injectFlameCSS() {
  const prev = document.getElementById('ember-flame-css');
  if (prev) prev.remove();
  const s = document.createElement('style');
  s.id = 'ember-flame-css';
  s.textContent = `
    .flame-l, .flame-wind, .flame-tongue { will-change: transform; }
    /* base flicker — subtle, the turbulence filter does most of the "alive" work */
    @keyframes flameSway     { 0%,100%{transform:scaleY(1) skewX(0deg)} 30%{transform:scaleY(1.05) skewX(-1.5deg)} 60%{transform:scaleY(0.98) skewX(1.5deg)} }
    @keyframes flameBreathe  { 0%,100%{transform:scaleY(1) scaleX(1)}    50%{transform:scaleY(1.07) scaleX(0.96)} }
    @keyframes flameBreathe2 { 0%,100%{transform:scaleY(1) translateY(0)} 50%{transform:scaleY(1.1) translateY(-2px)} }
    .flame-sway     { animation: flameSway ease-in-out infinite; }
    .flame-breathe  { animation: flameBreathe ease-in-out infinite; }
    .flame-breathe2 { animation: flameBreathe2 ease-in-out infinite; }
    /* WIND — biased downwind lean + gusting. amplitude = --wind (deg). calm≈0, storm≈18 */
    @keyframes windLean {
      0%   { transform: skewX(calc(var(--wind) * 0.3deg)) translateX(calc(var(--wind) * 0.15px)); }
      32%  { transform: skewX(calc(var(--wind) * 1.05deg)) translateX(calc(var(--wind) * 0.7px)) scaleX(0.97); }
      54%  { transform: skewX(calc(var(--wind) * 0.55deg)) translateX(calc(var(--wind) * 0.35px)); }
      78%  { transform: skewX(calc(var(--wind) * 1.25deg)) translateX(calc(var(--wind) * 0.95px)) scaleX(0.95); }
      100% { transform: skewX(calc(var(--wind) * 0.3deg)) translateX(calc(var(--wind) * 0.15px)); }
    }
    .flame-wind { animation: windLean ease-in-out infinite; }
    /* tongues blow up-and-downwind, more sideways the windier it is */
    @keyframes flameTongue { 0%{opacity:0; transform:translate(0,6px) scaleY(.6)} 25%{opacity:1} 70%{opacity:.85} 100%{opacity:0; transform:translate(calc(var(--drift) * 1.3px), -26px) scaleY(1.25)} }
    .flame-tongue { animation: flameTongue ease-out infinite; }
    .ember-spark {
      position: absolute; border-radius: 9999px; z-index: 2; pointer-events: none; opacity: 0;
      animation: sparkRise 2.4s ease-out infinite;
    }
    @keyframes sparkRise { 0%{opacity:0; transform:translateY(4px) scale(.5)} 20%{opacity:1} 60%{opacity:.9} 100%{opacity:0; transform:translateY(-26px) scale(1.15)} }
  `;
  document.head.appendChild(s);
})();

Object.assign(window, { FlameState, flameStateFor, FLAME_STATES });
