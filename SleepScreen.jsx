/* Ember — SLEEP tab. Routine ring + sleep nudge + app block + last-night log.
   Adds an optional weekly sleep view (separate entry, keeps main light). */

const WEEK_SLEEP = [
  { d: '월', dur: 7.5, bed: '22:30', wake: '06:00', grade: 'A',  q: 4 },
  { d: '화', dur: 6.8, bed: '23:10', wake: '06:00', grade: 'B',  q: 3 },
  { d: '수', dur: 7.2, bed: '22:50', wake: '06:05', grade: 'A',  q: 4 },
  { d: '목', dur: 5.9, bed: '00:05', wake: '06:00', grade: 'C',  q: 2 },
  { d: '금', dur: 7.0, bed: '23:00', wake: '06:00', grade: 'B',  q: 3 },
  { d: '토', dur: 8.4, bed: '23:40', wake: '08:05', grade: 'A',  q: 5 },
  { d: '일', dur: 7.6, bed: '22:25', wake: '06:00', grade: 'A',  q: 4 },
];
const QUALITY_COLOR = ['var(--flame-0)', '#8A3A1F', '#C7502A', '#F0A23E', '#F4C76B', '#F7E3A8'];

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINS  = Array.from({ length: 12 }, (_, i) => i * 5);
const fmt2  = v => String(v).padStart(2, '0');
const ITEM_H = 44;

/* iOS-style drum scroll column */
function DrumColumn({ values, selected, onSelect, format = fmt2 }) {
  const ref = React.useRef();
  const settling = React.useRef(false);

  React.useLayoutEffect(() => {
    const idx = values.indexOf(selected);
    if (ref.current && idx >= 0) {
      ref.current.scrollTop = idx * ITEM_H;
    }
  }, []);

  const handleScroll = () => {
    if (!ref.current || settling.current) return;
    clearTimeout(ref.current.__t);
    ref.current.__t = setTimeout(() => {
      const idx = Math.round(ref.current.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(values.length - 1, idx));
      settling.current = true;
      ref.current.scrollTo({ top: clamped * ITEM_H, behavior: 'smooth' });
      onSelect(values[clamped]);
      setTimeout(() => { settling.current = false; }, 200);
    }, 80);
  };

  return (
    <div style={{ position: 'relative', width: 72, height: ITEM_H * 3 }}>
      {/* selection highlight */}
      <div style={{
        position: 'absolute', top: ITEM_H, left: 0, right: 0, height: ITEM_H,
        background: 'var(--inset-strong)', borderRadius: 12, pointerEvents: 'none', zIndex: 1,
      }} />
      <div ref={ref} onScroll={handleScroll} style={{
        height: ITEM_H * 3, overflowY: 'scroll', scrollSnapType: 'y mandatory',
        scrollbarWidth: 'none', position: 'relative', zIndex: 2,
      }}>
        <style>{`.drum-hide-scroll::-webkit-scrollbar{display:none}`}</style>
        <div className="drum-hide-scroll" style={{ height: ITEM_H }} />
        {values.map(v => (
          <div key={v} onClick={() => {
            const idx = values.indexOf(v);
            ref.current.scrollTo({ top: idx * ITEM_H, behavior: 'smooth' });
            onSelect(v);
          }} style={{
            height: ITEM_H, scrollSnapAlign: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            font: v === selected ? '700 26px/1 var(--font-num)' : '400 20px/1 var(--font-num)',
            color: v === selected ? 'var(--fg-1)' : 'var(--fg-3)',
            cursor: 'pointer', userSelect: 'none', letterSpacing: '-0.03em',
            transition: 'color .12s, font-size .12s',
          }}>{format(v)}</div>
        ))}
        <div style={{ height: ITEM_H }} />
      </div>
    </div>
  );
}

