/* Ember — 불씨 종류 (overlay screen).
   Tapping the home hero flame opens this. Shows all 5 flame states from
   FlameState.jsx, each live-animated, with what it means for screen-time.
   The user's current state is highlighted. */

/* representative score per state (sits comfortably inside each min band) */
const FLAME_SAMPLE = { pristine: 90, steady: 70, flicker: 50, windy: 30, storm: 10 };

/* one-line "what it means" for each state — restraint framing, never a warning */
const FLAME_MEANING = {
  pristine: '사용을 가장 잘 절제한 날. 불꽃이 푸르게 가장 크고 고요하게 타올라요.',
  steady:   '안정적으로 조절하고 있어요. 청록빛으로 잔잔하게 빛나요.',
  flicker:  '평소만큼 쓴 보통의 날. 골드빛으로 부드럽게 일렁여요.',
  windy:    '조금 많이 썼어요. 불꽃이 바람에 흔들리기 시작해요.',
  storm:    '사용이 많았던 날. 거센 바람에 불꽃이 휘청여요.',
};

function FlameGalleryScreen({ onBack, score = 72 }) {
  const current = flameStateFor(score);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <SubHeader title="불씨의 종류" onBack={onBack} />
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <div style={{ padding: '4px 20px 28px' }}>
          <p style={{ margin: '2px 4px 20px', font: 'var(--body)', color: 'var(--fg-2)', textWrap: 'pretty' }}>
            불씨는 절제할수록 더 크고 차분하게 타올라요. 잘 지킬수록 푸른불에 가까워져요.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {FLAME_STATES.map((st, i) => {
              const mine = st.key === current.key;
              return (
                <Card key={st.key} tone={mine ? 'dark' : 'deep'}
                  style={{ display: 'flex', alignItems: 'center', gap: 16,
                    border: mine ? '1px solid var(--ember)' : '1px solid transparent' }} pad={16}>
                  {/* live flame, fixed-height slot so rows align */}
                  <div style={{ width: 84, height: 116, flexShrink: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <FlameState score={FLAME_SAMPLE[st.key]} size={72} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ font: 'var(--h2)', color: 'var(--fg-1)' }}>{st.label}</span>
                      <span style={{
                        font: 'var(--overline)', letterSpacing: '0.06em', color: 'var(--fg-3)',
                      }}>{['최상', '양호', '보통', '주의', '과다'][i]}</span>
                      {mine && <Badge tone="me">오늘</Badge>}
                    </div>
                    <div style={{ font: 'var(--caption)', color: 'var(--fg-2)', marginTop: 6, textWrap: 'pretty' }}>
                      {FLAME_MEANING[st.key]}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* how it's read */}
          <div style={{ display: 'flex', gap: 10, marginTop: 18, padding: 16, background: 'var(--inset)', borderRadius: 16 }}>
            <I.flame size={20} style={{ color: 'var(--ember)', flexShrink: 0, marginTop: 1 }} />
            <div style={{ font: 'var(--body)', color: 'var(--fg-2)', textWrap: 'pretty' }}>
              불씨 상태는 <strong style={{ color: 'var(--fg-1)' }}>크기 · 색 · 움직임</strong>으로 나타나요. 잘 절제할수록 차갑고 고요하게, 많이 쓸수록 뜨겁고 거세게 흔들려요.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FlameGalleryScreen, FlameGalleryPopup });

/* Popup variant — opened from the home flame (i). Centered card, list scrolls. */
function FlameGalleryPopup({ onClose, score = 72 }) {
  const current = flameStateFor(score);
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 120, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', backdropFilter: 'blur(2px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: 'var(--surface-1)', borderRadius: 28,
        padding: '26px 20px 24px', boxShadow: 'var(--shadow-pop)', display: 'flex', flexDirection: 'column', maxHeight: '100%',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ font: 'var(--h1)', color: 'var(--fg-1)' }}>불씨의 종류</div>
            <p style={{ margin: '8px 0 0', font: 'var(--body)', color: 'var(--fg-2)', textWrap: 'pretty' }}>
              절제할수록 더 크고 차분하게 타올라요. 잘 지킬수록 푸른불에 가까워져요.
            </p>
          </div>
          <button onClick={onClose} aria-label="닫기" style={{ background: 'var(--inset)', border: 'none', cursor: 'pointer', color: 'var(--fg-2)', width: 32, height: 32, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon d="M6 6l12 12M18 6L6 18" size={18} stroke={2.2} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18, overflowY: 'auto', margin: '18px -4px 0', padding: '2px 4px' }}>
          {FLAME_STATES.map((st, i) => {
            const mine = st.key === current.key;
            return (
              <Card key={st.key} tone={mine ? 'dark' : 'deep'}
                style={{ display: 'flex', alignItems: 'center', gap: 14,
                  border: mine ? '1px solid var(--ember)' : '1px solid transparent' }} pad={14}>
                <div style={{ width: 68, height: 96, flexShrink: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <FlameState score={FLAME_SAMPLE[st.key]} size={58} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ font: 'var(--h2)', color: 'var(--fg-1)' }}>{st.label}</span>
                    <span style={{ font: 'var(--overline)', letterSpacing: '0.06em', color: 'var(--fg-3)' }}>{['최상', '양호', '보통', '주의', '과다'][i]}</span>
                    {mine && <Badge tone="me">오늘</Badge>}
                  </div>
                  <div style={{ font: 'var(--caption)', color: 'var(--fg-2)', marginTop: 5, textWrap: 'pretty' }}>
                    {FLAME_MEANING[st.key]}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
