/* Ember — Home hero, "불씨 컬렉션" (Opal-style).
   A swipeable flame on a pedestal: your current flame sits center with
   adjacent states peeking on pedestals to the sides. Swipe (or tap a side
   flame) to browse all 5 states — each shows a state pill + caption.
   Below: a FOCUS / 스크린타임 / 주범 stats row. 스크린타임 › opens the
   today-vs-last-week usage report sheet. */

// per-state flame, ordered worst → best so higher grades sit to the RIGHT
const HERO_META = [
  { key: 'storm',    sample: 8  },
  { key: 'windy',    sample: 28 },
  { key: 'flicker',  sample: 50 },
  { key: 'steady',   sample: 72 },
  { key: 'pristine', sample: 92 },
];

const H_WEEK = ['월', '화', '수', '목', '금', '토', '일'];
const H_THIS = [188, 172, 205, 158, 168, 142, 168];
const H_LAST = [212, 220, 226, 198, 205, 232, 206];
const H_REDUCED = [{ t: '숏폼', d: 41 }, { t: '게임', d: 18 }, { t: '웹서핑', d: 9 }];
const CULPRITS = ['youtube', 'instagram', 'kakaotalk'];

// today's per-app breakdown (sums to ~2h 48m = 168m, matching the screen-time stat)
const TODAY_APPS = [
  { brand: 'youtube',   name: 'YouTube',   min: 62 },
  { brand: 'instagram', name: 'Instagram', min: 38 },
  { brand: 'tiktok',    name: 'TikTok',    min: 26 },
  { brand: 'kakaotalk', name: 'KakaoTalk', min: 24 },
  { brand: 'netflix',   name: 'Netflix',   min: 18 },
];

function hFmt(m) { const h = Math.floor(m / 60), x = m % 60; return h ? `${h}h ${x}m` : `${x}m`; }

/* a flame standing on a pedestal, with a colored glow */
function FlamePillar({ score, size, dim, flareRef }) {
  const st = flameStateFor(score);
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: dim ? 0.5 : 1, transition: 'opacity .3s' }}>
      {/* glow */}
      <div style={{
        position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)',
        width: size * 1.5, height: size * 1.5, borderRadius: '50%', pointerEvents: 'none',
        background: `radial-gradient(circle, ${st.mid}${dim ? '33' : '66'}, transparent 68%)`,
        filter: 'blur(6px)',
      }} />
      <div ref={flareRef} style={{ position: 'relative', transformOrigin: '50% 82%' }}><FlameState score={score} size={size} /></div>
      {/* pedestal */}
      <div style={{
        width: size * 0.5, height: size * 0.11, marginTop: -size * 0.04, borderRadius: '50%',
        background: 'var(--pedestal)', boxShadow: '0 6px 14px -4px rgba(0,0,0,0.4)',
      }} />
    </div>
  );
}

function StatePill({ label }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding: '6px 16px', borderRadius: 9999, background: 'var(--inset)',
      border: '1px solid var(--hairline-dark)',
    }}>
      <span style={{ font: 'var(--caption)', color: 'var(--fg-1)', fontWeight: 600 }}>{label}</span>
    </div>
  );
}

/* small info text shown when (i) is tapped — about the flame you're viewing */
const FLAME_INFO = {
  pristine: '사용을 가장 잘 절제한 날의 불씨예요. 가장 크고 푸르게, 고요하게 타올라요.',
  steady:   '안정적으로 조절하고 있어요. 청록빛으로 잔잔하게 빛나요.',
  flicker:  '평소만큼 쓴 보통의 날이에요. 골드빛으로 부드럽게 일렁여요.',
  windy:    '조금 많이 썼어요. 불꽃이 바람에 흔들리기 시작해요.',
  storm:    '사용이 많았던 날이에요. 거센 바람에 불꽃이 휘청여요.',
};
const FLAME_GRADE = ['과다', '주의', '보통', '양호', '최상']; // by HERO_META order (storm…pristine)

