/* Ember — REPORT tab → "AI 리포트".
   Merges the old separate "AI 인사이트" + "이용 리포트" into one AI-led report.
   Heatmap uses the flame spectrum (pale gold → orange → deep red). */

const FLAME_SCALE = ['var(--flame-0)', '#FDEBD5', '#F9C19A', '#F0A23E', '#E86F35', '#C7502A', '#8A3A1F'];

// 4 rows × 7 days, intensity 0–6  (행 순서: 새벽→아침→점심→저녁)
const HEAT = [
  [0, 1, 0, 0, 1, 0, 0],
  [2, 4, 3, 5, 4, 2, 1],
  [4, 5, 4, 6, 5, 3, 2],
  [3, 2, 4, 3, 3, 1, 5],
];
const HEAT_ROWS = ['새벽', '아침', '점심', '저녁'];
const HEAT_DAYS = ['월', '화', '수', '목', '금', '토', '일'];

const statCardStyle = {
  background: 'var(--card-dark)', borderRadius: 20, padding: 20, border: 'none',
  cursor: 'pointer', textAlign: 'left', display: 'block', width: '100%',
  boxShadow: 'var(--shadow-card)', font: 'inherit',
};

// daily totals (min) — wide spread so bars show real variance
const WEEK_TOTAL = [248, 152, 294, 118, 206, 98, 172];
const WEEK_DAY = ['월', '화', '수', '목', '금', '토', '일'];
const TOP_APPS = [
  { brand: 'youtube',     name: 'YouTube',   min: 320 },
  { brand: 'instagram',   name: 'Instagram', min: 246 },
  { brand: 'kakaotalk',   name: 'KakaoTalk', min: 184 },
  { brand: 'tiktok',      name: 'TikTok',    min: 142 },
  { brand: 'netflix',     name: 'Netflix',   min: 122 },
  { brand: 'spotify',     name: 'Spotify',   min: 96 },
  { brand: 'x',           name: 'X',         min: 78 },
  { brand: 'naver',       name: 'Naver',     min: 64 },
  { brand: 'discord',     name: 'Discord',   min: 52 },
  { brand: 'googlechrome', name: 'Chrome',   min: 41 },
];

