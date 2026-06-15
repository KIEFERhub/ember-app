/* Ember — 기분 달력 (overlay screen).
   A month calendar of logged moods. Each day shows the mood emoji over a
   small flame whose color reflects that day's restraint score, so emotion
   and screen-time health read together at a glance. */

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/* deterministic mock month — maps a day index to a mood (or none) */
function buildMonth(year, month) {
  const first = new Date(year, month, 1);
  const startDow = first.getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= days; d++) {
    const date = new Date(year, month, d);
    const future = date > today;
    // pseudo-random but stable: skip a few days as "unlogged"
    const seed = (d * 7 + month * 3) % 10;
    const logged = !future && seed !== 2 && seed !== 5;
    const mood = logged ? MOODS[(d * 3 + month) % MOODS.length] : null;
    cells.push({ d, mood, future, today: date.toDateString() === today.toDateString() });
  }
  return cells;
}

function MoodScreen({ onBack }) {
  const now = new Date();
  const [ym, setYm] = React.useState({ y: now.getFullYear(), m: now.getMonth() });
  const [sel, setSel] = React.useState(null);
  const cells = buildMonth(ym.y, ym.m);

  // distribution for the summary strip
  const logged = cells.filter(c => c && c.mood);
  const counts = MOODS.map(m => ({ ...m, n: logged.filter(c => c.mood.k === m.k).length }));
  const top = counts.slice().sort((a, b) => b.n - a.n)[0];

  const shift = dir => setYm(s => {
    let m = s.m + dir, y = s.y;
    if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; }
    return { y, m };
  });
  const isThisMonth = ym.y === now.getFullYear() && ym.m === now.getMonth();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <SubHeader title="기분 달력" onBack={onBack} />
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <div style={{ padding: '4px 20px 28px' }}>

          {/* month switcher */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <button onClick={() => shift(-1)} style={navBtn}><Icon d="M15 5l-7 7 7 7" size={20} stroke={2.2} /></button>
            <div style={{ font: 'var(--h2)', color: 'var(--fg-1)' }}>{ym.y}년 {ym.m + 1}월</div>
            <button onClick={() => shift(1)} disabled={isThisMonth}
              style={{ ...navBtn, opacity: isThisMonth ? 0.3 : 1, cursor: isThisMonth ? 'default' : 'pointer' }}>
              <Icon d="M9 5l7 7-7 7" size={20} stroke={2.2} />
            </button>
          </div>

          {/* summary */}
          <Card tone="cream" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }} pad={16}>
            <span style={{ fontSize: 34, lineHeight: 1 }}>{top.e}</span>
            <div style={{ flex: 1 }}>
              <div style={{ font: 'var(--body-strong)', color: 'var(--ink)' }}>이번 달은 '{top.t}'이 가장 많았어요</div>
              <div style={{ font: 'var(--caption)', color: 'var(--ink-2)', marginTop: 2 }}>{logged.length}일 기록 · 마음과 불씨를 함께 살펴봐요</div>
            </div>
          </Card>

          {/* weekday header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, marginBottom: 8 }}>
            {WEEKDAYS.map((w, i) => (
              <div key={w} style={{ textAlign: 'center', font: 'var(--caption)', color: i === 0 ? 'var(--ember)' : 'var(--fg-3)' }}>{w}</div>
            ))}
          </div>

          {/* day grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
            {cells.map((c, i) => {
              if (!c) return <div key={i} />;
              const active = sel === c.d;
              const fc = c.mood ? flameStateFor(c.mood.score).mid : null;
              return (
                <button key={i} onClick={() => c.mood && setSel(active ? null : c.d)} style={{
                  aspectRatio: '1', borderRadius: 12, cursor: c.mood ? 'pointer' : 'default',
                  border: active ? '1px solid var(--ember)' : '1px solid transparent',
                  background: c.today ? 'var(--inset-2)' : 'transparent',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
                  padding: 2, position: 'relative', transition: 'all .12s',
                }}>
                  <span style={{ position: 'absolute', top: 4, left: 6, font: '600 10px/1 var(--font-num)', color: c.future ? 'var(--fg-3)' : 'var(--fg-2)' }}>{c.d}</span>
                  {c.mood ? (
                    <>
                      <span style={{ fontSize: 17, lineHeight: 1, marginTop: 6 }}>{c.mood.e}</span>
                      <I.flame size={11} style={{ color: fc }} />
                    </>
                  ) : (
                    <span style={{ width: 5, height: 5, borderRadius: 9999, background: 'var(--flame-0)', marginTop: 8 }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* selected-day detail */}
          {sel && (() => {
            const c = cells.find(x => x && x.d === sel);
            const fs = flameStateFor(c.mood.score);
            return (
              <Card tone="dark" style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 36, lineHeight: 1 }}>{c.mood.e}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ font: 'var(--body-strong)', color: 'var(--fg-1)' }}>{ym.m + 1}월 {c.d}일 · {c.mood.t}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, font: 'var(--caption)', color: 'var(--fg-2)', marginTop: 4 }}>
                    <I.flame size={13} style={{ color: fs.mid }} />불씨 상태 · {fs.label}
                  </div>
                </div>
              </Card>
            );
          })()}

          {/* legend */}
          <div style={{ font: 'var(--overline)', letterSpacing: '0.06em', color: 'var(--fg-3)', margin: '24px 4px 12px' }}>기분 종류</div>
          <Card tone="deep" pad={16}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
              {counts.map(m => (
                <div key={m.k} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 20, lineHeight: 1 }}>{m.e}</span>
                  <span style={{ font: 'var(--caption)', color: 'var(--fg-2)' }}>{m.t}</span>
                  <span style={{ font: '600 12px/1 var(--font-num)', color: 'var(--fg-3)' }}>{m.n}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

const navBtn = {
  width: 38, height: 38, borderRadius: 9999, border: '1px solid var(--hairline-dark)',
  background: 'transparent', color: 'var(--fg-1)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

Object.assign(window, { MoodScreen });
