/* Ember — 집중 모드 (focus mode).
   Promoted out of the Home card into a global floating button (clock icon)
   that opens a bottom sheet from any tab.
   Sheet has two states: settings form → running countdown. */

/* floating action button — clock glyph, bottom-right above the tab bar */
function FocusFab({ onClick }) {
  const [press, setPress] = React.useState(false);
  return (
    <button onClick={onClick}
      onPointerDown={() => setPress(true)} onPointerUp={() => setPress(false)} onPointerLeave={() => setPress(false)}
      aria-label="집중 모드"
      style={{
        position: 'absolute', right: 18, bottom: 18, zIndex: 40,
        width: 58, height: 58, borderRadius: 9999, border: 'none', cursor: 'pointer',
        background: 'var(--ember)', color: 'var(--on-ember)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 6px 18px -4px rgba(232,111,53,0.6), 0 2px 6px rgba(0,0,0,0.3)',
        transition: 'transform .15s cubic-bezier(.4,0,.2,1), filter .15s',
        transform: press ? 'scale(0.94)' : 'scale(1)', filter: press ? 'brightness(0.94)' : 'none',
      }}>
      <I.clock size={26} stroke={2.1} />
    </button>
  );
}

/* settings form (was the Home focus card — subtext removed, custom groups added) */
function FocusMode({ onStart, preset, onClose }) {
  const [title, setTitle] = React.useState(preset?.title || '집중 모드');
  const [minutes, setMinutes] = React.useState(preset?.minutes || 45);
  const [groups, setGroups] = React.useState([
    { k: 'sns', t: 'SNS' }, { k: 'ott', t: '유튜브/OTT' }, { k: 'game', t: '게임' },
  ]);
  const [active, setActive] = React.useState(preset?.active || { sns: true });
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState('');

  const toggle = k => setActive(s => ({ ...s, [k]: !s[k] }));
  const addCustom = () => {
    const name = draft.trim();
    if (!name) { setAdding(false); return; }
    const k = 'c' + Date.now();
    setGroups(g => [...g, { k, t: name }]);
    setActive(s => ({ ...s, [k]: true }));
    setDraft(''); setAdding(false);
  };

  const blocked = groups.filter(g => active[g.k]);

  return (
    <div>
      {/* header — no subtext */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ font: 'var(--h1)', color: 'var(--fg-1)', whiteSpace: 'nowrap' }}>{title}</div>
        {onClose && <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-2)', padding: '0 0 0 4px', lineHeight: 0, flexShrink: 0, display: 'flex', alignItems: 'center' }}><I.plus size={24} stroke={1.8} style={{ transform: 'rotate(45deg)', display: 'block' }} /></button>}
      </div>

      {/* time */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <span style={{ font: 'var(--label)', color: 'var(--fg-1)' }}>시간 설정</span>
        <span style={{ font: '700 22px/1 var(--font-num)', color: 'var(--ember)' }}>{minutes}분</span>
      </div>
      <EmberSlider min={15} max={120} step={5} value={minutes} onChange={setMinutes} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, font: 'var(--caption)', color: 'var(--fg-3)' }}>
        <span>15분</span><span>120분</span>
      </div>

      {/* groups — multi-select + custom add */}
      <div style={{ font: 'var(--label)', color: 'var(--fg-1)', margin: '24px 0 12px' }}>차단할 앱 그룹</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {groups.map(g => <Chip key={g.k} active={!!active[g.k]} onClick={() => toggle(g.k)}>{g.t}</Chip>)}
        {!adding && (
          <Chip onClick={() => setAdding(true)} icon={<I.plus size={15} stroke={2.2} />}>직접 추가</Chip>
        )}
      </div>

      {adding && (
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addCustom(); if (e.key === 'Escape') { setAdding(false); setDraft(''); } }}
            placeholder="그룹 이름 (예: 쇼핑)"
            style={{
              flex: 1, height: 40, padding: '0 14px', borderRadius: 9999, outline: 'none',
              border: '1px solid var(--ember)', background: 'var(--inset)', color: 'var(--fg-1)',
              font: 'var(--label)', minWidth: 0,
            }} />
          <Button variant="primary" size="sm" onClick={addCustom}>확인</Button>
        </div>
      )}

      <Button variant="primary" size="lg" full style={{ marginTop: 26 }}
        icon={<I.flame size={20} />}
        onClick={() => onStart({ title, minutes, blocked: blocked.map(b => b.t) })}>집중 시작</Button>
    </div>
  );
}

/* running countdown — feels like a real session */
function FocusRunning({ minutes, blocked, onStop }) {
  const [left, setLeft] = React.useState(minutes * 60);
  React.useEffect(() => {
    if (left <= 0) return;
    const id = setInterval(() => setLeft(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [left]);

  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  const pct = minutes > 0 ? (1 - left / (minutes * 60)) * 100 : 0;

  return (
    <div style={{ textAlign: 'center', padding: '6px 0 4px' }}>
      <div style={{ font: 'var(--overline)', letterSpacing: '0.06em', color: 'var(--ember)', marginBottom: 18 }}>집중하는 중</div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <FlameState score={88} size={120} />
      </div>
      <div style={{ font: '700 56px/1 var(--font-num)', color: 'var(--fg-1)', letterSpacing: '-0.02em' }}>{mm}:{ss}</div>
      <div style={{ font: 'var(--body)', color: 'var(--fg-2)', marginTop: 10 }}>
        {left > 0 ? '스마트폰을 내려놓고 몰입하세요.' : '집중 세션을 마쳤어요. 잘했어요!'}
      </div>

      <div style={{ margin: '22px 0 4px' }}><Progress value={pct} /></div>

      {blocked.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center', marginTop: 20 }}>
          {blocked.map(b => (
            <span key={b} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, font: 'var(--caption)', color: 'var(--fg-2)', background: 'var(--inset)', padding: '6px 12px', borderRadius: 9999 }}>
              <I.lock size={13} stroke={2} />{b}
            </span>
          ))}
        </div>
      )}

      <Button variant="secondary" size="lg" full style={{ marginTop: 26 }} onClick={onStop}>
        {left > 0 ? '집중 종료' : '완료'}
      </Button>
    </div>
  );
}

/* bottom-sheet container — holds form → running */
function FocusSheet({ onClose, preset }) {
  const [session, setSession] = React.useState(null); // null | { minutes, blocked }

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 120, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(2px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: 'var(--surface-1)', borderRadius: '28px 28px 0 0',
        padding: '14px 20px 32px', maxHeight: '92%', overflowY: 'auto', boxShadow: 'var(--shadow-pop)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
          <div style={{ width: 40, height: 5, borderRadius: 9999, background: 'var(--hairline-dark)' }} />
        </div>

        {session
          ? <FocusRunning minutes={session.minutes} blocked={session.blocked} onStop={onClose} />
          : <FocusMode onStart={setSession} preset={preset} onClose={onClose} />}
      </div>
    </div>
  );
}

Object.assign(window, { FocusFab, FocusMode, FocusRunning, FocusSheet });
