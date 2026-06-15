/* Ember — UI primitives. Unified button hierarchy + cards + chips.
   Button hierarchy (same level → same shape):
     primary   = filled ember, the one main action per view
     secondary = dark capsule, supporting action
     tertiary  = text only, low-emphasis
*/

function Button({ variant = 'primary', size = 'md', children, icon, full, onClick, style }) {
  const [press, setPress] = React.useState(false);
  const pads = { sm: '0 14px', md: '0 20px', lg: '0 24px' };
  const heights = { sm: 32, md: 44, lg: 56 };
  const fonts = { sm: 'var(--caption)', md: 'var(--body-strong)', lg: 'var(--h3)' };
  const base = {
    height: heights[size], padding: pads[size], borderRadius: 9999,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    font: fonts[size], border: 'none', cursor: 'pointer', width: full ? '100%' : 'auto',
    transition: 'transform .15s cubic-bezier(.4,0,.2,1), filter .15s, background .15s',
    transform: press ? 'scale(0.97)' : 'scale(1)', whiteSpace: 'nowrap',
  };
  const variants = {
    primary:   { background: 'var(--ember)', color: 'var(--on-ember)', fontWeight: 700, filter: press ? 'brightness(0.92)' : 'none', boxShadow: '0 2px 12px -2px rgba(232,112,58,0.45)' },
    secondary: { background: 'var(--surface-2)', color: 'var(--fg-1)', filter: press ? 'brightness(1.25)' : 'none' },
    tertiary:  { background: 'transparent', color: 'var(--ember)', filter: press ? 'brightness(0.85)' : 'none', padding: '0 6px' },
    ghostCream:{ background: 'var(--ink)', color: 'var(--cream)', filter: press ? 'brightness(1.15)' : 'none' },
  };
  return (
    <button onClick={onClick}
      onPointerDown={() => setPress(true)} onPointerUp={() => setPress(false)} onPointerLeave={() => setPress(false)}
      style={{ ...base, ...variants[variant], ...style }}>
      {icon}{children}
    </button>
  );
}

function Card({ tone = 'dark', children, style, pad = 24, radius = 24, onClick }) {
  const tones = {
    dark: {
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      border: '1px solid var(--glass-border)',
      color: 'var(--fg-1)',
    },
    deep: {
      background: 'var(--surface-2)',
      border: '1px solid var(--hairline-dark)',
      color: 'var(--fg-1)',
    },
    cream: {
      background: 'var(--cream)',
      border: '1px solid var(--hairline-dark)',
      color: 'var(--ink)',
    },
    ember: { background: 'var(--ember)', color: 'var(--on-ember)' },
  };
  return (
    <div onClick={onClick} style={{
      borderRadius: radius, padding: pad,
      boxShadow: 'var(--shadow-card)',
      position: 'relative', overflow: 'hidden', ...tones[tone], ...style,
    }}>{children}</div>
  );
}

/* selectable chip — used for app groups, mood, filters */
function Chip({ active, children, onClick, icon }) {
  return (
    <button onClick={onClick} style={{
      height: 38, padding: '0 16px', borderRadius: 9999, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
      font: 'var(--label)', transition: 'all .15s cubic-bezier(.4,0,.2,1)',
      border: active ? '1px solid transparent' : '1px solid var(--hairline-dark)',
      background: active ? 'var(--ember)' : 'transparent',
      color: active ? 'var(--on-ember)' : 'var(--fg-2)',
    }}>{icon}{children}</button>
  );
}

function SectionTitle({ children, action, onAction, color = 'var(--fg-1)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <h2 style={{ margin: 0, font: 'var(--h1)', letterSpacing: '-0.01em', color, whiteSpace: 'nowrap' }}>{children}</h2>
      {action && (
        <button onClick={onAction} style={{
          background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 2,
          font: 'var(--label)', color: 'var(--fg-2)', padding: 0,
        }}>{action}<I.chevR size={15} stroke={2.2} /></button>
      )}
    </div>
  );
}

/* icon in a soft tinted square — the recurring "icon chip" pattern */
function IconChip({ icon, tone = 'ember', size = 40 }) {
  const tones = {
    ember: { background: 'var(--ember-tint-10)', color: 'var(--ember)' },
    cream: { background: 'rgba(232,111,53,0.12)', color: 'var(--ember)' },
    solid: { background: 'var(--ember)', color: '#fff' },
    dark:  { background: 'var(--inset-strong)', color: 'var(--fg-2)' },
  };
  return (
    <div style={{
      width: size, height: size, borderRadius: 12, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center', ...tones[tone],
    }}>{icon}</div>
  );
}

function Progress({ value, track = 'var(--track)', fill = 'var(--ember)', height = 8 }) {
  return (
    <div style={{ width: '100%', height, borderRadius: 9999, background: track, overflow: 'hidden' }}>
      <div style={{ width: `${Math.max(0, Math.min(100, value))}%`, height: '100%', borderRadius: 9999, background: fill, transition: 'width .4s cubic-bezier(.4,0,.2,1)' }} />
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width: 52, height: 30, borderRadius: 9999, border: 'none', cursor: 'pointer', padding: 3,
      background: on ? 'var(--ember)' : 'var(--toggle-off)', transition: 'background .2s',
      display: 'flex', justifyContent: on ? 'flex-end' : 'flex-start',
    }}>
      <span style={{ width: 24, height: 24, borderRadius: 9999, background: '#fff', transition: 'all .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
    </button>
  );
}

function Badge({ children, tone = 'ember' }) {
  const tones = {
    ember: { background: 'var(--ember)', color: 'var(--on-ember)' },
    soft:  { background: 'var(--ember-tint-10)', color: 'var(--ember)' },
    me:    { background: 'var(--ember)', color: '#fff' },
  };
  return <span style={{ font: 'var(--overline)', letterSpacing: '0.04em', padding: '3px 8px', borderRadius: 7, ...tones[tone] }}>{children}</span>;
}

Object.assign(window, { Button, Card, Chip, SectionTitle, IconChip, Progress, Toggle, Badge });
