'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Terminal,
  Send,
  Trash2,
  Circle,
  Wifi,
  WifiOff,
} from 'lucide-react'

interface TerminalLine {
  id: number
  type: 'input' | 'output' | 'error' | 'system'
  content: string
  timestamp: Date
}

export default function AgentTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 1,
      type: 'system',
      content: '▸ Vibe Agent Terminal v0.1.0',
      timestamp: new Date(),
    },
    {
      id: 2,
      type: 'system',
      content: '▸ Waiting for WebSocket connection to ws://localhost:4000...',
      timestamp: new Date(),
    },
    {
      id: 3,
      type: 'output',
      content: '  Ready. Type a command or prompt to send to the active agent.',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const newLine: TerminalLine = {
      id: Date.now(),
      type: 'input',
      content: `$ ${input}`,
      timestamp: new Date(),
    }

    const responseLine: TerminalLine = {
      id: Date.now() + 1,
      type: 'output',
      content: `[agent] Processing: "${input}" \u2014 WebSocket not connected.`,
      timestamp: new Date(),
    }

    setLines((prev) => [...prev, newLine, responseLine])
    setInput('')
  }

  const clearTerminal = () => {
    setLines([
      {
        id: Date.now(),
        type: 'system',
        content: '▸ Terminal cleared.',
        timestamp: new Date(),
      },
    ])
  }

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input':
        return 'text-vibe-accent'
      case 'output':
        return 'text-vibe-text/70'
      case 'error':
        return 'text-red-400'
      case 'system':
        return 'text-vibe-purple'
    }
  }

  return (
    <div className="flex flex-col h-full bg-vibe-surface">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-vibe-border bg-vibe-surface">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-vibe-accent" />
          <span className="text-[11px] font-bold text-vibe-text/80 uppercase tracking-wider">
            Agent Brain
          </span>
          <div className="flex items-center gap-1 ml-2">
            {connected ? (
              <>
                <Wifi className="w-3 h-3 text-vibe-accent" />
                <span className="text-[10px] text-vibe-accent">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-vibe-muted" />
                <span className="text-[10px] text-vibe-muted">Disconnected</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearTerminal}
            className="p-1 hover:bg-vibe-border rounded transition-colors text-vibe-muted hover:text-vibe-text"
            title="Clear terminal"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => setConnected(!connected)}
            className={`p-1 rounded transition-colors ${
              connected
                ? 'hover:bg-red-500/10 text-vibe-accent hover:text-red-400'
                : 'hover:bg-vibe-accent/10 text-vibe-muted hover:text-vibe-accent'
            }`}
            title={connected ? 'Disconnect' : 'Connect'}
          >
            <Circle className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-2 font-mono"
      >
        {lines.map((line) => (
          <div
            key={line.id}
            className={`terminal-line ${getLineColor(line.type)}`}
          >
            {line.content}
          </div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-4 py-2 border-t border-vibe-border"
      >
        <span className="text-vibe-accent text-xs font-bold">▸</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send command to agent..."
          className="flex-1 bg-transparent text-xs text-vibe-text placeholder:text-vibe-muted/50 outline-none"
        />
        <button
          type="submit"
          className="p-1.5 hover:bg-vibe-accent/10 rounded transition-colors text-vibe-muted hover:text-vibe-accent"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  )
}
