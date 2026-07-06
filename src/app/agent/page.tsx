'use client'

import { useState } from 'react'
import { 
  Plus, 
  MessageSquare, 
  CheckSquare, 
  Settings, 
  Bell, 
  User, 
  Zap, 
  Flame,
  LayoutGrid
} from 'lucide-react'
import ChatInterface from '@/components/agent/ChatInterface'
import { motion, AnimatePresence } from 'framer-motion'

export default function AgentPage() {
  const [activeTab, setActiveAgent] = useState('Chat')

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Sidebar - Far Left */}
      <div className="w-[60px] flex flex-col items-center py-4 border-r border-zinc-800 bg-zinc-950 z-30">
        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 shadow-lg overflow-hidden">
          <img src="https://avatars.githubusercontent.com/u/100000000?v=4" alt="profile" className="w-full h-full object-cover opacity-80" />
        </div>
        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 cursor-pointer hover:bg-zinc-800 transition-colors">
          <span className="text-[10px] font-bold text-zinc-500">M</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-4">
           <button className="w-10 h-10 rounded-full border border-zinc-800/50 flex items-center justify-center text-zinc-600 hover:text-zinc-400 hover:bg-zinc-900 transition-all">
             <Plus className="w-5 h-5" />
           </button>
        </div>
        <div className="mb-4 text-zinc-700">
           <Settings className="w-5 h-5 cursor-pointer hover:text-zinc-500 transition-colors" />
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-[56px] flex items-center justify-between px-6 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-cyan-400/20 border border-cyan-400/30">
               <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
               <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">Wingman</span>
            </div>

            <nav className="flex items-center gap-6">
              <button 
                onClick={() => setActiveAgent('Chat')}
                className={`flex items-center gap-2 text-xs font-bold transition-colors ${activeTab === 'Chat' ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <div className={`w-2 h-2 rounded-full ${activeTab === 'Chat' ? 'bg-cyan-400' : 'bg-transparent'}`} />
                Chat
              </button>
              <button 
                onClick={() => setActiveAgent('Tasks')}
                className={`flex items-center gap-2 text-xs font-bold transition-colors ${activeTab === 'Tasks' ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                 <CheckSquare className="w-3.5 h-3.5" />
                 Tasks
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
               <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
               <span className="text-[11px] font-bold">8</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 cursor-pointer hover:bg-indigo-500/20 transition-all">
               <Plus className="w-3.5 h-3.5" />
               <span className="text-[11px] font-black uppercase tracking-tight italic">Credits</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[11px] font-bold text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors">
               <User className="w-3.5 h-3.5" />
               Meet Your Advisor
            </div>
            <div className="flex items-center gap-3 ml-2 border-l border-zinc-800 pl-4 text-zinc-500">
               <Bell className="w-4 h-4 cursor-pointer hover:text-zinc-300" />
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-700 flex items-center justify-center text-[10px] font-black cursor-pointer overflow-hidden shadow-inner">
                  <img src="https://avatars.githubusercontent.com/u/100000000?v=4" alt="user" className="w-full h-full object-cover" />
               </div>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 min-h-0 relative">
          <ChatInterface />
        </main>
      </div>

      {/* Setup Button (Floating Right) */}
      <div className="absolute top-[68px] right-6 z-20">
         <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-200">
            <Settings className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Setup</span>
         </button>
      </div>
    </div>
  )
}
