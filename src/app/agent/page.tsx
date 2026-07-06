'use client'

import { useState } from 'react'
import { PanelRightOpen, PanelRightClose, Menu } from 'lucide-react'
import ChatInterface from '@/components/agent/ChatInterface'
import MemoryPanel from '@/components/agent/MemoryPanel'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function AgentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-[100vh] w-full bg-vibe-bg text-vibe-text selection:bg-vibe-accent/30 selection:text-vibe-text overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        <ChatInterface />

        {/* Desktop Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 right-6 z-20 p-2 hover:bg-vibe-border/80 bg-vibe-bg/50 backdrop-blur rounded-lg transition-all border border-vibe-border/50 text-vibe-muted hover:text-vibe-text hidden lg:flex items-center justify-center"
          title={sidebarOpen ? 'Collapse side panel' : 'Expand side panel'}
        >
          {sidebarOpen ? (
            <PanelRightClose className="w-4 h-4" />
          ) : (
            <PanelRightOpen className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Memory Sidebar */}
      <div className={cn(
        "h-full flex-shrink-0 transition-all duration-300 ease-in-out border-l border-vibe-border overflow-hidden",
        sidebarOpen ? "w-80 opacity-100" : "w-0 opacity-0 border-l-0"
      )}>
        <MemoryPanel />
      </div>
    </div>
  )
}