/* Time picker bottom sheet */
function TimePickerSheet({ label, hour, min, onConfirm, onClose }) {
  const [h, setH] = React.useState(hour);
  const [m, setM] = React.useState(min);
  const isPm = h >= 12;
  const disp12 = h === 0 ? 12 : h > 12 ? h - 12 : h;

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 110, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(2px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: 'var(--surface-1)', borderRadius: '28px 28px 0 0',
        padding: '14px 24px 40px', boxShadow: 'var(--shadow-pop)',
      }}>
        <div style={{ width: 40, height: 5, borderRadius: 9999, background: 'var(--hairline-dark)', margin: '0 auto 20px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ font: 'var(--h1)', color: 'var(--fg-1)', letterSpacing: '-0.03em' }}>{label}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-2)', padding: 4 }}>
            <I.plus size={24} stroke={1.8} style={{ transform: 'rotate(45deg)', display: 'block' }} />
          </button>
        </div>

        {/* Drum columns */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 28 }}>
          <DrumColumn values={HOURS} selected={h} onSelect={setH} format={v => fmt2(v === 0 ? 12 : v > 12 ? v - 12 : v)} />
          <span style={{ font: '700 26px/1 var(--font-num)', color: 'var(--fg-1)', marginBottom: 2 }}>:</span>
          <DrumColumn values={MINS}  selected={m} onSelect={setM} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginLeft: 8 }}>
            {['오전','오후'].map(ap => (
              <button key={ap} onClick={() => {
                const wantPm = ap === '오후';
                if (wantPm && h < 12) setH(h + 12);
                if (!wantPm && h >= 12) setH(h - 12);
              }} style={{
                background: (ap === '오후') === isPm ? 'var(--ember)' : 'var(--inset)',
                color: (ap === '오후') === isPm ? '#fff' : 'var(--fg-2)',
                border: 'none', borderRadius: 10, padding: '10px 14px',
                font: 'var(--label)', cursor: 'pointer', letterSpacing: '-0.02em',
                transition: 'all .15s',
              }}>{ap}</button>
            ))}
          </div>
        </div>

        <Button variant="primary" size="lg" full onClick={() => { onConfirm(h, m); onClose(); }}>
          확인
        </Button>
      </div>
    </div>
  );
}

