'use client'

import { useState } from 'react'
import { PanelRightOpen, PanelRightClose } from 'lucide-react'
import ChatInterface from '@/components/agent/ChatInterface'
import MemoryPanel from '@/components/agent/MemoryPanel'

export default function AgentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen w-full bg-vibe-bg">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <ChatInterface />

        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-3 right-4 z-10 p-2 hover:bg-vibe-border/50 rounded-lg transition-colors text-vibe-muted hover:text-vibe-text"
          title={sidebarOpen ? 'Hide memory panel' : 'Show memory panel'}
        >
          {sidebarOpen ? (
            <PanelRightClose className="w-4 h-4" />
          ) : (
            <PanelRightOpen className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Memory Sidebar */}
      {sidebarOpen && (
        <div className="w-80 flex-shrink-0 hidden lg:block">
          <MemoryPanel />
        </div>
      )}
    </div>
  )
}
