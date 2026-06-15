/* Ember — 알림 (overlay screen).
   Three nudge types — 연속 사용 · 취침 시간 · EOD 감정 체크인.
   Tone is invitation, never warning. Each nudge is *completed inline*:
   respond on the card and it resolves to a calm confirmation. */

/* one nudge card — owns its own pending → resolved state */
function NudgeCard({ time, icon, tone = 'ember', title, body, children }) {
  // children is a render-prop: (resolve) => actions UI
  const [resolved, setResolved] = React.useState(null); // null | string (confirmation)
  return (
    <Card tone={resolved ? 'deep' : 'dark'} style={{ marginBottom: 12, opacity: resolved ? 0.96 : 1, transition: 'opacity .2s' }}>
      <div style={{ display: 'flex', gap: 14 }}>
        <div style={{ flexShrink: 0, color: resolved ? 'var(--fg-3)' : 'var(--ember)', paddingTop: 2 }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
            <span style={{ font: 'var(--h3)', color: 'var(--fg-1)' }}>{title}</span>
            <span style={{ font: 'var(--caption)', color: 'var(--fg-3)', flexShrink: 0 }}>{time}</span>
          </div>
          <p style={{ margin: '6px 0 0', font: 'var(--body)', color: 'var(--fg-2)' }}>{body}</p>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        {resolved
          ? <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ember)', font: 'var(--body-strong)' }}>
              <I.check size={18} stroke={2.4} />{resolved}
            </div>
          : children(setResolved)}
      </div>
    </Card>
  );
}

function NotificationsScreen({ onBack }) {
  const moods = ['평온함', '뿌듯함', '답답함', '피곤함'];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <SubHeader title="알림" onBack={onBack}
        action={<button style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'var(--label)', color: 'var(--fg-2)', padding: 8, whiteSpace: 'nowrap' }}>모두 읽음</button>} />
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <div style={{ padding: '4px 20px 28px' }}>
          <p style={{ margin: '2px 4px 18px', font: 'var(--body)', color: 'var(--fg-2)' }}>
            강요하지 않아요. 지금 마음이 닿는 만큼만 응답해주세요.
          </p>

          {/* 1 · 연속 사용 */}
          <NudgeCard time="방금"
            icon={<I.clock size={20} />} tone="ember"
            title="잠깐 쉬어갈까요?"
            body="벌써 1시간째 화면을 보고 있어요. 잠시 눈을 감고 숨을 고르면 불씨가 다시 살아나요.">
            {resolve => (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Button variant="primary" size="md" full icon={<I.flame size={18} />}
                  onClick={() => resolve('5분 휴식을 시작했어요. 천천히 쉬어가요.')}>5분 쉬기</Button>
                <Button variant="secondary" size="sm" style={{ background: 'var(--track)', color: 'var(--fg-2)', flexShrink: 0 }}
                  onClick={() => resolve('15분 뒤에 다시 가볍게 살펴볼게요.')}>15분 더</Button>
              </div>
            )}
          </NudgeCard>

          {/* 2 · 취침 시간 */}
          <NudgeCard time="오후 10:00"
            icon={<I.moon size={20} />} tone="ember"
            title="곧 잠들 시간이에요"
            body="오늘 하루도 수고했어요. 수면 모드를 켜고 화면을 잠재우면 내일의 불씨가 더 환해져요.">
            {resolve => (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Button variant="primary" size="md" full icon={<I.moon size={18} />}
                  onClick={() => resolve('수면 모드를 켰어요. 좋은 밤 보내요.')}>수면 모드 켜기</Button>
                <Button variant="secondary" size="sm" style={{ background: 'var(--track)', color: 'var(--fg-2)', flexShrink: 0 }}
                  onClick={() => resolve('30분 뒤에 다시 알려드릴게요.')}>30분 후</Button>
              </div>
            )}
          </NudgeCard>

          {/* 3 · EOD 감정 체크인 — inline mood pick */}
          <NudgeCard time="오후 11:00"
            icon={<I.brain size={20} />} tone="ember"
            title="오늘 하루는 어떠셨나요?"
            body="지금 기분을 한 가지만 골라주세요. 내일 리포트에서 기분과 사용 패턴을 함께 비춰드릴게요.">
            {resolve => {
              const [custom, setCustom] = React.useState('');
              const [showInput, setShowInput] = React.useState(false);
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {moods.map(m => (
                      <Chip key={m} onClick={() => resolve(`'${m}'으로 기록했어요. 푹 쉬어요.`)}>{m}</Chip>
                    ))}
                    <Chip onClick={() => setShowInput(v => !v)} style={showInput ? { background: 'var(--ember)', color: '#fff', borderColor: 'var(--ember)' } : {}}>기타(직접 작성)</Chip>
                  </div>
                  {showInput && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        autoFocus
                        value={custom}
                        onChange={e => setCustom(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && custom.trim() && resolve(`'${custom.trim()}'으로 기록했어요. 푹 쉬어요.`)}
                        placeholder="기분을 자유롭게 적어주세요"
                        style={{
                          flex: 1, background: 'var(--inset)', border: '1px solid var(--hairline-dark)',
                          borderRadius: 12, padding: '10px 14px', font: 'var(--body)',
                          color: 'var(--fg-1)', outline: 'none', letterSpacing: '-0.02em',
                        }}
                      />
                      <button
                        onClick={() => custom.trim() && resolve(`'${custom.trim()}'으로 기록했어요. 푹 쉬어요.`)}
                        disabled={!custom.trim()}
                        style={{
                          background: custom.trim() ? 'var(--ember)' : 'var(--track)',
                          color: custom.trim() ? '#fff' : 'var(--fg-3)',
                          border: 'none', borderRadius: 12, padding: '10px 16px',
                          font: 'var(--label)', cursor: custom.trim() ? 'pointer' : 'default',
                          flexShrink: 0, transition: 'background .15s',
                        }}>기록</button>
                    </div>
                  )}
                </div>
              );
            }}
          </NudgeCard>

          {/* earlier, already-handled */}
          <div style={{ font: 'var(--overline)', letterSpacing: '0.06em', color: 'var(--fg-3)', margin: '24px 4px 12px' }}>지난 알림</div>
          <Card tone="deep" style={{ display: 'flex', gap: 14, alignItems: 'center', opacity: 0.85 }} pad={18}>
            <I.check size={18} stroke={2.4} style={{ color: 'var(--fg-3)', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ font: 'var(--body-strong)', color: 'var(--fg-1)' }}>넛지 8건에 응답했어요</div>
              <div style={{ font: 'var(--caption)', color: 'var(--fg-2)', marginTop: 2 }}>오늘 · 수락 8 · 지연 3 · 무시 1</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { NotificationsScreen, NudgeCard });