function SleepScreen() {
  const [nudge, setNudge] = React.useState(true);
  const [weekly, setWeekly] = React.useState(false);
  const [apps, setApps] = React.useState({ youtube: true, instagram: true, game: false });
  const [picking, setPicking] = React.useState(null); // null | 'bed' | 'wake'
  const [bedH, setBedH] = React.useState(22);
  const [bedM, setBedM] = React.useState(30);
  const [wakeH, setWakeH] = React.useState(6);
  const [wakeM, setWakeM] = React.useState(0);

  // compute sleep duration + ring arc
  const bedMins  = bedH  * 60 + bedM;
  const wakeMins = wakeH * 60 + wakeM;
  const sleepMins = ((wakeMins - bedMins) + 1440) % 1440;
  const sleepHStr = `${Math.floor(sleepMins / 60)}시간 ${sleepMins % 60 > 0 ? (sleepMins % 60) + '분' : ''}`.trim();
  const R = 90, C = 2 * Math.PI * R;
  const portion = sleepMins / 1440;

  const fmtDisp = (h, m) => {
    const ap = h < 12 ? '오전' : '오후';
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${ap} ${h12}:${fmt2(m)}`;
  };

  return (
    <ScreenScroll>
      {/* Routine hero */}
      <Card tone="cream" style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ font: 'var(--h1)', color: 'var(--ink)', whiteSpace: 'nowrap' }}>수면 루틴</div>
            <div style={{ font: 'var(--body)', color: 'var(--ink-2)', marginTop: 4, maxWidth: 180 }}>규칙적인 수면은 불씨를 회복시켜요.</div>
          </div>
          <span style={{ font: 'var(--label)', color: 'var(--ember)', background: 'rgba(232,111,53,0.12)', padding: '8px 14px', borderRadius: 9999, whiteSpace: 'nowrap', flexShrink: 0 }}>{sleepHStr}</span>
        </div>

        {/* ring */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 18px' }}>
          <div style={{ position: 'relative', width: 220, height: 220 }}>
            <svg width="220" height="220" viewBox="0 0 220 220" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="110" cy="110" r={R} fill="none" stroke="rgba(87,66,57,0.14)" strokeWidth="14" />
              <circle cx="110" cy="110" r={R} fill="none" stroke="var(--ember)" strokeWidth="14" strokeLinecap="round"
                strokeDasharray={`${C * portion} ${C}`} style={{ transition: 'stroke-dasharray .4s ease' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <I.moon size={26} style={{ color: 'var(--ember)', marginBottom: 6 }} />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ font: '700 28px/1 var(--font-num)', color: 'var(--ink)', letterSpacing: '-0.04em' }}>{fmt2(bedH)}:{fmt2(bedM)}</span>
                <span style={{ font: 'var(--caption)', color: 'var(--ink-2)' }}>취침</span>
              </div>
              <div style={{ width: 40, height: 1, background: 'var(--hairline-dark)', margin: '10px 0' }} />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ font: '700 28px/1 var(--font-num)', color: 'var(--ink)', letterSpacing: '-0.04em' }}>{fmt2(wakeH)}:{fmt2(wakeM)}</span>
                <span style={{ font: 'var(--caption)', color: 'var(--ink-2)' }}>기상</span>
              </div>
            </div>
          </div>
        </div>

        {/* time pickers — tappable */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { key: 'bed',  label: '취침 시간', icon: <I.moon size={16} />, val: fmtDisp(bedH, bedM) },
            { key: 'wake', label: '기상 시간', icon: <I.sun  size={16} />, val: fmtDisp(wakeH, wakeM) },
          ].map(({ key, label, icon, val }) => (
            <button key={key} onClick={() => setPicking(key)} style={{
              flex: 1, background: 'var(--inset)', borderRadius: 16, padding: 14,
              border: picking === key ? '1.5px solid var(--ember)' : '1.5px solid transparent',
              cursor: 'pointer', textAlign: 'left', transition: 'border-color .15s',
            }}>
              <div style={{ font: 'var(--caption)', color: 'var(--ink-2)', marginBottom: 8 }}>{label}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--ember)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: 'var(--body-strong)', color: 'var(--ink)' }}>{icon}{val}</span>
                <I.chevD size={16} style={{ color: 'var(--ink-2)' }} />
              </div>
            </button>
          ))}
        </div>

        <Button variant="ghostCream" size="md" full style={{ marginTop: 14 }} icon={<I.calendar size={18} />}
          onClick={() => setWeekly(true)}>주간 수면 기록 보기</Button>
      </Card>

      {/* Sleep nudge */}
      <Card tone="dark" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <I.bell size={20} stroke={1.9} style={{ color: 'var(--ember)' }} />
          <Toggle on={nudge} onChange={setNudge} />
        </div>
        <div style={{ font: 'var(--h2)', color: 'var(--fg-1)', marginTop: 16 }}>수면 넛지</div>
        <div style={{ font: 'var(--body)', color: 'var(--fg-2)', marginTop: 4 }}>취침 30분 전 루틴 시작을 알려드려요.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, color: 'var(--ember)', font: 'var(--body-strong)' }}>
          <I.clock size={17} stroke={1.9} />{fmtDisp(bedH > 0 ? bedH - (bedM >= 30 ? 0 : 1) : 23, (bedM + 30) % 60 === bedM ? bedM : (bedM >= 30 ? bedM - 30 : bedM + 30))}에 알림
        </div>
      </Card>

      {/* App block */}
      <Card tone="dark" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ font: 'var(--h2)', color: 'var(--fg-1)', whiteSpace: 'nowrap' }}>앱 차단</span>
          <Button variant="tertiary" size="sm">관리</Button>
        </div>
        <div style={{ font: 'var(--body)', color: 'var(--fg-2)', marginBottom: 18 }}>수면 중 방해되는 앱을 잠재워요.</div>
        <div style={{ display: 'flex', gap: 14 }}>
          {[
            { k: 'youtube', t: '유튜브', brand: 'youtube' },
            { k: 'instagram', t: '인스타그램', brand: 'instagram' },
            { k: 'game', t: '게임', icon: <I.gamepad size={24} stroke={1.9} /> },
          ].map(a => {
            const on = apps[a.k];
            return (
              <button key={a.k} onClick={() => setApps(s => ({ ...s, [a.k]: !s[a.k] }))} style={{
                flex: 1, background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              }}>
                {a.brand ? (
                  <AppIcon slug={a.brand} bg={APP_BRANDS[a.brand].bg} fg={APP_BRANDS[a.brand].fg} size={56} radius={16}
                    style={{
                      filter: on ? 'none' : 'grayscale(1)', opacity: on ? 1 : 0.45,
                      outline: on ? '2px solid var(--ember)' : '2px solid transparent', outlineOffset: 2,
                      transition: 'all .15s',
                    }} />
                ) : (
                  <div style={{
                    width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: on ? '1.5px solid var(--ember)' : '1.5px solid var(--hairline-dark)',
                    background: on ? 'var(--ember-tint-10)' : 'transparent',
                    color: on ? 'var(--ember)' : 'var(--fg-3)',
                  }}>{a.icon}</div>
                )}
                <span style={{ font: 'var(--caption)', color: on ? 'var(--fg-1)' : 'var(--fg-3)' }}>{a.t}</span>
              </button>
            );
          })}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, border: '1.5px dashed var(--hairline-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-2)' }}>
              <I.plus size={22} />
            </div>
            <span style={{ font: 'var(--caption)', color: 'var(--fg-2)' }}>추가</span>
          </div>
        </div>
      </Card>

      {/* Last night log */}
      <Card tone="dark" style={{ marginTop: 16, marginBottom: 8 }}>
        <div style={{ font: 'var(--h2)', color: 'var(--fg-1)', marginBottom: 18 }}>어젯밤의 기록</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {[
            ['오후 10:00', '수면 넛지 수락됨', true],
            ['오후 10:32', '앱 차단 모드 활성화', false],
            ['오전 06:01', '기상 알림 해제', false],
            ['오전 06:05', '수면 품질 측정 완료', true],
          ].map(([t, l, hot], i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <span style={{ width: 9, height: 9, borderRadius: 9999, marginTop: 5, background: hot ? 'var(--ember)' : 'var(--fg-3)', flexShrink: 0 }} />
              <div>
                <div style={{ font: 'var(--caption)', color: 'var(--fg-2)' }}>{t}</div>
                <div style={{ font: 'var(--body-strong)', color: 'var(--fg-1)', marginTop: 2 }}>{l}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 20, padding: 16, background: 'var(--inset)', borderRadius: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ font: '700 26px/1 var(--font-num)', color: 'var(--ember)' }}>A+</div>
            <div style={{ font: 'var(--overline)', color: 'var(--fg-2)', marginTop: 4 }}>SCORE</div>
          </div>
          <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--hairline-dark)' }} />
          <div style={{ font: 'var(--h3)', color: 'var(--fg-1)' }}>매우 규칙적인<br />수면이었어요!</div>
        </div>
      </Card>

      {weekly && <WeeklySleepSheet onClose={() => setWeekly(false)} />}

      {picking === 'bed' && (
        <TimePickerSheet label="취침 시간" hour={bedH} min={bedM}
          onConfirm={(h, m) => { setBedH(h); setBedM(m); }}
          onClose={() => setPicking(null)} />
      )}
      {picking === 'wake' && (
        <TimePickerSheet label="기상 시간" hour={wakeH} min={wakeM}
          onConfirm={(h, m) => { setWakeH(h); setWakeM(m); }}
          onClose={() => setPicking(null)} />
      )}
    </ScreenScroll>
  );
}

/* Optional weekly sleep view — bottom sheet, keeps main screen light */
function WeeklySleepSheet({ onClose }) {
  const maxDur = 9;
  const avg = (WEEK_SLEEP.reduce((s, d) => s + d.dur, 0) / WEEK_SLEEP.length).toFixed(1);
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(2px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: 'var(--surface-1)', borderRadius: '28px 28px 0 0',
        padding: '14px 20px 32px', maxHeight: '88%', overflowY: 'auto',
        boxShadow: 'var(--shadow-pop)',
      }}>
        <div style={{ width: 40, height: 5, borderRadius: 9999, background: 'var(--hairline-dark)', margin: '0 auto 18px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 22 }}>
          <div>
            <div style={{ font: 'var(--h1)', color: 'var(--fg-1)' }}>주간 수면</div>
            <div style={{ font: 'var(--body)', color: 'var(--fg-2)', marginTop: 4 }}>이번 주 평균 <strong style={{ color: 'var(--ember)' }}>{avg}시간</strong></div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--fg-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4, flexShrink: 0 }}>
            <I.plus size={24} stroke={1.8} style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>

        {/* duration bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 180, padding: '0 4px 0' }}>
          {WEEK_SLEEP.map(d => (
            <div key={d.d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ font: 'var(--caption)', color: 'var(--fg-2)' }}>{d.dur}</span>
              <div style={{
                width: '100%', height: `${(d.dur / maxDur) * 100}%`, borderRadius: 8,
                background: `linear-gradient(to top, ${QUALITY_COLOR[d.q]}, ${QUALITY_COLOR[Math.min(5, d.q + 1)]})`,
                minHeight: 18,
              }} />
              <span style={{ font: 'var(--caption)', color: 'var(--fg-2)' }}>{d.d}</span>
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: 'var(--hairline-dark)', margin: '22px 0' }} />

        {/* per-day rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {WEEK_SLEEP.map(d => (
            <div key={d.d} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', background: 'var(--card-dark)', borderRadius: 14 }}>
              <span style={{ font: 'var(--h3)', color: 'var(--fg-1)', width: 22 }}>{d.d}</span>
              <div style={{ flex: 1, font: 'var(--body)', color: 'var(--fg-2)' }}>{d.bed} – {d.wake}</div>
              <span style={{ font: 'var(--body-strong)', color: 'var(--fg-1)' }}>{d.dur}h</span>
              <span style={{
                font: 'var(--overline)', color: QUALITY_COLOR[Math.min(5, d.q + 1)],
                background: 'var(--inset-2)', padding: '4px 9px', borderRadius: 8, width: 26, textAlign: 'center',
              }}>{d.grade}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SleepScreen, WeeklySleepSheet, TimePickerSheet, DrumColumn, WEEK_SLEEP, QUALITY_COLOR });
