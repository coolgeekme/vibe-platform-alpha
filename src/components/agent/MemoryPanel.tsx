'use client'

import { useState, useEffect } from 'react'
import { Brain, RefreshCw, ChevronRight, ChevronDown, Database, Hash, Clock } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

      let factList: MemoryFact[] = []
      if (Array.isArray(data)) {
        factList = data.map((item: any) => ({
          id: item.id || item.key || Math.random().toString(36).slice(2),
          content: item.content || item.fact || item.text || (typeof item === 'string' ? item : JSON.stringify(item)),
          category: item.category || item.type || 'general',
          timestamp: item.timestamp || item.created_at,
        }))
      } else if (data.facts) {
        factList = Object.entries(data.facts).map(([key, value]: [string, any]) => ({
          id: key,
          content: typeof value === 'string' ? value : JSON.stringify(value),
          category: 'facts',
        }))
      }

      setFacts(factList)
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
    <div className="flex flex-col h-full bg-vibe-bg border-l border-vibe-border select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-vibe-border bg-vibe-surface/30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-vibe-purple/10 flex items-center justify-center">
            <Brain className="w-4 h-4 text-vibe-purple" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-vibe-text">
            Durable Memory
          </span>
        </div>
        <button
          onClick={fetchMemory}
          disabled={loading}
          className="p-1.5 hover:bg-vibe-border rounded-md transition-colors text-vibe-muted hover:text-vibe-accent disabled:opacity-50"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {loading && facts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <LoaderCircle className="w-6 h-6 text-vibe-muted animate-spin" />
            <span className="text-[10px] text-vibe-muted font-bold uppercase tracking-tighter">Updating state...</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
            <p className="text-xs text-red-500/90 leading-relaxed font-medium">Remote error: {error}</p>
            <button
              onClick={fetchMemory}
              className="mt-3 text-[10px] font-bold text-vibe-accent uppercase tracking-wider hover:underline"
            >
              Try Reconnect
            </button>
          </div>
        )}

        {!loading && !error && facts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
            <Database className="w-8 h-8 text-vibe-muted mb-3" />
            <p className="text-[11px] font-medium text-vibe-muted">No persistent data found</p>
          </div>
        )}

        {categories.map(category => (
          <div key={category} className="space-y-2">
            <button
              onClick={() => toggleCategory(category)}
              className="flex items-center gap-2 w-full text-left group"
            >
              <div className="flex items-center gap-2">
                {expandedCategories.has(category) ? (
                  <ChevronDown className="w-3.5 h-3.5 text-vibe-muted transition-transform" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-vibe-muted transition-transform" />
                )}
                <span className="text-[10px] uppercase tracking-[0.15em] text-vibe-muted font-black group-hover:text-vibe-text">
                  {category}
                </span>
              </div>
              <div className="h-px flex-1 bg-vibe-border/50 ml-2" />
              <span className="text-[10px] text-vibe-muted/50 font-mono">
                {facts.filter(f => (f.category || 'general') === category).length}
              </span>
            </button>

            {expandedCategories.has(category) && (
              <div className="space-y-2.5 pt-1">
                {facts
                  .filter(f => (f.category || 'general') === category)
                  .map((fact, i) => (
                    <div
                      key={fact.id || i}
                      className="group p-3.5 rounded-xl bg-vibe-surface/40 border border-vibe-border/50 hover:border-vibe-accent/30 transition-all shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                         <Hash className="w-3 h-3 text-vibe-accent mt-0.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                         <p className="text-[11px] text-vibe-text/80 leading-relaxed font-medium">
                          {fact.content}
                        </p>
                      </div>
                      
                      {fact.timestamp && (
                        <div className="flex items-center gap-1.5 mt-2.5 opacity-30 group-hover:opacity-100 transition-opacity">
                          <Clock className="w-2.5 h-2.5 text-vibe-muted" />
                          <span className="text-[9px] text-vibe-muted font-bold tracking-tighter">
                            {new Date(fact.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-vibe-border bg-vibe-surface/20">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-vibe-accent" />
             <span className="text-[9px] font-bold text-vibe-muted uppercase tracking-tighter">Remote Sync</span>
           </div>
           <span className="text-[9px] font-mono text-vibe-muted/40">V0.2.1-SNAPSHOT</span>
        </div>
      </div>
    </div>
  )
}

function LoaderCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
