/* Ember — Splash · Login · Onboarding · Survey */
const { useState, useEffect, useRef } = React;

const LOGO_PATH = "M893.78,347.03c-1.97-1.95-2.51-4.38-2.01-6.93.9-4.63,1.58-9.15,1.86-13.84.06-.97.47-1.79,1.34-2.08.73-.24,1.8-.16,2.38.53,3.93,4.66,7.19,9.7,9.8,15.2,3.58,7.55,5.43,15.54,4.43,23.87-.03.23.38.85.6.77l.81-.29c4.74-7.97,6.61-17.07,5.49-26.28-1.71-15.12-9.84-31.09-19.15-43.09-2.74-3.52-5.65-6.64-8.91-9.65-.53-.49-1.44-.5-2.03-.19s-.78.95-.85,1.76c-.69,8.93-3.96,17.35-9.1,24.74-2.78,3.99-5.89,7.49-9.28,10.98l-6.86,7.04c-2.4,2.46-4.31,5.11-5.99,8.1-3.73,6.61-4.76,14.35-2.49,21.61,4.21,13.46,19.8,21.45,33.52,17.93,8.06-2.07,14.85-8.37,14.5-16.68-.14-3.47-1.58-6.56-3.75-9.26l-4.31-4.25h0ZM908.46,388.75c-16.82,10-36.11,7.77-51.94-3.09-22.65-15.55-31.16-46.2-12.39-67.92,2.6-3.01,5.46-5.53,8.44-8.17l6.45-5.72c12.03-11.25,16.35-25.63,15.98-41.69-.03-1.19.3-2.21,1.16-2.84.85-.64,2.18-.97,3.26-.54,2.29.92,4.35,2.08,6.5,3.4,6.79,4.19,12.97,9.17,18.61,14.81,12.29,12.28,22.65,28.12,27.79,44.61,1.68,5.39,2.67,10.77,3.03,16.37,1.33,20.44-9.01,40.15-26.89,50.78h0Z";
const LOGO_VB = "818 250 125 155";

/* ── illustrations ─────────────────────────────────────────────────────── */

function IllusNudge() {
  return (
    <svg viewBox="0 0 240 200" width="240" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* speech bubble */}
      <rect x="30" y="30" width="160" height="90" rx="20" fill="rgba(232,111,53,0.12)" stroke="rgba(232,111,53,0.3)" strokeWidth="1.5"/>
      <path d="M80 120 L70 138 L96 128Z" fill="rgba(232,111,53,0.12)" stroke="rgba(232,111,53,0.3)" strokeWidth="1.5" strokeLinejoin="round"/>
      {/* dots inside bubble */}
      {[70,110,150].map((x,i) => (
        <circle key={i} cx={x} cy="75" r="8" fill={i===1 ? 'var(--ember)' : 'rgba(232,111,53,0.35)'}/>
      ))}
      {/* sparkles */}
      <circle cx="190" cy="48" r="4" fill="var(--ember)" opacity="0.7"/>
      <circle cx="208" cy="72" r="2.5" fill="var(--ember)" opacity="0.45"/>
      <circle cx="42" cy="150" r="3" fill="var(--ember)" opacity="0.4"/>
      <circle cx="178" cy="160" r="5" fill="rgba(232,111,53,0.3)"/>
    </svg>
  );
}

