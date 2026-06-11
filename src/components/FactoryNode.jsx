import { Handle, Position } from 'reactflow'

const ENGINE_STYLES = {
  claude: { color: '#EF9F27', bg: '#854F0B22', label: 'claude' },
  gpt4o:  { color: '#10a37f', bg: '#10a37f22', label: 'gpt-4o' },
  gemini: { color: '#4285f4', bg: '#4285f422', label: 'gemini' },
  human:  { color: '#4A4A46', bg: '#4A4A4622', label: 'human' },
}

const STATUS_STYLES = {
  idle:    { dot: '#3A3B36', border: '#2A2B27' },
  running: { dot: '#EF9F27', border: '#EF9F27' },
  done:    { dot: '#5CAF2A', border: '#3B6D11' },
  waiting: { dot: '#378ADD', border: '#185FA5' },
}

const TYPE_LABELS = {
  input: 'INPUT', process: 'PROCESS', approval: 'APPROVAL', output: 'OUTPUT',
}

export default function FactoryNode({ data }) {
  const { node, pipeline, status, onSelect, filmColor } = data
  const engine = ENGINE_STYLES[node.engine] || ENGINE_STYLES.human
  const st = STATUS_STYLES[status] || STATUS_STYLES.idle
  const isFirst = node.type === 'input'
  const isLast = node.type === 'output'

  return (
    <div
      onClick={() => onSelect(node, pipeline)}
      className={status === 'running' ? 'node-running' : ''}
      style={{
        background: '#161714',
        border: `0.5px solid ${st.border}`,
        borderRadius: 8,
        width: 176,
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
    >
      {!isFirst && (
        <Handle type="target" position={Position.Top}
          style={{ background: '#3A3B36', border: '1px solid #3A3B36', width: 8, height: 8 }} />
      )}
      <div style={{
        padding: '8px 10px 6px',
        borderBottom: `0.5px solid ${filmColor}22`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: 4,
          background: `${filmColor}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <i className={`ti ti-${node.icon}`} style={{ color: filmColor, fontSize: 12 }} aria-hidden="true" />
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#E8E6DC',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            letterSpacing: '0.02em',
          }}>
            {node.title}
          </div>
          <div style={{ fontSize: 9, color: '#4A4A46', fontFamily: 'IBM Plex Mono, monospace', letterSpacing: '0.05em', marginTop: 1 }}>
            {TYPE_LABELS[node.type]}
          </div>
        </div>
        <div style={{
          width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
          background: st.dot,
          ...(status === 'running' ? { animation: 'pulse 1s infinite' } : {})
        }} />
      </div>
      <div style={{ padding: '7px 10px 6px' }}>
        <div style={{ fontSize: 11, color: '#8A8880', lineHeight: 1.5 }}>
          {node.description.length > 58 ? node.description.slice(0, 58) + '…' : node.description}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
          <span style={{
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 9, padding: '2px 5px',
            borderRadius: 3, border: `0.5px solid ${engine.color}55`,
            color: engine.color, background: engine.bg, letterSpacing: '0.03em',
          }}>
            {engine.label}
          </span>
          {status === 'running' && <span style={{ fontSize: 9, color: '#EF9F27', fontFamily: 'IBM Plex Mono, monospace' }}>running…</span>}
          {status === 'done' && <span style={{ fontSize: 9, color: '#5CAF2A', fontFamily: 'IBM Plex Mono, monospace' }}>✓ done</span>}
          {status === 'waiting' && <span style={{ fontSize: 9, color: '#378ADD', fontFamily: 'IBM Plex Mono, monospace' }}>waiting…</span>}
        </div>
      </div>
      {!isLast && (
        <Handle type="source" position={Position.Bottom}
          style={{ background: '#3A3B36', border: '1px solid #3A3B36', width: 8, height: 8 }} />
      )}
    </div>
  )
}
