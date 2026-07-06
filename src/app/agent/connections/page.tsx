'use client'

import { useState, useEffect, useMemo } from 'react'
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
  Plus,
  User,
  RefreshCw,
  X,
  Search,
  Globe,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const AGENT_URL = 'https://agent.coolgeek.me'

interface Integration {
  id: string
  name: string
  description: string
  icon: any
  color: string
}

interface CatalogIntegration {
  id: string
  name: string
  description: string
  icon: string | null
}

interface ConnectedAccount {
  id: string | null
  name: string
  status: string
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

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className="fixed bottom-6 right-6 z-[100] px-5 py-3 bg-emerald-500/90 text-white text-sm font-bold rounded-2xl shadow-2xl backdrop-blur-sm border border-emerald-400/30"
    >
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4" />
        {message}
      </div>
    </motion.div>
  )
}

function IntegrationsModal({ isOpen, onClose, onConnect, connectedAccounts, connecting }: { isOpen: boolean; onClose: () => void; onConnect: (appId: string) => void; connectedAccounts: Record<string, ConnectedAccount[]>; connecting: string | null }) {
  const [catalog, setCatalog] = useState<CatalogIntegration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      fetch(`${AGENT_URL}/integrations/list`).then(res => res.json()).then(data => setCatalog(data.integrations || [])).catch(() => setCatalog([])).finally(() => setLoading(false))
    }
  }, [isOpen])

  const filteredCatalog = useMemo(() => {
    if (!searchQuery.trim()) return catalog
    const q = searchQuery.toLowerCase()
    return catalog.filter(app => app.name.toLowerCase().includes(q) || app.description.toLowerCase().includes(q) || app.id.toLowerCase().includes(q))
  }, [catalog, searchQuery])

  const isAppConnected = (appId: string): boolean => {
    const accounts = connectedAccounts[appId] || []
    return accounts.some(a => a.status === 'ACTIVE' || a.status === 'CONNECTED')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', duration: 0.4 }} className="relative w-full max-w-4xl max-h-[80vh] bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center"><Globe className="w-5 h-5 text-indigo-400" /></div>
                <div><h2 className="text-lg font-bold text-white tracking-tight">Integration Directory</h2><p className="text-xs text-zinc-500 font-medium">{catalog.length} integrations available</p></div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-zinc-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-4 border-b border-zinc-800/50"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" /><input type="text" placeholder="Search integrations..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all" autoFocus /></div></div>
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
              {loading ? (<div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /><span className="ml-3 text-sm text-zinc-500">Loading integrations...</span></div>) : filteredCatalog.length === 0 ? (<div className="flex flex-col items-center justify-center py-20 text-center"><Search className="w-10 h-10 text-zinc-700 mb-3" /><p className="text-sm text-zinc-500">No integrations found</p></div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">{filteredCatalog.map((app, index) => { const connected = isAppConnected(app.id); return (<motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.02, 0.3) }} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all hover:bg-zinc-800/50 cursor-pointer group ${connected ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900/30'}`} onClick={() => onConnect(app.id)}><div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center flex-shrink-0 overflow-hidden">{app.icon ? (<img src={app.icon} alt={app.name} className="w-6 h-6 object-contain" />) : (<Globe className="w-4 h-4 text-zinc-500" />)}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2"><h4 className="text-sm font-bold text-white truncate">{app.name}</h4>{connected && (<CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />)}</div><p className="text-[11px] text-zinc-500 truncate mt-0.5">{app.description}</p></div><div className="flex-shrink-0">{connecting === app.id ? (<Loader2 className="w-4 h-4 animate-spin text-zinc-400" />) : (<Plus className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 transition-colors" />)}</div></motion.div>)})}</div>)}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function ConnectionsPage() {
  const [connecting, setConnecting] = useState<string | null>(null)
  const [disconnecting, setDisconnecting] = useState<string | null>(null)
  const [connectedAccounts, setConnectedAccounts] = useState<Record<string, ConnectedAccount[]>>({})
  const [loadingConnections, setLoadingConnections] = useState(true)
  const [showCatalog, setShowCatalog] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const fetchConnectedAccounts = async () => {
    try {
      const response = await fetch(`${AGENT_URL}/integrations/connected`)
      if (response.ok) {
        const data = await response.json()
        setConnectedAccounts(data.connected || {})
      }
    } catch (err) {
      console.error('Failed to fetch connected accounts:', err)
    } finally {
      setLoadingConnections(false)
    }
  }

  useEffect(() => { fetchConnectedAccounts() }, [])

  const handleConnect = async (appId: string) => {
    setConnecting(appId)
    try {
      const response = await fetch(`${AGENT_URL}/integrations/connect/${appId}?redirect_url=${window.location.origin}/agent/connections`)
      if (!response.ok) throw new Error('Failed to get connection URL')
      const data = await response.json()
      if (data.redirect_url) window.open(data.redirect_url, '_blank')
    } catch (err) {
      console.error(err)
      alert('Error initiating connection. Please try again.')
    } finally {
      setConnecting(null)
    }
  }

  const handleDisconnect = async (accountId: string, accountName: string) => {
    if (!accountId) return
    if (!confirm(`Disconnect "${accountName}"? This will revoke access.`)) return
    setDisconnecting(accountId)
    try {
      const response = await fetch(`${AGENT_URL}/integrations/connected/${accountId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to disconnect')
      setToast(`Disconnected ${accountName}`)
      await fetchConnectedAccounts()
    } catch (err) {
      console.error(err)
      alert('Error disconnecting account. Please try again.')
    } finally {
      setDisconnecting(null)
    }
  }

  const getAppAccounts = (appId: string): ConnectedAccount[] => connectedAccounts[appId] || []
  const isConnected = (appId: string): boolean => getAppAccounts(appId).some(a => a.status === 'ACTIVE' || a.status === 'CONNECTED')

  return (
    <div className="flex flex-col h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans bg-dot-grid">
      <AnimatePresence>{toast && <Toast message={toast} onClose={() => setToast(null)} />}</AnimatePresence>
      <IntegrationsModal isOpen={showCatalog} onClose={() => setShowCatalog(false)} onConnect={handleConnect} connectedAccounts={connectedAccounts} connecting={connecting} />
      <header className="h-[56px] flex items-center justify-between px-6 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <Link href="/agent" className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-zinc-100"><ChevronLeft className="w-5 h-5" /></Link>
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800"><Database className="w-4 h-4 text-cyan-400" /><span className="text-[12px] font-black uppercase tracking-widest text-zinc-100">Integrations</span></div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { setLoadingConnections(true); fetchConnectedAccounts(); }} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-zinc-100" title="Refresh connections"><RefreshCw className={`w-4 h-4 ${loadingConnections ? 'animate-spin' : ''}`} /></button>
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter mr-2 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />Secured by Composio</div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-10 no-scrollbar">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight text-white">Power your agent</h1>
            <p className="text-zinc-500 text-base max-w-2xl leading-relaxed">Connect your professional tools to allow Atlas to execute tasks, manage your schedule, and organize your workflow automatically across 200+ platforms.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {INTEGRATIONS.map((app, index) => {
              const accounts = getAppAccounts(app.id)
              const connected = isConnected(app.id)
              return (
                <motion.div key={app.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={`group relative flex flex-col p-6 rounded-3xl bg-zinc-900/50 border ${connected ? 'border-emerald-500/30 ring-1 ring-emerald-500/10' : 'border-zinc-800/80'} hover:border-zinc-700 hover:bg-zinc-900 transition-all shadow-xl backdrop-blur-sm`}>
                  {connected && (<div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20"><CheckCircle2 className="w-3 h-3 text-emerald-400" /><span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Active</span></div>)}
                  <div className={`w-12 h-12 rounded-2xl ${app.color} flex items-center justify-center border mb-4 shadow-lg`}><app.icon className="w-6 h-6" /></div>
                  <div className="flex-1 space-y-2 mb-4"><h3 className="text-lg font-bold text-white tracking-tight">{app.name}</h3><p className="text-sm text-zinc-500 leading-relaxed font-medium">{app.description}</p></div>
                  {accounts.length > 0 && (
                    <div className="mb-4 space-y-1.5">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Connected Accounts ({accounts.length})</p>
                      {accounts.map((account, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 group/account">
                          <User className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                          <span className="text-xs text-zinc-300 font-medium truncate flex-1">{account.name}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider ${account.status === 'ACTIVE' || account.status === 'CONNECTED' ? 'text-emerald-400' : 'text-amber-400'}`}>{account.status === 'ACTIVE' || account.status === 'CONNECTED' ? '\u25cf' : '\u25cb'}</span>
                          {account.id && (<button onClick={(e) => { e.stopPropagation(); handleDisconnect(account.id!, account.name) }} disabled={disconnecting === account.id} className="ml-1 p-1 rounded-lg opacity-0 group-hover/account:opacity-100 hover:bg-red-500/20 text-zinc-600 hover:text-red-400 transition-all disabled:opacity-50" title="Disconnect account">{disconnecting === account.id ? (<Loader2 className="w-3 h-3 animate-spin" />) : (<Trash2 className="w-3 h-3" />)}</button>)}
                        </div>
                      ))}
                    </div>
                  )}
                  <button onClick={() => handleConnect(app.id)} disabled={connecting === app.id} className={`w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all transform active:scale-95 disabled:opacity-50 shadow-md ${connected ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700' : 'bg-zinc-100 text-black hover:bg-white'}`}>{connecting === app.id ? (<Loader2 className="w-4 h-4 animate-spin" />) : connected ? (<><Plus className="w-3.5 h-3.5" /><span>Add Another Account</span></>) : (<><span>Connect {app.name}</span><ExternalLink className="w-3.5 h-3.5" /></>)}</button>
                </motion.div>
              )
            })}
          </div>
          <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/5 border border-indigo-500/20 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-zinc-100 mx-auto flex items-center justify-center shadow-lg ring-4 ring-indigo-500/20"><Plus className="w-6 h-6 text-black" /></div>
            <div className="space-y-1"><h3 className="text-lg font-bold text-white tracking-tight">Looking for something else?</h3><p className="text-zinc-500 text-sm font-medium">We support over 200+ integrations including Jira, Linear, Twilio, and more.</p></div>
            <button onClick={() => setShowCatalog(true)} className="mt-4 px-6 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500/20 transition-all">Explore Integration Directory</button>
          </div>
        </div>
      </main>
      <p className="text-center text-[10px] text-zinc-800 font-bold uppercase tracking-[0.4em] py-8 border-t border-zinc-900/50">Composio Infrastructure \u2022 Secured Vibe Network \u2022 2026</p>
    </div>
  )
}
