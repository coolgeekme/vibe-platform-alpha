'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Square,
  Bot,
  User,
  Sparkles,
  Trash2,
  ArrowDown,
  Copy,
  Check
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useAgentChat, ChatMessage } from '@/hooks/useAgentChat'
import ToolExecutionCard from './ToolExecutionCard'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
    <div className="relative group my-4 rounded-lg overflow-hidden border border-vibe-border">
      <div className="flex items-center justify-between px-4 py-1.5 bg-vibe-surface border-b border-vibe-border text-[10px] text-vibe-muted uppercase font-bold tracking-wider">
        <span>{language}</span>
        <button
          onClick={handleCopy}
          className="hover:text-vibe-text transition-colors flex items-center gap-1"
        >
          {copied ? <Check className="w-3 h-3 text-vibe-accent" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem',
          fontSize: '12px',
          backgroundColor: '#09090b',
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
      <div className="flex justify-center my-4">
        <span className="text-[10px] text-vibe-muted font-medium bg-vibe-border/20 px-3 py-1 rounded-full border border-vibe-border/30">
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div className={cn("flex w-full gap-4 px-6 py-6 border-b border-vibe-border/30", 
      isUser ? "bg-transparent" : "bg-vibe-surface/20"
    )}>
      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-1">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-vibe-border flex items-center justify-center border border-vibe-border/50 shadow-sm">
             <User className="w-4 h-4 text-vibe-muted" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-vibe-accent flex items-center justify-center shadow-md shadow-vibe-accent/20">
             <Bot className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-4">
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-bold tracking-tight", isUser ? "text-vibe-text" : "text-vibe-text")}>
            {isUser ? 'You' : 'Atlas'}
          </span>
          <span className="text-[10px] text-vibe-muted/50 font-medium">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="prose prose-invert prose-sm max-w-none text-vibe-text/90 leading-relaxed">
          {message.content ? (
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
                    <code className={cn("bg-vibe-border/50 px-1.5 py-0.5 rounded text-vibe-accent text-xs font-mono", className)} {...props}>
                      {children}
                    </code>
                  )
                },
                p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="mb-0">{children}</li>,
                h1: ({ children }) => <h1 className="text-lg font-bold mb-4 mt-6">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-bold mb-3 mt-5">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-bold mb-2 mt-4">{children}</h3>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-vibe-accent/30 pl-4 italic text-vibe-muted my-4">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4 border border-vibe-border rounded-lg">
                    <table className="min-w-full divide-y divide-vibe-border">{children}</table>
                  </div>
                ),
                th: ({ children }) => <th className="px-4 py-2 bg-vibe-surface/50 text-left text-xs font-bold text-vibe-muted uppercase tracking-wider">{children}</th>,
                td: ({ children }) => <td className="px-4 py-2 border-t border-vibe-border text-xs">{children}</td>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : message.isStreaming ? (
            <div className="flex items-center gap-2 py-1">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-vibe-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-vibe-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-vibe-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          ) : null}

          {message.isStreaming && message.content && (
            <span className="inline-block w-1 h-4 bg-vibe-accent/70 animate-pulse ml-1 align-middle" />
          )}
        </div>

        {/* Tool Calls */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="space-y-2 mt-4 max-w-2xl">
            {message.toolCalls.map(tc => (
              <ToolExecutionCard key={tc.id} toolCall={tc} />
            ))}
          </div>
        )}
      </div>
    </div>
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
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }

  return (
    <div className="flex flex-col h-full bg-vibe-bg font-sans">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-vibe-border bg-vibe-bg/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-vibe-accent flex items-center justify-center shadow-lg shadow-vibe-accent/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-vibe-text flex items-center gap-2">
              Atlas Assistant
              <span className="px-1.5 py-0.5 bg-vibe-accent/10 border border-vibe-accent/20 rounded text-[9px] uppercase tracking-tighter text-vibe-accent">Pro</span>
            </h1>
            <p className="text-[10px] text-vibe-muted font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-vibe-accent animate-pulse" />
              Connected to Brain • Groq Inference
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button
            onClick={clearMessages}
            className="p-2 hover:bg-vibe-border/50 rounded-lg transition-all text-vibe-muted hover:text-vibe-text"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto relative scroll-smooth bg-vibe-bg"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[80%] text-center px-4">
            <div className="w-20 h-20 rounded-3xl bg-vibe-surface border border-vibe-border flex items-center justify-center mb-6 shadow-2xl">
              <Bot className="w-10 h-10 text-vibe-accent/80" />
            </div>
            <h2 className="text-2xl font-bold text-vibe-text mb-2 tracking-tight">How can I help today?</h2>
            <p className="text-sm text-vibe-muted max-w-sm leading-relaxed mb-8">
              I can manage your projects, search the web, and execute tasks across your connected accounts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
              {[
                { label: 'Check my calendar', sub: 'Show upcoming events' },
                { label: 'Summarize GitHub repo', sub: 'Analyze recent activity' },
                { label: 'Update durable memory', sub: 'Save important facts' },
                { label: 'Vibe code a component', sub: 'Visual + Code edits' },
              ].map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s.label)}
                  className="p-4 text-left bg-vibe-surface border border-vibe-border hover:border-vibe-accent/40 rounded-xl transition-all group"
                >
                  <div className="text-xs font-bold text-vibe-text group-hover:text-vibe-accent mb-0.5">{s.label}</div>
                  <div className="text-[10px] text-vibe-muted font-medium">{s.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="max-w-none mx-auto w-full">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>

        {/* Scroll to bottom button */}
        {showScrollDown && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 p-2.5 bg-vibe-surface border border-vibe-border rounded-full shadow-2xl hover:bg-vibe-border transition-all z-20"
          >
            <ArrowDown className="w-4 h-4 text-vibe-text" />
          </button>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-vibe-bg border-t border-vibe-border p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-end gap-4">
          <div className="flex-1 bg-vibe-surface border border-vibe-border rounded-2xl focus-within:border-vibe-accent/50 focus-within:ring-1 focus-within:ring-vibe-accent/20 transition-all p-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={isLoading ? 'Atlas is thinking...' : 'Message Atlas Assistant...'}
              disabled={isLoading}
              rows={1}
              className="w-full px-4 py-3 bg-transparent text-sm text-vibe-text placeholder:text-vibe-muted/50 outline-none resize-none disabled:opacity-50"
              style={{ minHeight: '44px', maxHeight: '200px' }}
            />
          </div>

          {isLoading ? (
            <button
              type="button"
              onClick={stopGeneration}
              className="w-11 h-11 bg-vibe-surface border border-red-500/20 text-red-500 rounded-2xl hover:bg-red-500/10 transition-colors flex items-center justify-center flex-shrink-0"
              title="Stop"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-11 h-11 bg-vibe-accent text-white rounded-2xl hover:bg-vibe-accent-dim transition-all shadow-lg shadow-vibe-accent/20 disabled:opacity-30 disabled:shadow-none flex items-center justify-center flex-shrink-0"
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </form>
        <p className="text-center text-[10px] text-vibe-muted/30 mt-3 font-medium tracking-tight">
          Vibe Platform • Version 0.2.1 • Press Enter to send
        </p>
      </div>
    </div>
  )
}
