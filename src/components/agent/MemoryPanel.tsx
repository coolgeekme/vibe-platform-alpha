'use client'

import { useState, useEffect } from 'react'
import { Brain, RefreshCw, ChevronRight, ChevronDown, Database } from 'lucide-react'

const AGENT_URL = 'https://agent.coolgeek.me'

interface MemoryFact {
  id?: string
  key?: string
  content: string
  category?: string
  timestamp?: string
}

export default function MemoryPanel() {
  const [facts, setFacts] = useState<MemoryFact[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['all']))

  const fetchMemory = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${AGENT_URL}/memory/facts`)
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const data = await res.json()

      if (Array.isArray(data)) {
        setFacts(data.map((item: any) => ({
          id: item.id || item.key || Math.random().toString(36).slice(2),
          content: item.content || item.fact || item.text || (typeof item === 'string' ? item : JSON.stringify(item)),
          category: item.category || item.type || 'general',
          timestamp: item.timestamp || item.created_at,
        })))
      } else if (data.facts) {
        setFacts(data.facts.map((item: any) => ({
          id: item.id || Math.random().toString(36).slice(2),
          content: item.content || item.fact || item.text || JSON.stringify(item),
          category: item.category || 'general',
          timestamp: item.timestamp,
        })))
      } else {
        setFacts([{ content: JSON.stringify(data, null, 2), category: 'raw' }])
      }
    } catch (err: any) {
      setError(err.message)
      setFacts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMemory()
  }, [])

  const categories = Array.from(new Set(facts.map(f => f.category || 'general')))

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  return (
    <div className="flex flex-col h-full bg-vibe-surface border-l border-vibe-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-vibe-border">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-vibe-purple" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-vibe-text/80">
            Durable Memory
          </span>
        </div>
        <button
          onClick={fetchMemory}
          disabled={loading}
          className="p-1.5 hover:bg-vibe-border rounded transition-colors text-vibe-muted hover:text-vibe-accent disabled:opacity-50"
          title="Refresh memory"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {loading && facts.length === 0 && (
          <div className="flex items-center gap-2 py-4 justify-center">
            <RefreshCw className="w-4 h-4 text-vibe-muted animate-spin" />
            <span className="text-xs text-vibe-muted">Loading memory...</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/20 mt-2">
            <p className="text-xs text-red-400">Failed to load: {error}</p>
            <button
              onClick={fetchMemory}
              className="mt-2 text-[10px] text-vibe-accent hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && facts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Database className="w-8 h-8 text-vibe-muted/50 mb-2" />
            <p className="text-xs text-vibe-muted">No memory facts found</p>
          </div>
        )}

        {categories.map(category => (
          <div key={category} className="mb-2">
            <button
              onClick={() => toggleCategory(category)}
              className="flex items-center gap-1.5 w-full px-1 py-1.5 text-left hover:bg-vibe-border/30 rounded transition-colors"
            >
              {expandedCategories.has(category) ? (
                <ChevronDown className="w-3 h-3 text-vibe-muted" />
              ) : (
                <ChevronRight className="w-3 h-3 text-vibe-muted" />
              )}
              <span className="text-[10px] uppercase tracking-wider text-vibe-muted font-bold">
                {category}
              </span>
              <span className="ml-auto text-[10px] text-vibe-muted/60">
                {facts.filter(f => (f.category || 'general') === category).length}
              </span>
            </button>

            {expandedCategories.has(category) && (
              <div className="ml-4 space-y-1 mt-1">
                {facts
                  .filter(f => (f.category || 'general') === category)
                  .map((fact, i) => (
                    <div
                      key={fact.id || i}
                      className="px-2.5 py-2 rounded-md bg-vibe-bg/60 border border-vibe-border/50 hover:border-vibe-purple/30 transition-colors"
                    >
                      <p className="text-[11px] text-vibe-text/80 leading-relaxed whitespace-pre-wrap break-words">
                        {fact.content}
                      </p>
                      {fact.timestamp && (
                        <p className="text-[9px] text-vibe-muted/50 mt-1">
                          {new Date(fact.timestamp).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-vibe-border">
        <div className="flex items-center justify-between text-[10px] text-vibe-muted">
          <span>{facts.length} facts stored</span>
          <span className="text-vibe-purple">agent.coolgeek.me</span>
        </div>
      </div>
    </div>
  )
}
