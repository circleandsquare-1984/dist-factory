import { useState, useCallback, useMemo } from 'react'
import ReactFlow, {
  Background, Controls, MiniMap,
  useNodesState, useEdgesState,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import Topbar from './components/Topbar'
import FilmPanel from './components/FilmPanel'
import NodeDetail from './components/NodeDetail'
import FactoryNode from './components/FactoryNode'
import { PIPELINE_DEFS, FILMS, INITIAL_STATUSES } from './lib/data'
import { callClaude } from './lib/claude'

const NODE_TYPES = { factoryNode: FactoryNode }
const PIPELINE_X = { edu: 0, pr: 220, impact: 440, grants: 660, commercial: 880 }
const NODE_Y_GAP = 130

function buildNodes(filmId, statuses, onSelect, pipelines) {
  const nodes = []
  pipelines.forEach(pipe => {
    const x = PIPELINE_X[pipe.id]
    pipe.nodes.forEach((node, i) => {
      const pipeStatuses = statuses[filmId]?.[pipe.id] || {}
      const status = pipeStatuses[node.id] || 'idle'
      nodes.push({
        id: `${filmId}-${pipe.id}-${node.id}`,
        type: 'factoryNode',
        position: { x, y: i * NODE_Y_GAP },
        data: { node, pipeline: pipe, status, onSelect, filmColor: pipe.color },
      })
    })
  })
  return nodes
}

function buildEdges(filmId, statuses, pipelines) {
  const edges = []
  pipelines.forEach(pipe => {
    const pipeStatuses = statuses[filmId]?.[pipe.id] || {}
    pipe.nodes.forEach((node, i) => {
      if (i === 0) return
      const prev = pipe.nodes[i - 1]
      const prevStatus = pipeStatuses[prev.id] || 'idle'
      const isActive = prevStatus === 'done' || prevStatus === 'running'
      edges.push({
        id: `${filmId}-${pipe.id}-${prev.id}-${node.id}`,
        source: `${filmId}-${pipe.id}-${prev.id}`,
        target: `${filmId}-${pipe.id}-${node.id}`,
        type: 'smoothstep',
        animated: isActive,
        style: {
          stroke: isActive ? pipe.color + 'AA' : pipe.color + '33',
          strokeWidth: 1.5,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isActive ? pipe.color + 'AA' : pipe.color + '33',
          width: 12, height: 12,
        },
      })
    })
  })
  return edges
}

function getNodePrompt(node, film, pipeline) {
  const prompts = {
    'film-brief':      `Extract a structured film profile for "${film.title}" ready to configure all distribution pipelines. Include: themes, target audiences, regions, awards, key contacts, rights available.`,
    'auto-configure':  `Configure the ${pipeline.label} pipeline for "${film.title}". Output search parameters, institution types to target, geographic scope, key themes to emphasise, warm lead signals to flag.`,
    'lead-scraper':    `Search for 10 relevant educational licensing leads for "${film.title}" in North America. Focus on universities with African studies or postcolonial programs, professors who teach documentary or decolonisation, and student organisations. Return name, institution, contact details, and why they are relevant.`,
    'deduplicator':    `Review the lead list for "${film.title}" and identify duplicates or contacts who may have been previously contacted. Flag cross-film overlaps as warm leads.`,
    'email-drafter':   `Draft 3 outreach emails for "${film.title}" — one for a university librarian, one for a professor, one for a student organisation president. Warm human tone. Include the logline, one strong review quote, and a clear licensing ask.`,
    'press-list':      `Find 8 journalists and outlets receptive to "${film.title}". Focus on African cinema, documentary, decolonisation, and women's leadership beats. Include name, outlet, beat, and email where findable.`,
    'pitch-drafter':   `Draft a press pitch for "${film.title}" for a journalist covering African cinema and documentary. Lead with the strongest hook. Include one pull quote. Keep under 200 words.`,
    'partner-finder':  `Find 6 NGOs or community organisations in North America who would be ideal impact screening partners for "${film.title}". Focus on decolonisation, African diaspora, women's leadership, and public library advocacy.`,
    'grant-finder':    `Find 5 open grant opportunities for a documentary like "${film.title}" with themes of decolonisation, African culture, and women's leadership. Include foundation name, grant name, deadline, amount, and eligibility.`,
    'dist-finder':     `Identify 6 distributors or platforms for "${film.title}" in North America. Include streaming platforms, educational distributors, and broadcast opportunities.`,
  }
  return prompts[node.id] || `Execute the ${node.title} node for "${film.title}" in the ${pipeline.label} pipeline. Be specific and practical.`
}

export default function App() {
  const [activeFilmId, setActiveFilmId] = useState('htbal')
  const [activePipeline, setActivePipeline] = useState('all')
  const [selectedNode, setSelectedNode] = useState(null)
  const [selectedPipeline, setSelectedPipeline] = useState(null)
  const [statuses, setStatuses] = useState(INITIAL_STATUSES)
  const [running, setRunning] = useState(false)
  const [lastOutput, setLastOutput] = useState('')

  const activeFilm = FILMS.find(f => f.id === activeFilmId)

  const visiblePipelines = activePipeline === 'all'
    ? PIPELINE_DEFS
    : PIPELINE_DEFS.filter(p => p.id === activePipeline)

  const handleSelectNode = useCallback((node, pipeline) => {
    setSelectedNode(node)
    setSelectedPipeline(pipeline)
  }, [])

  const setNodeStatus = useCallback((filmId, pipeId, nodeId, status) => {
    setStatuses(prev => ({
      ...prev,
      [filmId]: {
        ...prev[filmId],
        [pipeId]: { ...(prev[filmId]?.[pipeId] || {}), [nodeId]: status }
      }
    }))
  }, [])

  const rfNodes = useMemo(() =>
    buildNodes(activeFilmId, statuses, handleSelectNode, visiblePipelines),
    [activeFilmId, statuses, activePipeline, handleSelectNode]
  )

  const rfEdges = useMemo(() =>
    buildEdges(activeFilmId, statuses, visiblePipelines),
    [activeFilmId, statuses, activePipeline]
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges)

  useMemo(() => { setNodes(rfNodes); setEdges(rfEdges) }, [rfNodes, rfEdges])

  const handleRun = async (node, pipeline, film) => {
    if (!film || running) return
    setRunning(true)
    setNodeStatus(film.id, pipeline.id, node.id, 'running')
    try {
      const system = `You are a node in a documentary film distribution factory.
Film: "${film.title}" (${film.year}) by ${film.directors}.
Themes: ${film.themes.join(', ')}.
Awards: ${film.awards.join(', ')}.
Your job: ${node.description}
Be specific, practical, and output real actionable results.`
      const prompt = getNodePrompt(node, film, pipeline)
      const useSearch = ['lead-scraper','press-list','grant-finder','dist-finder','partner-finder'].includes(node.id)
      const result = await callClaude({ system, prompt, useWebSearch: useSearch })
      setLastOutput(result)
      setNodeStatus(film.id, pipeline.id, node.id, 'done')
      const nodeIndex = pipeline.nodes.findIndex(n => n.id === node.id)
      if (nodeIndex < pipeline.nodes.length - 1) {
        const nextNode = pipeline.nodes[nodeIndex + 1]
        if (statuses[film.id]?.[pipeline.id]?.[nextNode.id] === 'idle') {
          setNodeStatus(film.id, pipeline.id, nextNode.id, 'waiting')
        }
      }
    } catch (err) {
      console.error(err)
      setNodeStatus(film.id, pipeline.id, node.id, 'idle')
    }
    setRunning(false)
  }

  const currentStatus = selectedNode && selectedPipeline
    ? statuses[activeFilmId]?.[selectedPipeline.id]?.[selectedNode.id] || 'idle'
    : null

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0E0F0C' }}>
      <Topbar
        activePipeline={activePipeline}
        onSelectPipeline={setActivePipeline}
        activeFilm={activeFilm}
      />
      <div style={{ flex: 1, position: 'relative' }}>
        <FilmPanel
          activeFilmId={activeFilmId}
          onSelectFilm={setActiveFilmId}
          onAddFilm={() => alert('Paste your press kit in chat to auto-configure a new film.')}
        />
        <div style={{ position: 'absolute', left: 220, right: selectedNode ? 280 : 0, top: 0, bottom: 0 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={NODE_TYPES}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.2}
            maxZoom={1.5}
          >
            <Background color="#1A1B18" gap={24} size={1} variant="dots" />
            <Controls />
            <MiniMap
              nodeColor={n => {
                const pipe = PIPELINE_DEFS.find(p => n.id.includes(`-${p.id}-`))
                return pipe ? pipe.color + '66' : '#3A3B36'
              }}
              style={{ background: '#161714', border: '0.5px solid #2A2B27' }}
            />
          </ReactFlow>
        </div>
        {selectedNode && (
          <NodeDetail
            node={selectedNode}
            pipeline={selectedPipeline}
            status={currentStatus}
            film={activeFilm}
            onClose={() => { setSelectedNode(null); setSelectedPipeline(null) }}
            onRun={handleRun}
          />
        )}
        {running && (
          <div style={{
            position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
            background: '#161714', border: '0.5px solid #EF9F27',
            borderRadius: 8, padding: '10px 16px',
            fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#EF9F27',
            display: 'flex', alignItems: 'center', gap: 8, zIndex: 200,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#EF9F27', animation: 'pulse 1s infinite' }} />
            node running…
          </div>
        )}
        {lastOutput && !running && (
          <div
            onClick={() => setLastOutput('')}
            style={{
              position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
              background: '#161714', border: '0.5px solid #5CAF2A',
              borderRadius: 8, padding: '10px 16px', maxWidth: 500,
              fontFamily: 'IBM Plex Mono, monospace', fontSize: 11, color: '#5CAF2A',
              display: 'flex', alignItems: 'center', gap: 8, zIndex: 200, cursor: 'pointer',
            }}>
            <i className="ti ti-check" aria-hidden="true" />
            node complete — click to dismiss
          </div>
        )}
      </div>
    </div>
  )
}