function IllusFlame() {
  const flames = [
    { cx: 56,  h: 40, color: '#C7502A', label: '과사용' },
    { cx: 120, h: 62, color: '#E86F35', label: '보통' },
    { cx: 184, h: 82, color: '#5BC8D6', label: '절제' },
  ];
  // LOGO_PATH fits in viewBox 818 250 125 155
  const NW = 125, NH = 155;
  return (
    <svg viewBox="0 0 240 200" width="240" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {flames.map((f, i) => {
        const sc = f.h / NH;
        const tx = f.cx - (NW * sc) / 2;
        const ty = 148 - f.h;
        return (
          <g key={i}>
            <ellipse cx={f.cx} cy="152" rx={NW * sc * 0.55} ry="5" fill={f.color} opacity="0.2"/>
            <g transform={`translate(${tx.toFixed(1)},${ty.toFixed(1)}) scale(${sc.toFixed(3)})`}>
              <path d={LOGO_PATH} fill={f.color} fillRule="nonzero"/>
            </g>
            <text x={f.cx} y="168" textAnchor="middle" fontSize="11"
              fill="rgba(244,240,235,0.55)" fontFamily="var(--font-sans)">{f.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function IllusReport() {
  const COLS = 7, ROWS = 4;
  const vals = [[0,1,0,1,2,0,0],[2,3,4,3,4,2,1],[3,5,4,6,5,3,2],[2,3,3,4,2,2,4]];
  const colors = ['#1A1714','#FDEBD5','#F9C19A','#F0A23E','#E86F35','#C7502A','#8A3A1F'];
  const cw = 22, ch = 16, gx = 4, gy = 4;
  const cardX = 16, cardW = 208, cardH = 125;
  const gridW = COLS * cw + (COLS - 1) * gx;
  const startX = cardX + Math.round((cardW - gridW) / 2);
  const startY = 48;
  return (
    <svg viewBox="0 0 240 165" width="240" height="165" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="10" width={cardW} height={cardH} rx="14" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <text x={startX} y="34" fontSize="12" fill="rgba(244,240,235,0.8)" fontFamily="var(--font-sans)" fontWeight="600">사용 히트맵</text>
      {vals.map((row, ri) => row.map((v, ci) => (
        <rect key={`${ri}-${ci}`}
          x={startX + ci * (cw + gx)} y={startY + ri * (ch + gy)}
          width={cw} height={ch} rx="4" fill={colors[v]}/>
      )))}
    </svg>
  );
}

function IllusSleep() {
  const R = 52, cy = 80, C = 2 * Math.PI * R;
  return (
    <svg viewBox="0 0 240 200" width="240" height="200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* ring */}
      <circle cx="120" cy={cy} r={R} stroke="rgba(255,255,255,0.08)" strokeWidth="11"/>
      <circle cx="120" cy={cy} r={R} stroke="var(--ember)" strokeWidth="11" strokeLinecap="round"
        strokeDasharray={`${C * 0.72} ${C}`} transform={`rotate(-90 120 ${cy})`}/>
      {/* moon inside ring */}
      <path d={`M112 ${cy-14} A16 16 0 1 0 128 ${cy+2} A11 11 0 1 1 112 ${cy-14}Z`} fill="rgba(232,111,53,0.85)"/>
      {/* stars outside ring */}
      {[[155,38,3],[168,58,2],[140,30,2]].map(([x,y,r],i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="rgba(244,240,235,0.55)"/>
      ))}
      {/* divider */}
      <line x1="88" y1="148" x2="152" y2="148" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      {/* times — clearly below the ring */}
      <text x="120" y="165" textAnchor="middle" fontSize="12" fill="rgba(244,240,235,0.45)" fontFamily="var(--font-sans)">22:30 – 06:00</text>
      <text x="120" y="185" textAnchor="middle" fontSize="13" fill="rgba(232,111,53,0.85)" fontFamily="var(--font-sans)" fontWeight="600">7시간 30분</text>
    </svg>
  );
}

/* ── Step indicator ──────────────────────────────────────────────────────── */
function Dots({ total, current }) {
  return (
    <div style={{ display: 'flex', gap: 7, justifyContent: 'center' }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          width: i === current ? 20 : 7, height: 7, borderRadius: 9999,
          background: i === current ? 'var(--ember)' : 'rgba(244,240,235,0.18)',
          transition: 'width .25s ease, background .25s ease',
        }}/>
      ))}
    </div>
  );
}

/* ── Splash ──────────────────────────────────────────────────────────────── */
function SplashScreen({ onDone }) {
  return (
    <div onClick={onDone} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', gap: 18, cursor: 'pointer', userSelect: 'none' }}>
      <svg width="72" height="89" viewBox={LOGO_VB} style={{ color: 'var(--ember)', filter: 'drop-shadow(0 0 20px rgba(232,111,53,0.55))' }}>
        <path fill="currentColor" fillRule="nonzero" d={LOGO_PATH}/>
      </svg>
      <div style={{ font: '700 36px/1 var(--font-sans)', color: 'var(--fg-1)', letterSpacing: '-0.05em' }}>Ember</div>
      <div style={{ font: 'var(--body)', color: 'var(--fg-3)', letterSpacing: '-0.02em', marginTop: 4 }}>강요 없이, 스스로 인식하게</div>
      <div style={{ position: 'absolute', bottom: 56, font: 'var(--caption)', color: 'rgba(244,240,235,0.25)', letterSpacing: 0 }}>탭하여 시작</div>
    </div>
  );
}

/* ── Login ───────────────────────────────────────────────────────────────── */
function LoginScreen({ onNext }) {
  const loginBtns = [
    {
      label: 'Apple로 계속하기', bg: '#fff', fg: '#000',
      icon: <svg width="18" height="20" viewBox="0 0 18 20" fill="none"><path d="M14.85 10.58c-.02-2.14 1.75-3.17 1.83-3.22C15.67 5.6 13.7 5.35 13 5.33c-1.6-.16-3.14.94-3.95.94-.82 0-2.07-.92-3.4-.9C4.07 5.39 2.5 6.44 1.64 8.02-.1 11.2.99 15.9 2.71 18.4c.86 1.22 1.88 2.59 3.22 2.54 1.3-.05 1.79-.84 3.36-.84 1.57 0 2.01.84 3.38.81 1.39-.02 2.28-1.25 3.12-2.48.98-1.41 1.39-2.79 1.41-2.86-.03-.01-2.7-1.03-2.73-4.08-.01-.01.38-.01.38-.01zM11.89 2.64C12.59 1.77 13.05.57 12.92-.6c-1.03.04-2.28.7-3.01 1.56C9.22 1.8 8.65 3.02 8.81 4.17c1.15.09 2.31-.57 3.08-1.53z" fill="#000"/></svg>,
    },
    {
      label: '카카오로 계속하기', bg: '#FEE500', fg: '#3C1E1E',
      icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2C5.58 2 2 4.95 2 8.6c0 2.3 1.52 4.32 3.82 5.47L4.9 17.1c-.08.3.22.55.49.38l3.74-2.49c.28.03.57.04.87.04 4.42 0 8-2.95 8-6.6C18 4.95 14.42 2 10 2z" fill="#3C1E1E"/></svg>,
    },
    {
      label: 'Google로 계속하기', bg: '#fff', fg: '#3C3C3C',
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>,
    },
  ];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)', padding: '0 24px' }}>
      <div style={{ paddingTop: 56, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 44 }}>
          <svg width="32" height="40" viewBox={LOGO_VB} style={{ color: 'var(--ember)' }}>
            <path fill="currentColor" fillRule="nonzero" d={LOGO_PATH}/>
          </svg>
          <div style={{ font: '700 26px/1 var(--font-sans)', color: 'var(--fg-1)', letterSpacing: '-0.04em', marginTop: 14 }}>시작하기</div>
          <div style={{ font: 'var(--body)', color: 'var(--fg-2)', marginTop: 8, textAlign: 'center', letterSpacing: '-0.02em' }}>나만의 불씨를 키워보세요</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loginBtns.map((b, i) => (
            <button key={i} onClick={onNext} style={{
              width: '100%', height: 54, borderRadius: 16, border: 'none', cursor: 'pointer',
              background: b.bg, color: b.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              font: '600 15px/1 var(--font-sans)', letterSpacing: '-0.02em',
              boxShadow: b.bg === '#fff' ? '0 2px 12px rgba(0,0,0,0.18)' : 'none',
            }}>
              {b.icon}{b.label}
            </button>
          ))}
          <button onClick={onNext} style={{
            width: '100%', height: 54, borderRadius: 16, border: '1.5px solid var(--hairline-dark)',
            cursor: 'pointer', background: 'transparent', color: 'var(--fg-2)',
            font: '500 15px/1 var(--font-sans)', letterSpacing: '-0.02em',
          }}>이메일로 계속하기</button>
        </div>

        <button onClick={onNext} style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: 24, textAlign: 'center', font: 'var(--caption)', color: 'var(--fg-3)', letterSpacing: '-0.01em' }}>
          나중에 시작하기
        </button>
      </div>
    </div>
  );
}

