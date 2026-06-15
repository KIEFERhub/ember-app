/* Ember — LEAGUE tab → "리그 판".
   Not a flat ranking: ember-themed tiers + badges + promotion/relegation
   zones + an explicit scoring system. */

// Ember-themed tier ladder (low → high)
const TIERS = [
  { k: 'coal',    name: '잉걸',   color: '#8A3A1F' },
  { k: 'spark',   name: '불씨',   color: '#C7502A' },
  { k: 'camp',    name: '모닥불', color: '#E86F35' },
  { k: 'bonfire', name: '화톳불', color: '#F0A23E' },
  { k: 'beacon',  name: '봉화',   color: '#F4C76B' },
];
const tierBy = k => TIERS.find(t => t.k === k);

const BOARD = [
  { rank: 1, name: '김지민', tag: '프로 갓생러',       pts: 32, tier: 'beacon',  me: false, photoKey: 'photo1' },
  { rank: 2, name: '정해린', tag: '미라클 모닝러',     pts: 30, tier: 'beacon',  me: false, photoKey: 'photo2' },
  { rank: 3, name: '박도윤', tag: '조금만 더 힘내요!', pts: 28, tier: 'bonfire', me: true,  photoKey: 'photo3' },
  { rank: 4, name: '최서연', tag: '꾸준함의 대명사',   pts: 25, tier: 'bonfire', me: false, photoKey: 'photo4' },
  { rank: 5, name: '이준호', tag: '주말 집중러',       pts: 21, tier: 'camp',    me: false, photoKey: 'photo5' },
  { rank: 6, name: '한소미', tag: '천천히 가는 중',    pts: 17, tier: 'camp',    me: false, photoKey: null },
];

const SCORING = [
  { icon: I.bell,   label: '넛지 수락',        pts: '+2' },
  { icon: I.check,  label: '일일 목표 달성',   pts: '+5' },
  { icon: I.moon,   label: '수면 루틴 지키기', pts: '+3' },
  { icon: I.flame,  label: '주간 챌린지 완료', pts: '+10' },
];

// Per-person avatar colors (warm palette, not orange-dominant)
const AVATAR_PALETTE = [
  { from: '#5E8FBF', to: '#2A4E7A' },
  { from: '#BF7E5E', to: '#7A3E2A' },
  { from: '#5EBF8F', to: '#2A7A52' },
  { from: '#9E5EBF', to: '#5C2A7A' },
  { from: '#BF9E5E', to: '#7A5C2A' },
  { from: '#BF5E8F', to: '#7A2A52' },
];

