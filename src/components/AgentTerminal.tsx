'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Terminal,
  Send,
  Trash2,
  Wifi,
  WifiOff,
} from 'lucide-react'
import { useSocket, SocketMessage } from '@/hooks/useSocket'

export default function AgentTerminal() {
  const { connected, messages, sendCommand, clearMessages, connect } = useSocket({ autoConnect: true })
  const [input, setInput] = useState('')
  const [activeAgent, setActiveAgent] = useState<'claude' | 'codex'>('claude')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const success = sendCommand(input, activeAgent)
    
    if (!success) {
      // Manual error if not connected
      console.error('Failed to send command: Socket not connected')
    }
    
    setInput('')
  }

  const getLineColor = (type: SocketMessage['type']) => {
    switch (type) {
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
                <button 
                  onClick={connect}
                  className="ml-2 text-[9px] underline text-vibe-accent hover:text-white"
                >
                  Retry
                </button>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearMessages}
            className="p-1 hover:bg-vibe-border rounded transition-colors text-vibe-muted hover:text-vibe-text"
            title="Clear terminal"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-2 font-mono text-[12px] leading-relaxed"
      >
        {messages.length === 0 && !connected && (
          <div className="text-vibe-muted italic py-2">
            Connecting to Agent Brain at {process.env.NEXT_PUBLIC_SOCKET_URL || 'localhost:4000'}...
          </div>
        )}
        {messages.map((line, i) => (
          <div
            key={i}
            className={`terminal-line mb-1 ${getLineColor(line.type)}`}
          >
            {line.agent && (
              <span className="text-[10px] opacity-50 mr-2">[{line.agent}]</span>
            )}
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
          placeholder={connected ? "Send command to agent..." : "Waiting for connection..."}
          disabled={!connected}
          className="flex-1 bg-transparent text-xs text-vibe-text placeholder:text-vibe-muted/50 outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!connected || !input.trim()}
          className="p-1.5 hover:bg-vibe-accent/10 rounded transition-colors text-vibe-muted hover:text-vibe-accent disabled:opacity-30"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  )