/* ── Onboarding step ─────────────────────────────────────────────────────── */
const STEPS = [
  { title: '강요하지 않아요', sub: '화면 사용을 막는 게 아니라\n스스로 알아차리도록 부드럽게 알려드려요.', Illus: IllusNudge },
  { title: '불씨로 상태를 확인해요', sub: '절제할수록 불씨가 커지고 빛나요.\n나의 습관을 직관적으로 느낄 수 있어요.', Illus: IllusFlame },
  { title: 'AI가 패턴을 분석해요', sub: '언제, 무엇을 많이 쓰는지\n히트맵과 인사이트로 한눈에 볼 수 있어요.', Illus: IllusReport },
  { title: '취침 전 루틴을 만들어요', sub: '잠들기 전 앱 차단과 넛지로\n더 깊고 규칙적인 수면을 도와드려요.', Illus: IllusSleep },
];

function OnboardStep({ stepIdx, onNext, onSkip, onBack }) {
  const s = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)', padding: '0 28px 36px' }}>
      {/* top row: back + skip */}
      <div style={{ paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', color: 'var(--fg-3)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7"/></svg>
        </button>
        {!isLast && <button onClick={onSkip} style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'var(--label)', color: 'var(--fg-3)', letterSpacing: '-0.02em' }}>건너뛰기</button>}
        {isLast && <div style={{ width: 30 }} />}
      </div>

      {/* illustration */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <s.Illus />
      </div>

      {/* text */}
      <div style={{ marginBottom: 32 }}>
        <Dots total={STEPS.length} current={stepIdx} />
        <div style={{ font: '700 24px/1.2 var(--font-sans)', color: 'var(--fg-1)', letterSpacing: '-0.04em', marginTop: 20, marginBottom: 12 }}>{s.title}</div>
        <div style={{ font: 'var(--body)', color: 'var(--fg-2)', letterSpacing: '-0.02em', lineHeight: 1.55, whiteSpace: 'pre-line' }}>{s.sub}</div>
      </div>

      <button onClick={onNext} style={{
        width: '100%', height: 58, borderRadius: 18, border: 'none', cursor: 'pointer',
        background: 'var(--ember)', color: '#fff',
        font: '600 17px/1 var(--font-sans)', letterSpacing: '-0.03em',
        boxShadow: '0 4px 20px rgba(232,111,53,0.4)',
      }}>{isLast ? '거의 다 왔어요!' : '다음'}</button>
    </div>
  );
}

