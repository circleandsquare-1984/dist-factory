import { PIPELINE_DEFS } from '../lib/data'

export default function Topbar({ activePipeline, onSelectPipeline, activeFilm }) {
  return (
    <div style={{
      height: 44, background: '#161714', borderBottom: '0.5px solid #2A2B27',
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 6,
      flexShrink: 0, zIndex: 100,
    }}>
      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 13, color: '#E8E6DC', letterSpacing: '0.04em', marginRight: 8 }}>
        DIST_FACTORY
      </div>
      <div style={{ width: 1, height: 20, background: '#2A2B27', marginRight: 6 }} />
      <button
        onClick={() => onSelectPipeline('all')}
        style={tabStyle(activePipeline === 'all', null)}
      >
        all pipelines
      </button>
      {PIPELINE_DEFS.map(p => (
        <button
          key={p.id}
          onClick={() => onSelectPipeline(p.id)}
          style={tabStyle(activePipeline === p.id, p.color)}
        >
          {p.shortLabel}
        </button>
      ))}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
        {activeFilm && (
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#4A4A46' }}>
            blueprint: <span style={{ color: '#8A8880' }}>{activeFilm.id}_v1</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#5CAF2A', boxShadow: '0 0 6px #5CAF2A',
            animation: 'pulse 2s infinite',
          }} />
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#8A8880' }}>live</span>
        </div>
      </div>
    </div>
  )
}

function tabStyle(active, color) {
  return {
    fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, padding: '4px 10px',
    borderRadius: 4, border: `0.5px solid ${active ? (color || '#EF9F27') : '#2A2B27'}`,
    background: active ? (color ? color + '22' : '#854F0B22') : 'transparent',
    color: active ? (color || '#EF9F27') : '#4A4A46',
    cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.03em',
  }
}
