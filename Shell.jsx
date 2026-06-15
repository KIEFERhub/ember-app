/* Ember — App shell: brand header + bottom tab bar */

// 공식 로고 — 업로드된 SVG에서 추출한 실제 경로
const LOGO_FLAME = "M893.78,347.03c-1.97-1.95-2.51-4.38-2.01-6.93.9-4.63,1.58-9.15,1.86-13.84.06-.97.47-1.79,1.34-2.08.73-.24,1.8-.16,2.38.53,3.93,4.66,7.19,9.7,9.8,15.2,3.58,7.55,5.43,15.54,4.43,23.87-.03.23.38.85.6.77l.81-.29c4.74-7.97,6.61-17.07,5.49-26.28-1.71-15.12-9.84-31.09-19.15-43.09-2.74-3.52-5.65-6.64-8.91-9.65-.53-.49-1.44-.5-2.03-.19s-.78.95-.85,1.76c-.69,8.93-3.96,17.35-9.1,24.74-2.78,3.99-5.89,7.49-9.28,10.98l-6.86,7.04c-2.4,2.46-4.31,5.11-5.99,8.1-3.73,6.61-4.76,14.35-2.49,21.61,4.21,13.46,19.8,21.45,33.52,17.93,8.06-2.07,14.85-8.37,14.5-16.68-.14-3.47-1.58-6.56-3.75-9.26l-4.31-4.25h0ZM908.46,388.75c-16.82,10-36.11,7.77-51.94-3.09-22.65-15.55-31.16-46.2-12.39-67.92,2.6-3.01,5.46-5.53,8.44-8.17l6.45-5.72c12.03-11.25,16.35-25.63,15.98-41.69-.03-1.19.3-2.21,1.16-2.84.85-.64,2.18-.97,3.26-.54,2.29.92,4.35,2.08,6.5,3.4,6.79,4.19,12.97,9.17,18.61,14.81,12.29,12.28,22.65,28.12,27.79,44.61,1.68,5.39,2.67,10.77,3.03,16.37,1.33,20.44-9.01,40.15-26.89,50.78h0Z";
const LOGO_VB = "818 250 125 155";

function Header({ onProfile, onBell, unread = true }) {
  return (
    <div style={{
      height: 56, padding: '0 20px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', flexShrink: 0,
      background: 'transparent',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <svg width="14" height="17" viewBox={LOGO_VB} style={{ color: 'var(--ember)' }}>
          <path fill="currentColor" fillRule="nonzero" d={LOGO_FLAME} />
        </svg>
        <span style={{ font: '700 20px/1 var(--font-sans)', color: 'var(--ember)' }}>Ember</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button onClick={onBell} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-1)', padding: 6 }}>
          <I.bell size={22} stroke={1.9} />
          {unread && <span style={{ position: 'absolute', top: 5, right: 6, width: 8, height: 8, borderRadius: 9999, background: 'var(--ember)', border: '2px solid var(--bg)' }} />}
        </button>
        <button onClick={onProfile} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-1)', padding: 6 }}>
          <I.user size={22} stroke={1.9} />
        </button>
      </div>
    </div>
  );
}

/* Overlay screen top bar — back chevron + centered title (MyPage, Notifications) */
function SubHeader({ title, onBack, action }) {
  return (
    <div style={{
      height: 56, padding: '0 12px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', flexShrink: 0, background: 'var(--bg)',
    }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-1)', padding: 8, display: 'flex' }}>
        <Icon d="M15 5l-7 7 7 7" size={24} stroke={2.2} />
      </button>
      <span style={{ font: 'var(--h3)', color: 'var(--fg-1)', whiteSpace: 'nowrap' }}>{title}</span>
      <div style={{ minWidth: 40, display: 'flex', justifyContent: 'flex-end' }}>{action}</div>
    </div>
  );
}

const TABS = [
  { key: 'home',   label: '홈',     icon: I.home },
  { key: 'report', label: '리포트', icon: I.report },
  { key: 'sleep',  label: '수면',   icon: I.moon },
  { key: 'league', label: '리그',   icon: I.trophy },
];

function TabBar({ active, onChange }) {
  return (
    <div style={{
      flexShrink: 0,
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(28px)',
      WebkitBackdropFilter: 'blur(28px)',
      borderTop: '1px solid var(--glass-border)',
      borderRadius: '20px 20px 0 0',
      padding: '12px 24px 28px', display: 'flex', justifyContent: 'space-between',
      boxShadow: '0 -1px 20px rgba(0,0,0,0.30)',
    }}>
      {TABS.map(t => {
        const on = active === t.key;
        const Ico = t.icon;
        return (
          <button key={t.key} onClick={() => onChange(t.key)} style={{
            background: 'none', border: 'none', cursor: 'pointer', flex: 1,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
            color: on ? 'var(--ember)' : 'var(--fg-2)', transition: 'color .15s',
          }}>
            <Ico size={22} stroke={2} />
            <span style={{ font: 'var(--caption)', color: on ? 'var(--ember)' : 'var(--fg-2)' }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, { Header, SubHeader, TabBar, TABS, LOGO_FLAME, LOGO_VB });