/* ── Survey ──────────────────────────────────────────────────────────────── */
const APPS_LIST = ['유튜브', '인스타그램', '틱톡', '카카오톡', '넷플릭스', '기타'];

function SurveyScreen({ onDone, onBack }) {
  const [selected, setSelected] = useState([]);
  const [hours, setHours] = useState(3);
  const toggle = (a) => setSelected(s => s.includes(a) ? s.filter(x => x !== a) : [...s, a]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)', padding: '0 24px 36px', overflowY: 'auto' }}>
      <div style={{ paddingTop: 20, paddingBottom: 8 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', color: 'var(--fg-3)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7"/></svg>
        </button>
      </div>
      <div style={{ paddingBottom: 20 }}>
        <div style={{ font: '700 24px/1.2 var(--font-sans)', color: 'var(--fg-1)', letterSpacing: '-0.04em', marginBottom: 8 }}>나에게 맞게 설정해요</div>
        <div style={{ font: 'var(--body)', color: 'var(--fg-2)', letterSpacing: '-0.02em' }}>더 나은 넛지를 위해 몇 가지만 알려주세요.</div>
      </div>

      {/* Q1 */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ font: 'var(--h3)', color: 'var(--fg-1)', marginBottom: 14, letterSpacing: '-0.025em' }}>가장 신경 쓰이는 앱은?</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {APPS_LIST.map(a => {
            const on = selected.includes(a);
            return (
              <button key={a} onClick={() => toggle(a)} style={{
                padding: '9px 18px', borderRadius: 9999, border: 'none', cursor: 'pointer',
                background: on ? 'var(--ember)' : 'var(--surface-2)',
                color: on ? '#fff' : 'var(--fg-2)',
                font: 'var(--label)', letterSpacing: '-0.02em',
                transition: 'all .15s',
              }}>{a}</button>
            );
          })}
        </div>
      </div>

      {/* Q2 */}
      <div style={{ marginBottom: 44 }}>
        <div style={{ font: 'var(--h3)', color: 'var(--fg-1)', marginBottom: 6, letterSpacing: '-0.025em' }}>하루 목표 스크린타임</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 18 }}>
          <span style={{ font: '700 36px/1 var(--font-num)', color: 'var(--ember)', letterSpacing: '-0.05em' }}>{hours}</span>
          <span style={{ font: 'var(--body)', color: 'var(--fg-2)' }}>시간</span>
        </div>
        <input type="range" min="1" max="8" step="0.5" value={hours} onChange={e => setHours(Number(e.target.value))}
          className="ember-range" style={{
            width: '100%', appearance: 'none', height: 6, borderRadius: 9999,
            background: `linear-gradient(to right, var(--ember) ${(hours - 1) / 7 * 100}%, var(--surface-2) ${(hours - 1) / 7 * 100}%)`,
            outline: 'none', cursor: 'pointer',
          }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ font: 'var(--caption)', color: 'var(--fg-3)' }}>1시간</span>
          <span style={{ font: 'var(--caption)', color: 'var(--fg-3)' }}>8시간</span>
        </div>
      </div>

      <button onClick={onDone} style={{
        width: '100%', height: 58, borderRadius: 18, border: 'none', cursor: 'pointer',
        background: 'var(--ember)', color: '#fff',
        font: '600 17px/1 var(--font-sans)', letterSpacing: '-0.03em',
        boxShadow: '0 4px 20px rgba(232,111,53,0.4)',
      }}>설정 완료</button>
    </div>
  );
}