function PlayerAvatar({ name, index, size = 40, photoKey }) {
  const photo = photoKey && window.__photos ? window.__photos[photoKey] : null;
  const c = AVATAR_PALETTE[index % AVATAR_PALETTE.length];
  if (photo) {
    return (
      <div style={{
        width: size, height: size, borderRadius: 9999, flexShrink: 0,
        overflow: 'hidden', border: '2px solid rgba(255,255,255,0.15)', background: '#222',
      }}>
        <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
      </div>
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: 9999, flexShrink: 0,
      background: `linear-gradient(140deg, ${c.from}, ${c.to})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', font: `700 ${Math.round(size * 0.42)}px/1 var(--font-sans)`,
      border: '2px solid rgba(255,255,255,0.12)', letterSpacing: 0,
    }}>{name.slice(0, 1)}</div>
  );
}

function TierBadge({ tier, size = 28 }) {
  const t = tierBy(tier);
  return (
    <div title={t.name} style={{
      width: size, height: size, borderRadius: 9, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `${t.color}22`, color: t.color,
    }}>
      <I.flame size={size * 0.6} />
    </div>
  );
}

function LeagueScreen() {
  const me = BOARD.find(b => b.me);
  const myTier = tierBy(me.tier);
  const [ladder, setLadder] = React.useState(false);

  return (
    <ScreenScroll>
      {/* League standing hero */}
      <Card tone="dark" radius={24} style={{ marginTop: 8, textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% -10%, rgba(232,111,53,0.18), transparent 60%)' }} />
        <button onClick={() => setLadder(true)} aria-label="리그 시스템 설명" style={{
          position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--fg-3)', padding: 2, display: 'flex', zIndex: 2,
        }}>
          <I.info size={22} stroke={1.9} />
        </button>
        <div style={{ position: 'relative' }}>
          <div style={{ font: 'var(--overline)', color: 'var(--fg-2)', marginBottom: 12 }}>이번 주 리그</div>
          <button onClick={() => setLadder(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 0 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: `${myTier.color}22`, color: myTier.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <I.flame size={36} />
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, font: 'var(--h1)', color: 'var(--fg-1)', whiteSpace: 'nowrap' }}>
              {myTier.name} 리그
            </div>
          </button>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 20 }}>
            {[['3위', '내 순위'], [`${me.pts}점`, '내 점수'], ['+4점', '승급까지']].map(([v, l]) => (
              <div key={l}>
                <div style={{ font: '700 22px/26px var(--font-num)', color: 'var(--ember)' }}>{v}</div>
                <div style={{ font: 'var(--caption)', color: 'var(--fg-2)', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Weekly challenge */}
      <Card tone="cream" style={{ marginTop: 16 }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 130, height: 130, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(232,111,53,0.24), rgba(232,111,53,0.03))' }} />
        <div style={{ position: 'relative' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--label)', color: 'var(--ember)', background: 'rgba(232,111,53,0.12)', padding: '6px 12px', borderRadius: 9999 }}>
            <I.shield size={15} stroke={2} />이번 주 챌린지
          </span>
          <div style={{ font: 'var(--h1)', color: 'var(--ink)', marginTop: 16, lineHeight: 1.25 }}>23시 이후<br />SNS 30분 이내</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 10px' }}>
            <span style={{ font: 'var(--caption)', color: 'var(--ink-2)' }}>44명이 함께 도전 중</span>
            <span style={{ font: 'var(--h3)', color: 'var(--ember)' }}>60%</span>
          </div>
          <Progress value={60} track="rgba(87,66,57,0.15)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
            <div style={{ display: 'flex' }}>
              {['#C7502A', '#E86F35', '#F0A23E'].map((c, i) => (
                <div key={i} style={{ width: 26, height: 26, borderRadius: 9999, background: c, border: '2px solid var(--cream)', marginLeft: i ? -8 : 0 }} />
              ))}
              <div style={{ width: 26, height: 26, borderRadius: 9999, background: 'var(--ink)', color: 'var(--cream)', border: '2px solid var(--cream)', marginLeft: -8, font: 'var(--overline)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+41</div>
            </div>
            <span style={{ font: 'var(--caption)', color: 'var(--ink-2)' }}>완료하면 <strong style={{ color: 'var(--ink)' }}>+10점</strong></span>
          </div>
        </div>
      </Card>

      {/* Leaderboard with promotion / relegation zones */}
      <div style={{ marginTop: 24 }}>
        <SectionTitle action="전체 보기">커뮤니티 리그</SectionTitle>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 4px 10px' }}>
          <I.arrowUp size={14} stroke={2.4} style={{ color: 'var(--positive)' }} />
          <span style={{ font: 'var(--caption)', color: 'var(--positive)', whiteSpace: 'nowrap' }}>승급권 · 상위 2명</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {BOARD.map((b, i) => {
            const t = tierBy(b.tier);
            const promo = b.rank <= 2;
            return (
              <React.Fragment key={b.rank}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 18,
                  background: b.me ? 'var(--ember-tint-10)' : 'var(--card-dark)',
                  border: b.me ? '1px solid var(--ember)' : '1px solid transparent',
                }}>
                  <div style={{ width: 22, textAlign: 'center', font: 'var(--h3)', color: promo ? 'var(--ember)' : 'var(--fg-2)' }}>{b.rank}</div>
                  <PlayerAvatar name={b.name} index={i} size={40} photoKey={b.photoKey} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ font: 'var(--body-strong)', color: 'var(--fg-1)' }}>{b.name}</span>
                      {b.me && <Badge tone="me">ME</Badge>}
                    </div>
                    <div style={{ font: 'var(--caption)', color: 'var(--fg-2)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.tag}</div>
                  </div>
                  <TierBadge tier={b.tier} size={26} />
                  <div style={{ textAlign: 'right', minWidth: 38 }}>
                    <div style={{ font: '700 18px/20px var(--font-num)', color: b.me ? 'var(--ember)' : 'var(--fg-1)' }}>{b.pts}</div>
                    <div style={{ font: 'var(--caption)', color: 'var(--fg-3)' }}>점</div>
                  </div>
                </div>
                {b.rank === 2 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '2px 4px' }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--hairline-dark)' }} />
                    <span style={{ font: 'var(--overline)', color: 'var(--fg-3)' }}>승급 라인</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--hairline-dark)' }} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Scoring system — clear rules */}
      <Card tone="deep" style={{ marginTop: 16 }}>
        <div style={{ font: 'var(--h3)', color: 'var(--fg-1)', marginBottom: 16 }}>점수는 이렇게 쌓여요</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {SCORING.map(s => {
            const Ico = s.icon;
            return (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--inset-strong)', color: 'var(--fg-2)' }}>
                  <Ico size={17} stroke={2} />
                </div>
                <span style={{ flex: 1, font: 'var(--body)', color: 'var(--fg-1)' }}>{s.label}</span>
                <span style={{ font: 'var(--body-strong)', color: 'var(--ember)' }}>{s.pts}</span>
              </div>
            );
          })}
        </div>
        <div style={{ font: 'var(--caption)', color: 'var(--fg-3)', marginTop: 16 }}>매주 일요일 자정에 리그가 정산되고, 상위 2명은 다음 티어로 승급해요.</div>
      </Card>

      {/* Social actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16, marginBottom: 8 }}>
        {[[I.userPlus, '친구 찾기'], [I.share, '초대 코드 공유']].map(([Ico, l]) => (
          <Card key={l} tone="dark" pad={20} radius={20} style={{ textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <Ico size={22} stroke={1.9} style={{ color: 'var(--ember)' }} />
            </div>
            <span style={{ font: 'var(--body-strong)', color: 'var(--fg-1)' }}>{l}</span>
          </Card>
        ))}
      </div>

      {ladder && <LeagueLadderSheet myTier={me.tier} onClose={() => setLadder(false)} />}
    </ScreenScroll>
  );
}

/* ── 리그 단계 둘러보기 — full ember tier ladder (high → low) ──
   Each tier: requirement (점수 구간), member count, short copy.
   Current tier highlighted; promotion/relegation rules explained. */
const TIER_META = {
  beacon:  { sub: 'Beacon',   range: '35점 이상', members: '1,240명', desc: '가장 환하게 타오르는 단계. 절제의 달인들이 모여요.' },
  bonfire: { sub: 'Bonfire',  range: '25–34점',   members: '4,860명', desc: '안정적으로 타오르는 단계. 꾸준함이 빛을 발해요.' },
  camp:    { sub: 'Campfire', range: '18–24점',   members: '9,310명', desc: '온기를 더해가는 중. 습관이 자리잡기 시작해요.' },
  spark:   { sub: 'Spark',    range: '10–17점',   members: '12,500명', desc: '막 타오르기 시작한 불씨. 가볍게 도전해봐요.' },
  coal:    { sub: 'Coal',     range: '0–9점',     members: '6,720명', desc: '조용히 빛나는 시작점. 누구나 여기서 출발해요.' },
};
const LADDER = ['beacon', 'bonfire', 'camp', 'spark', 'coal']; // high → low

function LeagueLadderSheet({ myTier, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(2px)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: 'var(--surface-1)', borderRadius: '28px 28px 0 0',
        padding: '14px 20px 32px', maxHeight: '90%', overflowY: 'auto', boxShadow: 'var(--shadow-pop)',
      }}>
        <div style={{ width: 40, height: 5, borderRadius: 9999, background: 'var(--hairline-dark)', margin: '0 auto 18px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <div>
            <div style={{ font: 'var(--h1)', color: 'var(--fg-1)' }}>리그 단계</div>
            <div style={{ font: 'var(--body)', color: 'var(--fg-2)', marginTop: 4 }}>불씨가 자랄수록 더 높은 리그로 올라가요.</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--fg-2)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4, flexShrink: 0 }}>
            <I.plus size={24} stroke={1.8} style={{ transform: 'rotate(45deg)' }} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
          {LADDER.map((k, i) => {
            const t = tierBy(k);
            const m = TIER_META[k];
            const mine = k === myTier;
            return (
              <React.Fragment key={k}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: 16, borderRadius: 18,
                  background: mine ? 'var(--ember-tint-10)' : 'var(--card-dark)',
                  border: mine ? '1px solid var(--ember)' : '1px solid transparent',
                }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0, background: `${t.color}22`, color: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <I.flame size={26} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ font: 'var(--h3)', color: 'var(--fg-1)' }}>{t.name}</span>
                      <span style={{ font: 'var(--overline)', letterSpacing: '0.04em', color: 'var(--fg-3)' }}>{m.sub.toUpperCase()}</span>
                      {mine && <Badge tone="me">현재</Badge>}
                    </div>
                    <div style={{ font: 'var(--caption)', color: 'var(--fg-2)', marginTop: 3, textWrap: 'pretty' }}>{m.desc}</div>
                    <div style={{ font: 'var(--caption)', color: 'var(--fg-3)', marginTop: 6 }}>{m.members} 참여 중</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ font: 'var(--body-strong)', color: mine ? 'var(--ember)' : 'var(--fg-1)', whiteSpace: 'nowrap' }}>{m.range}</div>
                    <div style={{ font: 'var(--caption)', color: 'var(--fg-3)', marginTop: 4 }}>주간 점수</div>
                  </div>
                </div>
                {i < LADDER.length - 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--fg-3)', margin: '-2px 0' }}>
                    <I.arrowUp size={16} stroke={2.2} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 18, padding: 16, background: 'var(--inset)', borderRadius: 16 }}>
          <I.shield size={20} stroke={2} style={{ color: 'var(--ember)', flexShrink: 0, marginTop: 1 }} />
          <div style={{ font: 'var(--body)', color: 'var(--fg-2)', textWrap: 'pretty' }}>
            매주 일요일 자정에 정산해요. 리그 안에서 <strong style={{ color: 'var(--fg-1)' }}>상위 2명은 승급</strong>, 하위 2명은 한 단계 내려가요.
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LeagueScreen, LeagueLadderSheet, TierBadge, TIERS, BOARD });