function FlameCarousel({ score, onInfo }) {
  const curIdx = HERO_META.findIndex(m => m.key === flameStateFor(score).key);
  const [idx, setIdx] = React.useState(curIdx < 0 ? 1 : curIdx);
  const [info, setInfo] = React.useState(false);
  const down = React.useRef(null);
  const flameRef = React.useRef(null);
  const go = (i) => setIdx(Math.max(0, Math.min(HERO_META.length - 1, i)));

  // tap the flame → it surges & wobbles (restart the animation cleanly)
  const flare = () => {
    const el = flameRef.current;
    if (!el) return;
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = 'flameFlare .66s cubic-bezier(.36,.07,.19,.97)';
  };

  const st = flameStateFor(HERO_META[idx].sample);
  const caption = st.desc;

  return (
    <div style={{ position: 'relative' }}>
      {/* (i) — toggles a small info popover about the flame you're viewing */}
      <button onClick={() => setInfo(v => !v)} aria-label="이 불씨 설명" style={{
        position: 'absolute', top: 0, right: 4, background: info ? 'var(--ember-tint-10)' : 'none',
        border: 'none', cursor: 'pointer', borderRadius: 9999,
        color: info ? 'var(--ember)' : 'var(--fg-3)', padding: 4, display: 'flex', zIndex: 8,
      }}>
        <I.info size={22} stroke={1.9} />
      </button>

      {info && (
        <div onClick={() => setInfo(false)} style={{
          position: 'absolute', top: 34, right: 4, zIndex: 9, width: 234, maxWidth: '80%',
          background: 'var(--surface-1)', borderRadius: 14, padding: '12px 14px', cursor: 'pointer',
          boxShadow: 'var(--shadow-pop)', border: '1px solid var(--hairline-dark)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ font: 'var(--body-strong)', color: 'var(--fg-1)' }}>{st.label}</span>
            <span style={{ font: 'var(--overline)', letterSpacing: '0.06em', color: 'var(--fg-3)' }}>{FLAME_GRADE[idx]}</span>
          </div>
          <div style={{ font: 'var(--caption)', color: 'var(--fg-2)', marginTop: 5, lineHeight: 1.5, textWrap: 'pretty' }}>
            {FLAME_INFO[HERO_META[idx].key]}
          </div>
        </div>
      )}

      {/* stage */}
      <div
        onPointerDown={(e) => { down.current = e.clientX; }}
        onPointerUp={(e) => { if (down.current == null) return; const dx = e.clientX - down.current; down.current = null; if (dx > 40) go(idx - 1); else if (dx < -40) go(idx + 1); }}
        style={{ position: 'relative', height: 268, marginTop: 4, touchAction: 'pan-y', userSelect: 'none' }}>
        {/* return to my current flame — shown when viewing another */}
        {idx !== curIdx && (
          <button onClick={() => { go(curIdx); setInfo(false); }} style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', zIndex: 7,
            display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
            background: 'var(--ember)', color: 'var(--on-ember)', border: 'none', cursor: 'pointer',
            padding: '7px 14px', borderRadius: 9999, font: 'var(--caption)', fontWeight: 700,
            boxShadow: '0 4px 12px -2px rgba(232,111,53,0.5)',
          }}>
            <I.flame size={13} />지금 내 불씨
          </button>
        )}
        {/* left peek */}
        {idx > 0 && (
          <button onClick={() => go(idx - 1)} aria-label="이전 불씨" style={{ position: 'absolute', left: -34, bottom: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <FlamePillar score={HERO_META[idx - 1].sample} size={92} dim />
          </button>
        )}
        {/* right peek */}
        {idx < HERO_META.length - 1 && (
          <button onClick={() => go(idx + 1)} aria-label="다음 불씨" style={{ position: 'absolute', right: -34, bottom: 0, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <FlamePillar score={HERO_META[idx + 1].sample} size={92} dim />
          </button>
        )}
        {/* center */}
        <button onClick={flare} aria-label="불씨 톡톡" style={{
          position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)',
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          <FlamePillar score={HERO_META[idx].sample} size={158} flareRef={flameRef} />
        </button>
      </div>

      {/* caption */}
      <div style={{ textAlign: 'center', marginTop: 14, font: 'var(--body)', color: 'var(--fg-2)' }}>{caption}</div>

      {/* dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
        {HERO_META.map((_, i) => (
          <button key={i} onClick={() => go(i)} aria-label={`불씨 ${i + 1}`} style={{
            width: idx === i ? 18 : 6, height: 6, borderRadius: 9999, cursor: 'pointer', border: 'none',
            background: idx === i ? 'var(--ember)' : 'var(--track)', transition: 'all .2s', padding: 0,
          }} />
        ))}
      </div>
    </div>
  );
}

function HeroStats({ onScreenTime, onApps, onFocusScore }) {
  return (
    <div style={{ marginTop: 22, display: 'flex' }}>
      <StatCol label="집중">
        <button onClick={onFocusScore} aria-label="집중도 상세" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 2, color: 'var(--fg-1)' }}>
          <span style={{ font: '700 22px/1 var(--font-num)' }}>87%</span>
          <I.chevR size={16} stroke={2.2} style={{ color: 'var(--fg-3)' }} />
        </button>
      </StatCol>
      <div style={{ width: 1, background: 'var(--hairline-dark)' }} />
      <StatCol label="스크린타임">
        <button onClick={onScreenTime} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 2, color: 'var(--fg-1)' }}>
          <span style={{ font: '700 21px/1 var(--font-num)', whiteSpace: 'nowrap' }}>2h 48m</span>
          <I.chevR size={17} stroke={2.2} style={{ color: 'var(--fg-3)' }} />
        </button>
      </StatCol>
      <div style={{ width: 1, background: 'var(--hairline-dark)' }} />
      <StatCol label="최다 사용 앱">
        <button onClick={onApps} aria-label="최다 사용 앱 상세" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          {CULPRITS.map(b => (
            <AppIcon key={b} slug={b} bg={APP_BRANDS[b].bg} fg={APP_BRANDS[b].fg} size={24} radius={7} glyph={0.6} />
          ))}
          <I.chevR size={15} stroke={2.2} style={{ color: 'var(--fg-3)', marginLeft: 1 }} />
        </button>
      </StatCol>
    </div>
  );
}

function StatCol({ label, children }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9 }}>
      <span style={{ font: 'var(--overline)', letterSpacing: '0.06em', color: 'var(--fg-3)' }}>{label}</span>
      <div style={{ height: 24, display: 'flex', alignItems: 'center' }}>{children}</div>
    </div>
  );
}

/* today vs last week — opened from 스크린타임 › */
function UsageReportSheet({ onClose }) {
  const max = Math.max(...H_THIS, ...H_LAST);
  const avgT = Math.round(H_THIS.reduce((a, b) => a + b, 0) / 7);
  const avgL = Math.round(H_LAST.reduce((a, b) => a + b, 0) / 7);
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 120, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', backdropFilter: 'blur(2px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: 'var(--surface-1)', borderRadius: 28, padding: '24px 22px 32px', boxShadow: 'var(--shadow-pop)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ font: 'var(--h1)', color: 'var(--fg-1)' }}>오늘 사용 리포트</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-2)', padding: 4, lineHeight: 1, flexShrink: 0 }}><I.plus size={24} stroke={1.8} style={{ transform: 'rotate(45deg)', display: 'block' }} /></button>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
          <span style={{ font: '700 28px/1 var(--font-num)', color: 'var(--ember)', whiteSpace: 'nowrap' }}>{hFmt(H_THIS[6])}</span>
          <span style={{ font: 'var(--caption)', color: 'var(--positive)', display: 'inline-flex', alignItems: 'center', gap: 1 }}>
            <I.arrowDown size={13} stroke={2.4} />18%
          </span>
        </div>

        {/* grouped bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', height: 110, marginTop: 22 }}>
          {H_WEEK.map((d, i) => {
            const today = i === 6;
            return (
              <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: '100%' }}>
                  <div style={{ width: 8, height: `${(H_LAST[i] / max) * 100}%`, borderRadius: 4, background: 'var(--track)' }} />
                  <div style={{ width: 8, height: `${(H_THIS[i] / max) * 100}%`, borderRadius: 4, background: today ? 'var(--ember)' : 'var(--ember-soft)' }} />
                </div>
                <span style={{ font: '500 11px/1 var(--font-sans)', color: today ? 'var(--ember)' : 'var(--fg-3)', marginTop: 8 }}>{d}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 14, justifyContent: 'center' }}>
          <HLegend color="var(--ember)" label="이번 주" />
          <HLegend color="var(--track)" label="지난주" />
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 20, padding: 16, background: 'var(--inset)', borderRadius: 16 }}>
          <I.arrowDown size={16} stroke={2.4} style={{ color: 'var(--positive)', flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ font: 'var(--body)', color: 'var(--fg-2)', textWrap: 'pretty' }}>
              지난주보다 하루 평균 <strong style={{ color: 'var(--fg-1)' }}>{avgL - avgT}분</strong> 줄였어요. 특히 여기서 줄였어요 —
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 10 }}>
              {H_REDUCED.map(r => (
                <span key={r.t} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, font: 'var(--caption)', color: 'var(--fg-1)', background: 'var(--card-dark)', padding: '6px 11px', borderRadius: 9999 }}>
                  {r.t}<span style={{ color: 'var(--positive)', font: '600 12px/1 var(--font-num)' }}>−{r.d}분</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HLegend({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 9, height: 9, borderRadius: 3, background: color }} />
      <span style={{ font: 'var(--caption)', color: 'var(--fg-2)' }}>{label}</span>
    </div>
  );
}

function HomeHero({ score = 72, onInfo, onScreenTime, onApps, onFocusScore }) {
  return (
    <div style={{ marginTop: 6 }}>
      <FlameCarousel score={score} onInfo={onInfo} />
      <HeroStats onScreenTime={onScreenTime} onApps={onApps} onFocusScore={onFocusScore} />
    </div>
  );
}

/* 집중도 87% — how the focus score was reached */
const FOCUS_FACTORS = [
  { icon: 'flame', label: '집중 모드', value: '2시간 10분', sub: '오늘 3회 완료', pct: 92 },
  { icon: 'check', label: '넛지에 응답', value: '6 / 8건', sub: '권유에 잘 따랐어요', pct: 75 },
  { icon: 'clock', label: '가장 긴 몰입', value: '1시간 24분', sub: '끊김 없이 이어졌어요', pct: 80 },
];

function FocusDetailSheet({ onClose }) {
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 120, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', backdropFilter: 'blur(2px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: 'var(--surface-1)', borderRadius: 28, padding: '24px 22px 32px', boxShadow: 'var(--shadow-pop)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ font: 'var(--h1)', color: 'var(--fg-1)' }}>집중</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-2)', padding: 4, lineHeight: 1, flexShrink: 0 }}><I.plus size={24} stroke={1.8} style={{ transform: 'rotate(45deg)', display: 'block' }} /></button>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
          <span style={{ font: '700 28px/1 var(--font-num)', color: 'var(--ember)' }}>87%</span>
          <span style={{ font: 'var(--caption)', color: 'var(--positive)', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            <I.arrowDown size={13} stroke={2.4} style={{ transform: 'rotate(180deg)' }} />어제보다 6%p
          </span>
        </div>
        <p style={{ margin: '10px 0 0', font: 'var(--body)', color: 'var(--fg-2)', textWrap: 'pretty' }}>
          방해받지 않고 화면에 몰입한 정도예요.<br />이렇게 채워졌어요.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 22 }}>
          {FOCUS_FACTORS.map(f => (
            <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <div style={{ color: 'var(--ember)', flexShrink: 0 }}>{I[f.icon]({ size: 18, stroke: 1.9 })}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ font: 'var(--body-strong)', color: 'var(--fg-1)' }}>{f.label}</span>
                  <span style={{ font: '600 14px/1 var(--font-num)', color: 'var(--fg-1)', whiteSpace: 'nowrap' }}>{f.value}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <div style={{ flex: 1, height: 6, borderRadius: 9999, background: 'var(--track)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${f.pct}%`, borderRadius: 9999, background: 'var(--ember)' }} />
                  </div>
                </div>
                <div style={{ font: 'var(--caption)', color: 'var(--fg-2)', marginTop: 5 }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 최다 사용 앱 — today's per-app usage times */
function AppUsageSheet({ onClose }) {
  const total = TODAY_APPS.reduce((a, b) => a + b.min, 0);
  const maxApp = Math.max(...TODAY_APPS.map(a => a.min));
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 120, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', backdropFilter: 'blur(2px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: 'var(--surface-1)', borderRadius: 28, padding: '24px 22px 32px', boxShadow: 'var(--shadow-pop)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ font: 'var(--h1)', color: 'var(--fg-1)' }}>최다 사용 앱</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-2)', padding: 4, lineHeight: 1, flexShrink: 0 }}><I.plus size={24} stroke={1.8} style={{ transform: 'rotate(45deg)', display: 'block' }} /></button>
        </div>
        <div style={{ font: 'var(--caption)', color: 'var(--fg-2)', marginTop: 6 }}>오늘 · 총 {hFmt(total)}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
          {TODAY_APPS.map(a => (
            <div key={a.brand} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AppIcon slug={a.brand} bg={APP_BRANDS[a.brand].bg} fg={APP_BRANDS[a.brand].fg} size={40} radius={11} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ font: 'var(--body-strong)', color: 'var(--fg-1)' }}>{a.name}</span>
                  <span style={{ font: '600 13px/1 var(--font-num)', color: 'var(--fg-2)', whiteSpace: 'nowrap' }}>{hFmt(a.min)}</span>
                </div>
                <div style={{ height: 6, borderRadius: 9999, background: 'var(--track)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(a.min / maxApp) * 100}%`, borderRadius: 9999, background: 'var(--ember)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeHero, UsageReportSheet, AppUsageSheet, FocusDetailSheet });
