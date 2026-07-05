'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import VisualEditor from './VisualEditor'
import AgentTerminal from './AgentTerminal'
import { GripHorizontal } from 'lucide-react'

export type AgentType = 'claude' | 'codex'

export default function Dashboard() {
  const [terminalHeight, setTerminalHeight] = useState(240)
  const [sidebarWidth] = useState(280)
  const [activeAgent, setActiveAgent] = useState<AgentType>('claude')

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-vibe-bg">
      {/* Sidebar */}
      <div
        className="h-full flex-shrink-0 border-r border-vibe-border"
        style={{ width: sidebarWidth }}
      >
        <Sidebar activeAgent={activeAgent} setActiveAgent={setActiveAgent} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Visual Editor Canvas */}
        <div className="flex-1 min-h-0 relative">
          <VisualEditor />
        </div>

        {/* Resize Handle */}
        <div className="h-1 bg-vibe-border hover:bg-vibe-accent/30 cursor-row-resize flex items-center justify-center transition-colors group">
          <GripHorizontal className="w-4 h-4 text-vibe-muted group-hover:text-vibe-accent transition-colors" />
        </div>

        {/* Agent Terminal */}
        <div
          className="flex-shrink-0 border-t border-vibe-border"
          style={{ height: terminalHeight }}
        >
          <AgentTerminal activeAgent={activeAgent} />
        </div>
      </div>
    </div>
  )
}
