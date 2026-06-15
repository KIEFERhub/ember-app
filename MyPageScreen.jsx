/* Ember — 마이페이지 (overlay screen).
   Profile + settings: 넛지 강도 / 취침·기상 시간 / 다크 모드 / 계정.
   The dark-mode toggle is lifted to App state (theme), passed down here. */

/* a settings row: left label (+optional sub), right control */
function SettingRow({ icon, label, sub, control, onClick, last }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '15px 18px',
      cursor: onClick ? 'pointer' : 'default',
      borderBottom: last ? 'none' : '1px solid var(--hairline-dark)',
    }}>
      <div style={{ color: 'var(--ember)', flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: 'var(--body-strong)', color: 'var(--fg-1)' }}>{label}</div>
        {sub && <div style={{ font: 'var(--caption)', color: 'var(--fg-2)', marginTop: 2 }}>{sub}</div>}
      </div>
      {control}
    </div>
  );
}

/* segmented control — used for 넛지 강도 */
function Segmented({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, background: 'var(--inset)', borderRadius: 12, padding: 4 }}>
      {options.map(o => {
        const on = value === o.k;
        return (
          <button key={o.k} onClick={() => onChange(o.k)} style={{
            border: 'none', cursor: 'pointer', padding: '8px 4px', flex: 1, borderRadius: 9,
            background: on ? 'var(--ember)' : 'transparent', color: on ? 'var(--on-ember)' : 'var(--fg-2)',
            font: on ? 'var(--body-strong)' : 'var(--body)', transition: 'all .15s',
          }}>{o.t}</button>
        );
      })}
    </div>
  );
}

const NUDGE_LEVELS = [
  { k: 'soft', t: '부드럽게', desc: '꼭 필요할 때만 가볍게 알려드려요.' },
  { k: 'mid',  t: '보통',     desc: '하루에 적당한 횟수로 살펴드려요.' },
  { k: 'firm', t: '적극적',   desc: '습관을 자주 비춰주며 곁에서 권해요.' },
];

function MyPageScreen({ onBack, theme, onToggleTheme, score = 72 }) {
  const [nudge, setNudge] = React.useState('mid');
  const [sleepNudge, setSleepNudge] = React.useState(true);
  const st = flameStateFor(score);
  const level = NUDGE_LEVELS.find(n => n.k === nudge);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <SubHeader title="마이페이지" onBack={onBack} />
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <div style={{ padding: '4px 20px 28px' }}>

          {/* Profile card */}
          <Card tone="dark" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 9999,
                background: 'linear-gradient(135deg, var(--ember), var(--flame-3))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              }}><I.user size={32} stroke={1.9} /></div>
              <div style={{
                position: 'absolute', bottom: -2, right: -2, width: 26, height: 26, borderRadius: 9999,
                background: 'var(--card-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--ember)',
              }}><I.flame size={15} /></div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: 'var(--h2)', color: 'var(--fg-1)' }}>박도윤</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <Badge tone="soft">화톳불 리그</Badge>
                <span style={{ font: 'var(--caption)', color: 'var(--fg-2)' }}>오늘의 불씨 · {st.label}</span>
              </div>
            </div>
            <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-2)', padding: 4 }}>
              <I.chevR size={20} stroke={2} />
            </button>
          </Card>

          {/* Following / followers */}
          <Card tone="deep" style={{ marginTop: 12, display: 'flex', justifyContent: 'space-around', textAlign: 'center' }} pad={18}>
            {[['28', '팔로잉'], ['41', '팔로워'], ['126', '함께한 날']].map(([n, l], i) => (
              <React.Fragment key={l}>
                {i > 0 && <div style={{ width: 1, background: 'var(--hairline-dark)' }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ font: '700 22px/26px var(--font-num)', color: 'var(--fg-1)' }}>{n}</div>
                  <div style={{ font: 'var(--caption)', color: 'var(--fg-2)', marginTop: 4 }}>{l}</div>
                </div>
              </React.Fragment>
            ))}
          </Card>

          {/* 넛지 강도 */}
          <div style={{ font: 'var(--overline)', letterSpacing: '0.06em', color: 'var(--fg-2)', margin: '26px 4px 12px' }}>넛지 강도</div>
          <Card tone="dark" pad={20}>
            <Segmented options={NUDGE_LEVELS} value={nudge} onChange={setNudge} />
            <div style={{ font: 'var(--body)', color: 'var(--fg-2)', marginTop: 14 }}>{level.desc}</div>
          </Card>

          {/* 시간 설정 */}
          <div style={{ font: 'var(--overline)', letterSpacing: '0.06em', color: 'var(--fg-2)', margin: '26px 4px 12px' }}>수면 시간</div>
          <Card tone="dark" pad={0} style={{ overflow: 'hidden' }}>
            <SettingRow icon={<I.moon size={18} />} label="취침 시간" control={<TimeValue v="오후 10:30" />} onClick={() => {}} />
            <SettingRow icon={<I.sun size={18} />} label="기상 시간" control={<TimeValue v="오전 06:00" />} onClick={() => {}} />
            <SettingRow icon={<I.bell size={18} />} label="수면 넛지" sub="취침 30분 전 알림"
              control={<Toggle on={sleepNudge} onChange={setSleepNudge} />} last />
          </Card>

          {/* 화면 / 계정 */}
          <div style={{ font: 'var(--overline)', letterSpacing: '0.06em', color: 'var(--fg-2)', margin: '26px 4px 12px' }}>화면</div>
          <Card tone="dark" pad={0} style={{ overflow: 'hidden' }}>
            <SettingRow
              icon={theme === 'dark' ? <I.moon size={18} /> : <I.sun size={18} />}
              label="다크 모드"
              sub={theme === 'dark' ? '어두운 화면으로 보고 있어요' : '밝은 화면으로 보고 있어요'}
              control={<Toggle on={theme === 'dark'} onChange={onToggleTheme} />} last />
          </Card>

          <div style={{ font: 'var(--overline)', letterSpacing: '0.06em', color: 'var(--fg-2)', margin: '26px 4px 12px' }}>계정</div>
          <Card tone="dark" pad={0} style={{ overflow: 'hidden' }}>
            <SettingRow icon={<I.user size={18} />} label="프로필 편집" control={<I.chevR size={18} stroke={2} style={{ color: 'var(--fg-3)' }} />} onClick={() => {}} />
            <SettingRow icon={<I.shield size={18} />} label="개인정보 보호" control={<I.chevR size={18} stroke={2} style={{ color: 'var(--fg-3)' }} />} onClick={() => {}} last />
          </Card>

          <div style={{ textAlign: 'center', marginTop: 26 }}>
            <Button variant="tertiary" size="sm">로그아웃</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeValue({ v }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--body-strong)', color: 'var(--ember)' }}>
      {v}<I.chevR size={16} stroke={2} style={{ color: 'var(--fg-3)' }} />
    </span>
  );
}

Object.assign(window, { MyPageScreen });
