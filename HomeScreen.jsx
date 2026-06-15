/* Ember — HOME tab. Flame state hero + nudge summary + mood + focus mode. */

/* shared mood model — emoji + label + flame tone, reused by MoodScreen */
const MOODS = [
  { k: 'great', e: '😄', t: '활기참', score: 90 },
  { k: 'calm',  e: '😌', t: '평온함', score: 74 },
  { k: 'meh',   e: '😐', t: '무난해요', score: 55 },
  { k: 'tired', e: '😮‍💨', t: '피곤함', score: 38 },
  { k: 'down',  e: '😣', t: '답답함', score: 20 },
];

function HomeScreen({ onNavigate, onOpenFocus, onOpenUsage, onOpenApps, onOpenFocusScore, score = 72 }) {
  const [mood, setMood] = React.useState(null);
  const st = flameStateFor(score);

  return (
    <ScreenScroll>
      {/* ── Flame state hero (swipeable: flame ↔ usage report) ── */}
      <HomeHero score={score} onInfo={() => onNavigate('flames')} onScreenTime={onOpenUsage} onApps={onOpenApps} onFocusScore={onOpenFocusScore} />

      {/* ── AI insight (cream insert) — links to report ── */}
      <Card tone="cream" style={{ marginTop: 34 }}>
        <div style={{ position: 'absolute', right: -40, bottom: -40, width: 150, height: 150, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(232,111,53,0.24), rgba(232,111,53,0.03))' }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <I.sparkle size={16} stroke={1.8} style={{ color: 'var(--ember)' }} />
            <span style={{ font: 'var(--overline)', color: 'var(--ember)', letterSpacing: '0.04em' }}>AI 인사이트</span>
          </div>
          <button onClick={() => onNavigate('report')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 2, font: 'var(--label)', color: 'var(--ink-2)', padding: 0, letterSpacing: '-0.02em' }}>상세보기 <I.chevR size={14} stroke={2.2} /></button>
        </div>
        <p style={{ margin: 0, font: '600 18px/25px var(--font-sans)', color: 'var(--ink)' }}>
          "스트레스 받을 때 숏폼 시청이<br />늘어나는 경향이 있어요."
        </p>
        <p style={{ margin: '10px 0 0', font: 'var(--body)', color: 'var(--ink-2)' }}>
          불씨가 사그라들면 잠시 휴식하는 건 어떨까요?
        </p>
      </Card>

      {/* ── Today's nudge summary ── */}
      <Card tone="deep" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <span style={{ font: 'var(--h3)', color: 'var(--fg-1)', whiteSpace: 'nowrap' }}>오늘의 넛지</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ font: '700 30px/36px var(--font-num)', color: 'var(--fg-1)' }}>12</div>
            <div style={{ font: 'var(--caption)', color: 'var(--fg-2)', marginTop: 4 }}>전체 발생</div>
          </div>
          <div style={{ display: 'flex', gap: 22 }}>
            {[['8', '수락', 'var(--ember)'], ['3', '지연', 'var(--fg-1)'], ['1', '무시', 'var(--fg-2)']].map(([n, l, c]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ font: '700 20px/24px var(--font-num)', color: c }}>{n}</div>
                <div style={{ font: 'var(--caption)', color: 'var(--fg-2)', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Mood log ── */}
      <Card tone="deep" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ font: 'var(--h3)', color: 'var(--fg-1)' }}>지금 기분이 어떠신가요?</div>
            <div style={{ font: 'var(--caption)', color: 'var(--fg-2)', marginTop: 4, textWrap: 'pretty' }}>
              오늘의 기분을 하나 골라 기록해요. 달력에서 한 달의 마음을 불씨와 함께 돌아볼 수 있어요.
            </div>
          </div>
          <button onClick={() => onNavigate('mood')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 2, font: 'var(--label)', color: 'var(--fg-2)', padding: 0, flexShrink: 0, letterSpacing: '-0.02em' }}>달력 보기 <I.chevR size={14} stroke={2.2} /></button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {MOODS.map(m => (
            <button key={m.k} onClick={() => { setMood(m.k); onNavigate('mood'); }} style={{
              flex: 1, padding: '12px 2px 10px', borderRadius: 14, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              border: mood === m.k ? '1px solid var(--ember)' : '1px solid var(--hairline-dark)',
              background: mood === m.k ? 'var(--ember-tint-10)' : 'transparent',
              color: mood === m.k ? 'var(--ember)' : 'var(--fg-2)', font: 'var(--caption)',
              transition: 'all .15s',
            }}>
              <span style={{ fontSize: 24, lineHeight: 1 }}>{m.e}</span>
              <span>{m.t}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* ── Routine gallery ── */}
      <RoutineGallery onOpenFocus={onOpenFocus} />
    </ScreenScroll>
  );
}

/* shared scroll wrapper for screens */
function ScreenScroll({ children }) {
  return (
    <div style={{ height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch', background: 'var(--bg)' }}>
      <div style={{ padding: '4px 20px 92px' }}>{children}</div>
    </div>
  );
}

/* custom range slider styled to brand */
function EmberSlider({ min, max, step, value, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{
        width: '100%', height: 8, borderRadius: 9999, appearance: 'none', WebkitAppearance: 'none',
        background: `linear-gradient(to right, var(--ember) ${pct}%, var(--toggle-off) ${pct}%)`,
        cursor: 'pointer', outline: 'none',
      }}
      className="ember-range" />
  );
}

Object.assign(window, { HomeScreen, ScreenScroll, EmberSlider, MOODS });
