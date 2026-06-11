import { FILMS } from '../lib/data'

export default function FilmPanel({ activeFilmId, onSelectFilm, onAddFilm }) {
  return (
    <div style={{
      position: 'absolute', left: 0, top: 44, bottom: 0, width: 220,
      background: '#161714', borderRight: '0.5px solid #2A2B27',
      display: 'flex', flexDirection: 'column', zIndex: 50,
    }}>
      <div style={{ padding: '14px 14px 10px', flex: 1 }}>
        <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', color: '#4A4A46', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
          Films
        </div>
        {FILMS.map(film => (
          <div
            key={film.id}
            onClick={() => onSelectFilm(film.id)}
            style={{
              background: activeFilmId === film.id ? '#1E1F1B' : 'transparent',
              border: `0.5px solid ${activeFilmId === film.id ? film.color + '66' : '#2A2B27'}`,
              borderRadius: 6, padding: '10px 12px', marginBottom: 6, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', marginTop: 3, flexShrink: 0,
                background: film.status === 'active' ? film.color : '#3A3B36',
                ...(film.status === 'active' ? { boxShadow: `0 0 6px ${film.color}` } : {})
              }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#E8E6DC', lineHeight: 1.3 }}>{film.title}</div>
                <div style={{ fontSize: 11, color: '#4A4A46', marginTop: 2 }}>{film.year}</div>
                <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', color: '#4A4A46', marginTop: 4 }}>
                  {film.status === 'active'
                    ? <span style={{ color: film.color }}>5 pipelines active</span>
                    : <span>idle</span>
                  }
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={onAddFilm}
          style={{
            width: '100%', padding: '8px', marginTop: 4,
            background: 'transparent', border: '0.5px dashed #3A3B36',
            borderRadius: 6, color: '#4A4A46',
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, cursor: 'pointer',
            letterSpacing: '0.03em', textAlign: 'center',
          }}
        >
          + add film
        </button>
      </div>
      <div style={{ borderTop: '0.5px solid #2A2B27', padding: '14px' }}>
        <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', color: '#4A4A46', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
          Blueprint
        </div>
        <div style={{ fontSize: 11, color: '#4A4A46', lineHeight: 1.6, marginBottom: 10 }}>
          Paste a press kit and the factory auto-configures all pipeline parameters.
        </div>
        <button
          onClick={onAddFilm}
          style={{
            width: '100%', padding: '7px',
            background: '#1E1F1B', border: '0.5px solid #3A3B36',
            borderRadius: 6, color: '#8A8880',
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, cursor: 'pointer',
            letterSpacing: '0.03em', textAlign: 'center',
          }}
        >
          configure from brief ↗
        </button>
      </div>
    </div>
  )
}