function ReportScreen({ onNavigate, onOpenWeekUsage, score = 72 }) {
  const st = flameStateFor(score);
  return (
    <ScreenScroll>
      {/* Title — single AI report header (no hard "사용 보고서" label) */}
      <div style={{ padding: '14px 0 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <I.sparkle size={26} style={{ color: 'var(--ember)' }} />
          <h1 style={{ margin: 0, font: 'var(--h1)', color: 'var(--fg-1)', letterSpacing: '-0.01em' }}>AI 리포트</h1>
        </div>
        <p style={{ margin: '8px 0 0', font: 'var(--body)', color: 'var(--fg-2)' }}>이번 주 당신의 불씨를 읽었어요.</p>
      </div>

      {/* Hero AI insight (cream) — ties to flame state */}
      <Card tone="cream">
        <div style={{ position: 'absolute', right: -30, top: -30, width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(232,111,53,0.24), rgba(232,111,53,0.03))' }} />
        <div style={{ position: 'relative', display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
          <div style={{ flexShrink: 0 }}><FlameState score={score} size={46} /></div>
          <div>
            <div style={{ font: 'var(--overline)', letterSpacing: '0.06em', color: 'var(--ember)' }}>이번 달 · 성장기</div>
            <div style={{ font: 'var(--h3)', color: 'var(--ink)', marginTop: 3 }}>불씨가 점점 안정되고 있어요</div>
          </div>
        </div>
        <p style={{ margin: 0, font: 'var(--body)', color: 'var(--ink-2)', position: 'relative' }}>
          스크린 타임을 잘 조절하고 있어요. 특히 <strong style={{ color: 'var(--ink)' }}>오후 시간대</strong>의 절제가 불씨를 ‘{st.label}’ 상태로 지켜주고 있어요.
        </p>
      </Card>

      {/* Heatmap — flame spectrum, with day & time-of-day axis labels */}
      <Card tone="dark" pad={20} radius={20} style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <span style={{ font: 'var(--h2)', color: 'var(--fg-1)', letterSpacing: '-0.025em' }}>사용 히트맵</span>
        </div>

        {/* 세로축: 시간대 + 셀 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {HEAT.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 30, flexShrink: 0, font: '500 11px/1 var(--font-sans)', color: 'var(--fg-3)', textAlign: 'right' }}>
                {HEAT_ROWS[ri]}
              </div>
              {row.map((v, ci) => (
                <div key={ci} style={{ flex: 1, height: 32, borderRadius: 9, background: FLAME_SCALE[v] }} />
              ))}
            </div>
          ))}
        </div>

        {/* 가로축: 요일 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 6 }}>
          <div style={{ width: 30, flexShrink: 0 }} />
          {HEAT_DAYS.map(d => (
            <div key={d} style={{ flex: 1, textAlign: 'center', font: '500 11px/1 var(--font-sans)', color: 'var(--fg-3)' }}>{d}</div>
          ))}
        </div>

        {/* legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
          <span style={{ font: 'var(--caption)', color: 'var(--fg-3)' }}>적음</span>
          <div style={{ display: 'flex', gap: 3 }}>
            {FLAME_SCALE.slice(1).map((c, i) => <span key={i} style={{ width: 18, height: 11, borderRadius: 3, background: c, display: 'inline-block' }} />)}
          </div>
          <span style={{ font: 'var(--caption)', color: 'var(--fg-3)' }}>많음</span>
        </div>
      </Card>

      {/* 이번 주 총 사용 + 최다 사용 앱 — 한 카드에 나란히 */}
      <button onClick={onOpenWeekUsage} style={{ ...statCardStyle, padding: 20, marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ font: 'var(--caption)', color: 'var(--fg-2)', letterSpacing: '-0.02em' }}>이번 주 사용 요약</span>
          <I.chevR size={15} stroke={2.2} style={{ color: 'var(--fg-3)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 0, alignItems: 'center' }}>
          {/* 이번 주 총 사용 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <I.clock size={16} stroke={2} style={{ color: 'var(--ember)' }} />
              <span style={{ font: 'var(--caption)', color: 'var(--fg-2)', letterSpacing: '-0.02em' }}>이번 주 총 사용</span>
            </div>
            <div style={{ font: '700 26px/30px var(--font-num)', color: 'var(--fg-1)', letterSpacing: '-0.04em' }}>20h 1m</div>
            <div style={{ font: 'var(--caption)', color: 'var(--positive)', marginTop: 7, display: 'flex', alignItems: 'center', gap: 2 }}>
              <I.arrowDown size={12} stroke={2.4} />지난주 대비 12%
            </div>
          </div>
          {/* 구분선 */}
          <div style={{ width: 1, height: 56, background: 'var(--hairline-dark)', margin: '0 18px' }} />
          {/* 최다 사용 앱 */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <I.star size={16} stroke={1.8} style={{ color: 'var(--ember)' }} />
              <span style={{ font: 'var(--caption)', color: 'var(--fg-2)', letterSpacing: '-0.02em' }}>최다 사용 앱</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AppIcon slug="youtube" bg={APP_BRANDS.youtube.bg} fg={APP_BRANDS.youtube.fg} size={38} radius={11} />
              <div>
                <div style={{ font: '600 15px/18px var(--font-sans)', color: 'var(--fg-1)', letterSpacing: '-0.02em' }}>YouTube</div>
                <div style={{ font: '700 14px/18px var(--font-num)', color: 'var(--fg-2)', marginTop: 3, letterSpacing: '-0.02em' }}>5h 20m</div>
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* 감정 기록 */}
      <button onClick={() => onNavigate('mood')} style={{ ...statCardStyle, padding: 20, marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <I.calendar size={17} stroke={1.9} style={{ color: 'var(--ember)' }} />
            <span style={{ font: 'var(--caption)', color: 'var(--fg-2)' }}>감정 기록</span>
          </div>
          <I.chevR size={16} stroke={2.2} style={{ color: 'var(--fg-3)' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
            <span style={{ font: '700 24px/28px var(--font-num)', color: 'var(--fg-1)', letterSpacing: '-0.04em' }}>6일</span>
            <span style={{ font: 'var(--caption)', color: 'var(--fg-2)' }}>/ 이번 주</span>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {['😌', '😄', '😐', '😌', '😮‍💨', '😄'].map((e, i) => (
              <span key={i} style={{ fontSize: 17, lineHeight: 1 }}>{e}</span>
            ))}
          </div>
        </div>
      </button>

      {/* Mood × usage correlation */}
      <Card tone="dark" radius={20} style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <I.brain size={24} style={{ color: 'var(--ember)' }} />
          <span style={{ font: 'var(--h2)', color: 'var(--fg-1)', whiteSpace: 'nowrap' }}>기분과 사용 패턴</span>
        </div>
        <div style={{ background: 'var(--inset)', borderRadius: 16, padding: 18 }}>
          <p style={{ margin: 0, font: 'var(--h3)', color: 'var(--fg-1)' }}>스트레스 지수가 높을 때<br />유튜브 사용량이 1.5배 증가</p>
          <p style={{ margin: '12px 0 0', font: 'var(--body)', color: 'var(--fg-2)' }}>
            기분이 저조할 때 도파민 위주의 콘텐츠 소비 경향이 뚜렷해요. 다음엔 ‘집중 모드’를 켜보는 건 어떨까요?
          </p>
        </div>
      </Card>
    </ScreenScroll>
  );
}

function fmtH(m) {
  const h = Math.floor(m / 60), mm = m % 60;
  return h ? `${h}h ${mm}m` : `${mm}m`;
}

/* 이번 주 총 사용 상세 — daily bars + top apps */
function UsageDetailSheet({ onClose }) {
  const max = Math.max(...WEEK_TOTAL);
  const total = WEEK_TOTAL.reduce((a, b) => a + b, 0);
  const maxApp = Math.max(...TOP_APPS.map(a => a.min));
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', backdropFilter: 'blur(2px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: 'var(--surface-1)', borderRadius: 28,
        padding: '26px 22px 28px', boxShadow: 'var(--shadow-pop)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ font: 'var(--h1)', color: 'var(--fg-1)', letterSpacing: '-0.03em' }}>이번 주 총 사용</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', borderRadius: 9999, color: 'var(--fg-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 4 }}>
            <I.plus size={24} stroke={1.8} style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
          <span style={{ font: '700 28px/1 var(--font-num)', color: 'var(--ember)' }}>{fmtH(total)}</span>
          <span style={{ font: 'var(--caption)', color: 'var(--positive)', display: 'inline-flex', alignItems: 'center', gap: 1 }}>
            <I.arrowDown size={13} stroke={2.4} />지난주 대비 12%
          </span>
        </div>

        {/* daily bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, marginTop: 22 }}>
          {WEEK_TOTAL.map((v, i) => {
            const today = i === WEEK_TOTAL.length - 1;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ font: '500 10px/1 var(--font-num)', color: 'var(--fg-3)', marginBottom: 5 }}>{fmtH(v)}</span>
                <div style={{ width: '70%', height: `${(v / max) * 100}%`, borderRadius: 7, background: today ? 'var(--ember)' : 'var(--ember-soft)' }} />
                <span style={{ font: '500 11px/1 var(--font-sans)', color: today ? 'var(--ember)' : 'var(--fg-3)', marginTop: 8 }}>{WEEK_DAY[i]}</span>
              </div>
            );
          })}
        </div>

        {/* top apps — list scrolls, card stays centered */}
        <div style={{ font: 'var(--overline)', letterSpacing: '0.06em', color: 'var(--fg-3)', margin: '26px 0 12px' }}>가장 많이 쓴 앱</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 196, overflowY: 'auto', margin: '0 -4px', padding: '2px 4px' }}>
          {TOP_APPS.map(a => (
            <div key={a.brand} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AppIcon slug={a.brand} bg={APP_BRANDS[a.brand].bg} fg={APP_BRANDS[a.brand].fg} size={38} radius={11} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ font: 'var(--body-strong)', color: 'var(--fg-1)' }}>{a.name}</span>
                  <span style={{ font: '600 13px/1 var(--font-num)', color: 'var(--fg-2)' }}>{fmtH(a.min)}</span>
                </div>
                <Progress value={(a.min / maxApp) * 100} height={6} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ReportScreen, UsageDetailSheet, FLAME_SCALE });
