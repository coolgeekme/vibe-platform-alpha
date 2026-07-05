'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Wrench, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { ToolCall } from '@/hooks/useAgentChat'

interface ToolExecutionCardProps {
  toolCall: ToolCall
}

export default function ToolExecutionCard({ toolCall }: ToolExecutionCardProps) {
  const [expanded, setExpanded] = useState(false)

  const statusIcon = () => {
    switch (toolCall.status) {
      case 'running':
      case 'pending':
        return <Loader2 className="w-3.5 h-3.5 text-vibe-cyan animate-spin" />
      case 'completed':
        return <CheckCircle2 className="w-3.5 h-3.5 text-vibe-accent" />
      case 'error':
        return <AlertCircle className="w-3.5 h-3.5 text-red-400" />
    }
  }

  const statusColor = () => {
    switch (toolCall.status) {
      case 'running':
      case 'pending':
        return 'border-vibe-cyan/30 bg-vibe-cyan/5'
      case 'completed':
        return 'border-vibe-accent/30 bg-vibe-accent/5'
      case 'error':
        return 'border-red-400/30 bg-red-400/5'
    }
  }

  return (
    <div className={`my-2 rounded-lg border ${statusColor()} overflow-hidden transition-all`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/[0.02] transition-colors"
      >
        {expanded ? (
          <ChevronDown className="w-3 h-3 text-vibe-muted flex-shrink-0" />
        ) : (
          <ChevronRight className="w-3 h-3 text-vibe-muted flex-shrink-0" />
        )}
        <Wrench className="w-3.5 h-3.5 text-vibe-purple flex-shrink-0" />
        <span className="text-xs font-semibold text-vibe-text/90 truncate">
          {toolCall.name}
        </span>
        <span className="ml-auto flex-shrink-0">
          {statusIcon()}
        </span>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          {toolCall.arguments && (
            <div>
              <span className="text-[10px] uppercase tracking-wider text-vibe-muted font-bold">
                Arguments
              </span>
              <pre className="mt-1 p-2 rounded bg-vibe-bg/80 text-[11px] text-vibe-text/70 overflow-x-auto max-h-32 overflow-y-auto">
                {toolCall.arguments}
              </pre>
            </div>
          )}
          {toolCall.result && (
            <div>
              <span className="text-[10px] uppercase tracking-wider text-vibe-muted font-bold">
                Result
              </span>
              <pre className="mt-1 p-2 rounded bg-vibe-bg/80 text-[11px] text-vibe-text/70 overflow-x-auto max-h-48 overflow-y-auto">
                {toolCall.result}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
