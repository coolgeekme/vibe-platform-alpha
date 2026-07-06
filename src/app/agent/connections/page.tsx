'use client'

import { useState } from 'react'
import { 
  ChevronLeft, 
  ExternalLink, 
  CheckCircle2, 
  Loader2,
  Mail,
  Calendar,
  Github,
  Slack,
  BookOpen,
  MessageCircle,
  Linkedin,
  Database,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const AGENT_URL = 'https://agent.coolgeek.me'

interface Integration {
  id: string
  name: string
  description: string
  icon: any
  color: string
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Read and send emails, manage drafts and threads.',
    icon: Mail,
    color: 'bg-red-500/10 text-red-500 border-red-500/20'
  },
  {
    id: 'googlecalendar',
    name: 'Google Calendar',
    description: 'Schedule events, check availability, and manage your day.',
    icon: Calendar,
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Manage repositories, pull requests, and issues.',
    icon: Github,
    color: 'bg-zinc-100/10 text-zinc-100 border-zinc-100/20'
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send messages to channels and direct messages.',
    icon: Slack,
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Read and update pages, manage databases and tasks.',
    icon: BookOpen,
    color: 'bg-zinc-100/10 text-zinc-100 border-zinc-100/20'
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Automate messages and manage server interactions.',
    icon: MessageCircle,
    color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Post updates and manage professional network interactions.',
    icon: Linkedin,
    color: 'bg-blue-600/10 text-blue-600 border-blue-600/20'
  }
]

export default function ConnectionsPage() {
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleConnect = async (appId: string) => {
    setConnecting(appId)
    try {
      const response = await fetch(`${AGENT_URL}/integrations/connect/${appId}?redirect_url=${window.location.origin}/agent/connections`)
      if (!response.ok) throw new Error('Failed to get connection URL')
      const data = await response.json()
      
      if (data.redirect_url) {
        window.open(data.redirect_url, '_blank')
      }
    } catch (err) {
      console.error(err)
      alert('Error initiating connection. Please try again.')
    } finally {
      setConnecting(null)
    }
  }

  return (
    <div className="flex flex-col h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans bg-dot-grid">
      {/* Header */}
      <header className="h-[56px] flex items-center justify-between px-6 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <Link href="/agent" className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-zinc-100">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-[12px] font-black uppercase tracking-widest text-zinc-100">Integrations</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter mr-2 flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
             Secured by Composio
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 no-scrollbar">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-white">Power your agent</h1>
            <p className="text-zinc-500 text-base max-w-2xl leading-relaxed">
              Connect your professional tools to allow Atlas to execute tasks, manage your schedule, 
              and organize your workflow automatically across 200+ platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {INTEGRATIONS.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative flex flex-col p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900 transition-all shadow-xl backdrop-blur-sm ring-1 ring-white/5"
              >
                <div className={`w-12 h-12 rounded-2xl ${app.color} flex items-center justify-center border mb-6 shadow-lg`}>
                  <app.icon className="w-6 h-6" />
                </div>

                <div className="flex-1 space-y-2 mb-8">
                  <h3 className="text-lg font-bold text-white tracking-tight">{app.name}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed font-medium">
                    {app.description}
                  </p>
                </div>

                <button
                  onClick={() => handleConnect(app.id)}
                  disabled={connecting === app.id}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-zinc-100 text-black text-xs font-black uppercase tracking-widest hover:bg-white transition-all transform active:scale-95 disabled:opacity-50 shadow-md"
                >
                  {connecting === app.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Connect {app.name}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/5 border border-indigo-500/20 text-center space-y-4">
             <div className="w-12 h-12 rounded-full bg-zinc-100 mx-auto flex items-center justify-center shadow-lg ring-4 ring-indigo-500/20">
                <Plus className="w-6 h-6 text-black" />
             </div>
             <div className="space-y-1">
                <h3 className="text-lg font-bold text-white tracking-tight">Looking for something else?</h3>
                <p className="text-zinc-500 text-sm font-medium">We support over 200+ integrations including Jira, Linear, Twilio, and more.</p>
             </div>
             <button className="mt-4 px-6 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500/20 transition-all">
                Browse Full Catalog
             </button>
          </div>
        </div>
      </main>

      <p className="text-center text-[10px] text-zinc-800 font-bold uppercase tracking-[0.4em] py-8 border-t border-zinc-900/50">
        Composio Infrastructure • Secured Vibe Network • 2026
      </p>
    </div>
  )
}