/* ── Done ────────────────────────────────────────────────────────────────── */
function DoneScreen({ onDone }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '0 32px', gap: 0 }}>
      <div style={{ position: 'relative', marginBottom: 32 }}>
        <svg width="88" height="109" viewBox={LOGO_VB} style={{ color: 'var(--ember)', filter: 'drop-shadow(0 0 28px rgba(232,111,53,0.6))' }}>
          <path fill="currentColor" fillRule="nonzero" d={LOGO_PATH}/>
        </svg>
        {/* sparkles */}
        {[['-22px','-10px'],['28px','-18px'],['-18px','40px'],['30px','30px']].map(([l,t],i) => (
          <div key={i} style={{ position: 'absolute', left: `calc(50% + ${l})`, top: `calc(50% + ${t})`, width: 6, height: 6, borderRadius: 9999, background: 'var(--ember)', opacity: 0.6 }}/>
        ))}
      </div>
      <div style={{ font: '700 28px/1.1 var(--font-sans)', color: 'var(--fg-1)', letterSpacing: '-0.04em', textAlign: 'center', marginBottom: 14 }}>불씨가 준비됐어요!</div>
      <div style={{ font: 'var(--body)', color: 'var(--fg-2)', textAlign: 'center', letterSpacing: '-0.02em', lineHeight: 1.6, marginBottom: 44 }}>
        지금부터 Ember와 함께<br/>스크린타임을 조금씩 조절해봐요.
      </div>
      <button onClick={onDone} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100%', height: 58, borderRadius: 18, border: 'none', cursor: 'pointer',
        background: 'var(--ember)', color: '#fff',
        font: '600 17px/1 var(--font-sans)', letterSpacing: '-0.03em',
        boxShadow: '0 4px 20px rgba(232,111,53,0.45)',
      }}>앱 시작하기</button>
    </div>
  );
}

/* ── Root ────────────────────────────────────────────────────────────────── */
function OnboardingApp({ onDone = () => {} }) {
  const [phase, setPhase] = useState('splash'); // splash|login|onboard|survey|done
  const [step, setStep] = useState(0);

  const goNext = () => {
    if (phase === 'splash') { setPhase('login'); return; }
    if (phase === 'login') { setPhase('onboard'); setStep(0); return; }
    if (phase === 'onboard') {
      if (step < STEPS.length - 1) { setStep(s => s + 1); return; }
      setPhase('survey'); return;
    }
    if (phase === 'survey') { setPhase('done'); return; }
  };

  const goBack = () => {
    if (phase === 'login')   { setPhase('splash'); return; }
    if (phase === 'onboard') {
      if (step > 0) { setStep(s => s - 1); return; }
      setPhase('login'); return;
    }
    if (phase === 'survey')  { setPhase('onboard'); setStep(STEPS.length - 1); return; }
  };

  return (
    <IOSDevice dark={false}>
      <div className="theme-light" style={{ height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', background: 'var(--bg)', paddingTop: 50, position: 'relative' }}>
        {phase === 'splash' && <SplashScreen onDone={goNext} />}
        {phase === 'login'  && <LoginScreen  onNext={goNext} />}
        {phase === 'onboard' && <OnboardStep stepIdx={step} onNext={goNext} onSkip={() => setPhase('survey')} onBack={goBack} />}
        {phase === 'survey' && <SurveyScreen onDone={goNext} onBack={goBack} />}
        {phase === 'done'   && <DoneScreen onDone={onDone} />}
      </div>
    </IOSDevice>
  );
}

Object.assign(window, { OnboardingApp });
