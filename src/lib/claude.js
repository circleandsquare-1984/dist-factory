export async function callClaude({ system, prompt, useWebSearch = false, maxTokens = 1500 }) {
  const tools = useWebSearch ? [{ type: 'web_search_20250305', name: 'web_search' }] : []
  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system,
      tools,
      messages: [{ role: 'user', content: prompt }]
    })
  })
  if (!response.ok) {
    const err = await response.text()
    throw new Error(`API error: ${err}`)
  }
  const data = await response.json()
  const text = (data.content || [])
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('')
  return text
}

export async function callClaudeJSON({ system, prompt, useWebSearch = false, maxTokens = 1500 }) {
  const text = await callClaude({ system, prompt, useWebSearch, maxTokens })
  try {
    const clean = text.replace(/```json|```/g, '').trim()
    const isArray = clean.indexOf('[') !== -1 && (clean.indexOf('[') < clean.indexOf('{') || clean.indexOf('{') === -1)
    const start = isArray ? clean.indexOf('[') : clean.indexOf('{')
    const end = isArray ? clean.lastIndexOf(']') : clean.lastIndexOf('}')
    if (start === -1 || end === -1) throw new Error('No JSON found')
    return JSON.parse(clean.slice(start, end + 1))
  } catch (e) {
    console.error('JSON parse error:', e)
    return null
  }
}
