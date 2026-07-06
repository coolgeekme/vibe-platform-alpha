'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Square,
  Bot,
  User,
  ChevronRight,
  ArrowDown,
  Copy,
  Check,
  Calendar,
  Mic,
  Plus,
  MessageCircle,
  X
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useAgentChat, ChatMessage } from '@/hooks/useAgentChat'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { motion, AnimatePresence } from 'framer-motion'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function CodeBlock({ language, value }: { language: string; value: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-6 rounded-xl overflow-hidden border border-zinc-800 bg-black/40">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-zinc-800 text-[10px] text-zinc-500 uppercase font-black tracking-widest">
        <span>{language}</span>
        <button
          onClick={handleCopy}
          className="hover:text-zinc-200 transition-colors flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1.25rem',
          fontSize: '13px',
          lineHeight: '1.6',
          backgroundColor: 'transparent',
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  if (isSystem) {
    return (
      <div className="flex justify-center my-8">
        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] bg-zinc-900/30 px-4 py-1.5 rounded-full border border-zinc-800/50">
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex flex-col w-full max-w-4xl mx-auto px-6 py-8 relative", 
        isUser ? "items-end" : "items-start"
      )}
    >
      <div className={cn("flex items-start gap-4 w-full", isUser ? "flex-row-reverse" : "flex-row")}>
        {!isUser && (
           <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mt-1">
              <Bot className="w-4 h-4 text-cyan-400" />
           </div>
        )}
        
        <div className={cn("flex-1 min-w-0", isUser ? "flex flex-col items-end" : "flex flex-col items-start")}>
          {isUser ? (
             <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3.5 shadow-sm max-w-[85%]">
                <p className="text-[14px] text-zinc-200 leading-relaxed font-medium">{message.content}</p>
             </div>
          ) : (
            <div className="w-full space-y-4">
              {message.toolCalls && message.toolCalls.length > 0 && (
                <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer group">
                   <span>Used {message.toolCalls.length} tools</span>
                   <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              )}

              <div className="prose prose-invert prose-sm max-w-none text-zinc-300 leading-[1.7] text-[15px]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <CodeBlock
                          language={match[1]}
                          value={String(children).replace(/\n$/, '')}
                        />
                      ) : (
                        <code className={cn("bg-zinc-900 px-1.5 py-0.5 rounded text-cyan-400 text-xs font-mono border border-zinc-800", className)} {...props}>
                          {children}
                        </code>
                      )
                    },
                    p: ({ children }) => <p className="mb-5 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-5 mb-5 space-y-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-5 mb-5 space-y-2">{children}</ol>,
                    li: ({ children }) => <li className="mb-0">{children}</li>,
                    h1: ({ children }) => <h1 className="text-xl font-bold mb-5 mt-8 text-white">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-bold mb-4 mt-7 text-white">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-md font-bold mb-3 mt-6 text-white">{children}</h3>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-cyan-400/50 pl-5 italic text-zinc-400 my-6 bg-cyan-400/5 py-4 rounded-r-lg">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                
                {message.isStreaming && !message.content && (
                   <div className="flex gap-1.5 items-center py-2">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                   </div>
                )}
                
                {message.isStreaming && message.content && (
                   <span className="inline-block w-1.5 h-4 bg-cyan-400/80 animate-pulse ml-1 align-middle" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function ChatInterface() {
  const { messages, isLoading, sendMessage, stopGeneration, clearMessages } = useAgentChat()
  const [input, setInput] = useState('')
  const [showScrollDown, setShowScrollDown] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current && !showScrollDown) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, showScrollDown])

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      setShowScrollDown(scrollHeight - scrollTop - clientHeight > 100)
    }
  }

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
      setShowScrollDown(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage(input)
    setInput('')
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 240) + 'px'
  }

  return (
    <div className="flex flex-col h-full bg-zinc-950 bg-dot-grid relative">
      {/* Date Separators would go here - for now just the list */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto no-scrollbar scroll-smooth"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[60%] text-center px-4">
             <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
                <Bot className="w-8 h-8 text-zinc-600" />
             </div>
             <h2 className="text-2xl font-black tracking-tight text-white mb-2">Initialize Vibe Logic</h2>
             <p className="text-zinc-500 text-sm font-medium">Ready to orchestrate your workflow.</p>
          </div>
        )}

        <div className="w-full pb-60">
          <div className="flex justify-center my-8">
             <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest px-3 py-1 bg-zinc-900/50 rounded-full border border-zinc-800/30">Yesterday</span>
          </div>
          
          <div className="flex justify-center my-8">
             <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest px-3 py-1 bg-zinc-900/50 rounded-full border border-zinc-800/30">Today</span>
          </div>

          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>

        <AnimatePresence>
          {showScrollDown && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToBottom}
              className="fixed bottom-[180px] left-1/2 -translate-x-1/2 p-2.5 bg-zinc-900 border border-zinc-800 rounded-full shadow-2xl hover:bg-zinc-800 transition-all z-20 text-zinc-100"
            >
              <ArrowDown className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-8 left-0 right-0 px-6 z-30 pointer-events-none">
        <div className="max-w-[840px] mx-auto pointer-events-auto">
          {/* Action Row */}
          <div className="flex items-center gap-3 mb-4 overflow-x-auto no-scrollbar pb-1">
             {[
               { icon: <Plus className="w-3.5 h-3.5" />, label: 'Connect Calendar and block focus time' },
               { icon: <Flame className="w-3.5 h-3.5 text-orange-500" />, label: 'Remind me of birthdays and anniversaries' },
               { icon: <Calendar className="w-3.5 h-3.5" />, label: 'Tell me if my calendar changes' },
             ].map((s, i) => (
               <button
                 key={i}
                 onClick={() => sendMessage(s.label)}
                 className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-all shadow-sm"
               >
                 <span className="opacity-60">{s.icon}</span>
                 <span className="text-[11px] font-bold text-zinc-400 whitespace-nowrap">{s.label}</span>
               </button>
             ))}
          </div>

          {/* Main Input Box */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-[28px] shadow-2xl overflow-hidden focus-within:border-zinc-700 transition-all">
            {/* Top Banner */}
            <div className="flex items-center justify-between px-5 py-2.5 bg-gradient-to-r from-indigo-900/40 via-cyan-900/20 to-zinc-900 border-b border-zinc-800/50">
               <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-1">
                    <div className="w-4 h-4 rounded-full bg-zinc-100 flex items-center justify-center border border-white shadow-sm">
                       <span className="text-[8px] font-bold text-black italic">X</span>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-cyan-400 border border-white shadow-sm" />
                    <div className="w-4 h-4 rounded-full bg-zinc-800 flex items-center justify-center border border-white shadow-sm">
                       <span className="text-[8px] font-bold text-white tracking-tighter">228</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-black text-white/90 tracking-tight italic">Let Wingman run apps for you</span>
               </div>
               <div className="flex items-center gap-3">
                  <button className="px-3.5 py-1 rounded-full bg-zinc-100 text-black text-[10px] font-black uppercase tracking-wider hover:bg-white transition-colors">Connect</button>
                  <X className="w-3.5 h-3.5 text-zinc-600 cursor-pointer" />
               </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-2 pt-4">
               <div className="px-4 pb-2">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Reply to Atlas"
                    disabled={isLoading}
                    rows={1}
                    className="w-full bg-transparent text-[15px] text-white placeholder:text-zinc-600 outline-none resize-none font-medium leading-relaxed"
                    style={{ minHeight: '32px', maxHeight: '240px' }}
                  />
               </div>
               
               <div className="flex items-center justify-between px-2 pb-2">
                  <div className="flex items-center gap-1">
                    <button type="button" className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-full transition-all">
                       <Plus className="w-5 h-5" />
                    </button>
                    <button type="button" className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-full transition-all">
                       <Calendar className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button type="button" className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-full transition-all">
                       <Mic className="w-5 h-5" />
                    </button>
                    
                    {isLoading ? (
                      <button
                        type="button"
                        onClick={stopGeneration}
                        className="w-10 h-10 bg-zinc-100 text-black rounded-full hover:bg-white flex items-center justify-center transition-all shadow-lg"
                      >
                        <Square className="w-4 h-4 fill-current" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!input.trim()}
                        className="w-10 h-10 bg-zinc-800 text-zinc-400 rounded-full border border-zinc-700 hover:bg-zinc-700 hover:text-white flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4 translate-x-0.5 -translate-y-0.5" />
                      </button>
                    )}
                  </div>
               </div>
            </form>
          </div>
        </div>
      </div>

      {/* Floating Chat Widget Icon (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
         <div className="relative group cursor-pointer transition-transform active:scale-95">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-2xl border border-zinc-200">
               <MessageCircle className="w-6 h-6 text-black" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-black border border-white text-white rounded-full flex items-center justify-center text-[10px] font-black">2</div>
         </div>
      </div>
    </div>
  )
}
