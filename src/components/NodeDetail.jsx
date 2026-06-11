const STATUS_CONFIG = {
  idle:    { label: 'Idle',     color: '#4A4A46', bg: '#1E1F1B' },
  running: { label: 'Running',  color: '#EF9F27', bg: '#854F0B22' },
  done:    { label: 'Complete', color: '#5CAF2A', bg: '#2A501022' },
  waiting: { label: 'Waiting',  color: '#378ADD', bg: '#185FA522' },
}

const IO = {
  'film-brief':      'Output: film profile JSON → all pipeline nodes',
  'auto-configure':  'In: film profile → Out: search params, region filters, theme tags',
  'lead-scraper':    'In: search params → Out: contacts (name, institution, email, type)',
  'deduplicator':    'In: raw leads + sent log → Out: deduplicated lead list',
  'email-drafter':   'In: lead list + film profile → Out: draft emails per contact',
  'approval-queue':  'In: draft emails → Out: approved sends (human action required)',
  'sent-log':        'In: confirmed sends → Out: contact ledger, follow-up triggers',
  'press-list':      'In: film themes + awards → Out: journalist contacts by beat',
  'pitch-drafter':   'In: journalist + film profile → Out: tailored pitch email',
  'followup':        'In: sent log → Out: follow-up queue after 5 days',
  'coverage-log':    'In: confirmed coverage → Out: clip archive, pickup count',
  'partner-finder':  'In: themes + regions → Out: NGO and venue contacts',
  'screening-draft': 'In: partner + film profile → Out: screening enquiry email',
  'event-tracker':   'In: confirmed screenings → Out: event calendar, status log',
  'impact-report':   'In: event log + coverage → Out: reach and impact summary',
  'grant-finder':    'In: film stage + themes → Out: open grants list with deadlines',
  'loi-drafter':     'In: grant + film profile → Out: letter of inquiry draft',
  'deadline-tracker':'In: grant list → Out: deadline calendar and alerts',
  'awards-log':      'In: grant outcomes → Out: received / pending / declined log',
  'dist-finder':     'In: rights + territories → Out: distributor and platform contacts',
  'deal-pitch':      'In: distributor + film profile → Out: tailored deal pitch',
  'deal-tracker':    'In: pitches sent → Out: negotiation status, deal terms',
  'revenue-log':     'In: signed deals → Out: royalty and advance tracking',
}

export default function NodeDetail({ node, pipeline, status, film, onClose, onRun }) {
  if (!node || !pipeline) return null
  const st = STATUS_CONFIG[status] || STATUS_CONFIG.idle
  const canRun = status === 'idle' || status === 'waiting'
  const isHuman = node.engine === 'human'

  return (
    <div style={{
      position: 'absolute', right: 0, top: 44, bottom: 0, width: 280,
      background: '#161714', borderLeft: '0.5px solid #2A2B27',
      display: 'flex', flexDirection: 'column', zIndex: 50,
    }}>
      <div style={{ padding: '14px 16px', borderBottom: '0.5px solid #2A2B27', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', color: '#4A4A46', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
            {pipeline.label}
          </div>
          <div style={{ fontSize: 15, fontWeight: 500, color: '#E8E6DC' }}>{node.title}</div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#4A4A46', cursor: 'pointer', fontSize: 18, padding: 2 }}>
          <i className="ti ti-x" aria-hidden="true" />
        </button>
      </div>

      <div style={{ padding: '10px 16px', borderBottom: '0.5px solid #2A2B27' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: st.bg, border: `0.5px solid ${st.color}44`,
          borderRadius: 4, padding: '4px 8px',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: st.color }} />
          <span style={{ fontSize: 11, fontFamily: 'IBM Plex Mono, monospace', color: st.color, letterSpacing: '0.03em' }}>
            {st.label}
          </span>
        </div>
      </div>

      <div style={{ padding: '14px 16px', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: 12, color: '#8A8880', lineHeight: 1.7, marginBottom: 16 }}>
          {node.description}
        </div>
        {film && (
          <div style={{ background: '#1E1F1B', borderRadius: 6, padding: '10px 12px', marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', color: '#4A4A46', letterSpacing: '0.06em', marginBottom: 6 }}>ACTIVE FILM</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#E8E6DC' }}>{film.title}</div>
            <div style={{ fontSize: 11, color: '#4A4A46', marginTop: 2 }}>{film.year} · {film.directors}</div>
          </div>
        )}
        <div>
          <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono, monospace', color: '#4A4A46', letterSpacing: '0.06em', marginBottom: 8 }}>
            INPUTS / OUTPUTS
          </div>
          <div style={{ fontSize: 11, color: '#8A8880', lineHeight: 1.8 }}>
            {IO[node.id] || 'See pipeline documentation.'}
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 16px', borderTop: '0.5px solid #2A2B27' }}>
        {isHuman ? (
          <div style={{ fontSize: 11, color: '#4A4A46', fontFamily: 'IBM Plex Mono, monospace', textAlign: 'center', padding: '6px 0' }}>
            human step — no automation
          </div>
        ) : canRun ? (
          <button
            onClick={() => onRun(node, pipeline, film)}
            style={{
              width: '100%', padding: '9px 16px',
              background: pipeline.color + '22',
              border: `0.5px solid ${pipeline.color}`,
              borderRadius: 6, color: pipeline.color,
              fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, cursor: 'pointer',
              letterSpacing: '0.03em',
            }}
          >
            run node ▶
          </button>
        ) : status === 'running' ? (
          <div style={{ textAlign: 'center', fontSize: 11, fontFamily: 'IBM Plex Mono, monospace', color: '#EF9F27', padding: '6px 0' }}>
            running…
          </div>
        ) : (
          <div style={{ textAlign: 'center', fontSize: 11, fontFamily: 'IBM Plex Mono, monospace', color: '#5CAF2A', padding: '6px 0' }}>
            ✓ complete
          </div>
        )}
      </div>
    </div>
  )
}
