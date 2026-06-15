/* Ember — 루틴 갤러리 (Home bottom).
   Preset focus / wind-down / habit "blocks" grouped by category, in
   horizontal scroll rows. Each card opens the focus sheet pre-filled.
   A leading "직접 만들기" card opens a blank sheet for a custom block.
   Visuals: warm ember-harmonious gradients + emoji (no stock imagery). */

const ROUTINE_SECTIONS = [
  {
    title: '포근한 밤을 위해',
    sub: '화면을 잠재우고 깊이 쉬어요.',
    items: [
      { k: 'wind',  icon: 'moonStars', title: '잠들기 준비', when: '밤 10:00 – 11:00', minutes: 60, grad: 'linear-gradient(155deg, #7A4A3A, #2A1710)', active: { sns: true, ott: true } },
      { k: 'deep',  icon: 'moon',      title: '깊은 수면',   when: '취침 시간 자동',      minutes: 90, grad: 'linear-gradient(155deg, #5A3526, #1C0E08)', active: { sns: true, ott: true, game: true } },
      { k: 'reset', icon: 'sunrise',   title: '아침 리셋',   when: '오전 7:00, 차분하게', minutes: 30, grad: 'linear-gradient(155deg, #E8893C, #C7502A)', active: { sns: true } },
    ],
  },
  {
    title: '건강한 습관 만들기',
    sub: '소중한 것에 시간을 써요.',
    items: [
      { k: 'read',  icon: 'book',      title: '독서 시간',   when: '평일 저녁 6:00 – 6:45', minutes: 45, grad: 'linear-gradient(155deg, #C77A2E, #6E3A1A)', active: { sns: true, ott: true, game: true } },
      { k: 'gym',   icon: 'zap',       title: '운동 시간',   when: '월·수·금 저녁',         minutes: 60, grad: 'linear-gradient(155deg, #E0451C, #7E1D12)', active: { sns: true, ott: true } },
      { k: 'med',   icon: 'waves',     title: '명상 모드',   when: '하루 10분 마음챙김',    minutes: 10, grad: 'linear-gradient(155deg, #B5663E, #5E2A1C)', active: { sns: true, ott: true, game: true } },
      { k: 'study', icon: 'pen',       title: '집중 공부',   when: '방해 없이 몰입',        minutes: 50, grad: 'linear-gradient(155deg, #D9831F, #8A3A1F)', active: { sns: true, ott: true, game: true } },
    ],
  },
];

function RoutineCard({ item, onAdd }) {
  return (
    <div onClick={onAdd} style={{
      width: 164, flexShrink: 0, borderRadius: 22, overflow: 'hidden', cursor: 'pointer',
      background: item.grad, position: 'relative', minHeight: 216,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      boxShadow: 'var(--shadow-card)', scrollSnapAlign: 'start',
    }}>
      {/* legibility scrim */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0) 55%)' }} />
      <div style={{ position: 'relative', padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {(() => { const Ico = I[item.icon]; return Ico ? <Ico size={18} stroke={1.9} style={{ color: 'rgba(255,255,255,0.92)', flexShrink: 0 }} /> : null; })()}
          <span style={{ font: 'var(--h3)', color: '#fff', letterSpacing: '-0.03em' }}>{item.title}</span>
        </div>
        <div style={{ font: 'var(--caption)', color: 'rgba(255,255,255,0.82)', marginTop: 5, textWrap: 'pretty' }}>{item.when}</div>
        <button onClick={(e) => { e.stopPropagation(); onAdd(); }} style={{
          marginTop: 12, width: '100%', height: 38, borderRadius: 9999, cursor: 'pointer',
          border: 'none', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)',
          color: '#fff', font: 'var(--label)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        }}>
          <I.plus size={16} stroke={2.4} />추가
        </button>
      </div>
    </div>
  );
}

function CustomCard({ onClick }) {
  return (
    <div onClick={onClick} style={{
      width: 164, flexShrink: 0, borderRadius: 22, cursor: 'pointer', minHeight: 216,
      border: '1.5px dashed var(--stroke-brown)', background: 'var(--inset)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
      scrollSnapAlign: 'start',
    }}>
      <div style={{ width: 52, height: 52, borderRadius: 9999, background: 'var(--ember)', color: 'var(--on-ember)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <I.plus size={26} stroke={2.4} />
      </div>
      <div style={{ textAlign: 'center', padding: '0 14px' }}>
        <div style={{ font: 'var(--body-strong)', color: 'var(--fg-1)' }}>직접 만들기</div>
        <div style={{ font: 'var(--caption)', color: 'var(--fg-2)', marginTop: 3 }}>나만의 블록을<br />새로 추가해요</div>
      </div>
    </div>
  );
}

function ScrollRow({ children }) {
  // full-bleed horizontal scroll. Use real spacer elements for the side
  // gutters — padding-inline on an overflow flex row isn't honored for the
  // first/last child position, so spacers guarantee an even 20px gutter.
  const Spacer = () => <div aria-hidden style={{ width: 8, flexShrink: 0 }} />;
  return (
    <div style={{
      display: 'flex', gap: 12, overflowX: 'auto', scrollSnapType: 'x mandatory',
      margin: '0 -20px', padding: '4px 0', WebkitOverflowScrolling: 'touch',
      scrollPaddingLeft: 20,
    }}>
      <Spacer />
      {children}
      <Spacer />
    </div>
  );
}

function RoutineGallery({ onOpenFocus }) {
  return (
    <div style={{ marginTop: 28 }}>
      {ROUTINE_SECTIONS.map((sec, si) => (
        <div key={sec.title} style={{ marginTop: si === 0 ? 0 : 28 }}>
          <div style={{ font: 'var(--h2)', color: 'var(--fg-1)', lineHeight: 1.15 }}>{sec.title}</div>
          <div style={{ font: 'var(--body)', color: 'var(--fg-2)', lineHeight: 1.2, marginTop: 1, marginBottom: 14 }}>{sec.sub}</div>
          <ScrollRow>
            {sec.items.map(item => (
              <RoutineCard key={item.k} item={item}
                onAdd={() => onOpenFocus({ title: item.title, icon: item.icon, minutes: item.minutes, active: item.active })} />
            ))}
            {si === 0 && <CustomCard onClick={() => onOpenFocus(null)} />}
          </ScrollRow>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { RoutineGallery, ROUTINE_SECTIONS });
