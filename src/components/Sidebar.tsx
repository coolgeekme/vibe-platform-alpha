'use client'

import { useState } from 'react'
import {
  FolderOpen,
  FileCode2,
  FileJson,
  FileText,
  ChevronRight,
  ChevronDown,
  Bot,
  Zap,
  Settings,
  Plus,
  Search,
} from 'lucide-react'

type AgentType = 'claude' | 'codex'

interface FileNode {
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
  extension?: string
}

const mockFileTree: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'app',
        type: 'folder',
        children: [
          { name: 'page.tsx', type: 'file', extension: 'tsx' },
          { name: 'layout.tsx', type: 'file', extension: 'tsx' },
          { name: 'globals.css', type: 'file', extension: 'css' },
        ],
      },
      {
        name: 'components',
        type: 'folder',
        children: [
          { name: 'Dashboard.tsx', type: 'file', extension: 'tsx' },
          { name: 'Sidebar.tsx', type: 'file', extension: 'tsx' },
          { name: 'VisualEditor.tsx', type: 'file', extension: 'tsx' },
          { name: 'AgentTerminal.tsx', type: 'file', extension: 'tsx' },
        ],
      },
    ],
  },
  {
    name: 'server',
    type: 'folder',
    children: [
      { name: 'index.js', type: 'file', extension: 'js' },
      { name: 'agents.js', type: 'file', extension: 'js' },
    ],
  },
  { name: 'package.json', type: 'file', extension: 'json' },
  { name: 'tailwind.config.ts', type: 'file', extension: 'ts' },
]

function getFileIcon(extension?: string) {
  switch (extension) {
    case 'tsx':
    case 'ts':
    case 'js':
      return <FileCode2 className="w-3.5 h-3.5 text-vibe-cyan" />
    case 'json':
      return <FileJson className="w-3.5 h-3.5 text-yellow-500" />
    case 'css':
      return <FileText className="w-3.5 h-3.5 text-vibe-purple" />
    default:
      return <FileText className="w-3.5 h-3.5 text-vibe-muted" />
  }
}

function FileTreeItem({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2)

  if (node.type === 'folder') {
    return (
      <div>
        <div
          className="file-item"
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronDown className="w-3 h-3 text-vibe-muted" />
          ) : (
            <ChevronRight className="w-3 h-3 text-vibe-muted" />
          )}
          <FolderOpen className="w-3.5 h-3.5 text-vibe-accent-dim" />
          <span>{node.name}</span>
        </div>
        {expanded && node.children?.map((child) => (
          <FileTreeItem key={child.name} node={child} depth={depth + 1} />
        ))}
      </div>
    )
  }

  return (
    <div
      className="file-item"
      style={{ paddingLeft: `${depth * 12 + 24}px` }}
    >
      {getFileIcon(node.extension)}
      <span>{node.name}</span>
    </div>
  )
}

export default function Sidebar() {
  const [activeAgent, setActiveAgent] = useState<AgentType>('claude')

  return (
    <div className="flex flex-col h-full bg-vibe-surface">
      {/* Header */}
      <div className="px-4 py-3 border-b border-vibe-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-vibe-accent" />
            <span className="text-sm font-bold text-vibe-accent tracking-wide">
              VIBE
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-vibe-border rounded transition-colors">
              <Search className="w-3.5 h-3.5 text-vibe-muted" />
            </button>
            <button className="p-1.5 hover:bg-vibe-border rounded transition-colors">
              <Plus className="w-3.5 h-3.5 text-vibe-muted" />
            </button>
            <button className="p-1.5 hover:bg-vibe-border rounded transition-colors">
              <Settings className="w-3.5 h-3.5 text-vibe-muted" />
            </button>
          </div>
        </div>
      </div>

      {/* Agent Toggle */}
      <div className="px-3 py-3 border-b border-vibe-border">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="w-3.5 h-3.5 text-vibe-purple" />
          <span className="text-[10px] uppercase tracking-widest text-vibe-muted font-bold">
            Agent Brain
          </span>
        </div>
        <div className="flex gap-1 p-0.5 bg-vibe-bg rounded-md">
          <button
            onClick={() => setActiveAgent('claude')}
            className={`flex-1 px-3 py-1.5 text-[11px] font-bold rounded transition-all ${
              activeAgent === 'claude'
                ? 'bg-vibe-purple/20 text-vibe-purple border border-vibe-purple/30'
                : 'text-vibe-muted hover:text-vibe-text'
            }`}
          >
            Claude Code
          </button>
          <button
            onClick={() => setActiveAgent('codex')}
            className={`flex-1 px-3 py-1.5 text-[11px] font-bold rounded transition-all ${
              activeAgent === 'codex'
                ? 'bg-vibe-cyan/20 text-vibe-cyan border border-vibe-cyan/30'
                : 'text-vibe-muted hover:text-vibe-text'
            }`}
          >
            OpenAI Codex
          </button>
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${
            activeAgent === 'claude' ? 'bg-vibe-purple animate-pulse' : 'bg-vibe-cyan animate-pulse'
          }`} />
          <span className="text-[10px] text-vibe-muted">
            {activeAgent === 'claude' ? 'Claude Code' : 'OpenAI Codex'} ready
          </span>
        </div>
      </div>

      {/* File Explorer */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-3 mb-2">
          <span className="text-[10px] uppercase tracking-widest text-vibe-muted font-bold">
            Explorer
          </span>
        </div>
        {mockFileTree.map((node) => (
          <FileTreeItem key={node.name} node={node} />
        ))}
      </div>

      {/* Footer Status */}
      <div className="px-4 py-2 border-t border-vibe-border">
        <div className="flex items-center justify-between text-[10px] text-vibe-muted">
          <span>vibe-platform-alpha</span>
          <span className="text-vibe-accent">v0.1.0</span>
        </div>
      </div>
    </div>
  )
}
