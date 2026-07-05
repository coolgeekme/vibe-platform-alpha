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
} from 'lucide-react'
import { useAgentChat, ChatMessage } from '@/hooks/useAgentChat'
import ToolExecutionCard from './ToolExecutionCard'

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <span className="text-[10px] text-vibe-muted bg-vibe-border/30 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div className={`flex gap-3 py-4 px-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-vibe-purple/30 to-vibe-cyan/20 border border-vibe-purple/30 flex items-center justify-center">
          <Bot className="w-3.5 h-3.5 text-vibe-purple" />
        </div>
      )}

      <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-vibe-muted">
            {isUser ? 'You' : 'Atlas'}
          </span>
          <span className="text-[9px] text-vibe-muted/50">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div
          className={`rounded-xl px-4 py-3 ${
            isUser
              ? 'bg-vibe-accent/10 border border-vibe-accent/20 text-vibe-text'
              : 'bg-vibe-surface border border-vibe-border text-vibe-text/90'
          }`}
        >
          {message.content ? (
            <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </div>
          ) : message.isStreaming ? (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-vibe-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-vibe-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-vibe-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-vibe-muted">Thinking...</span>
            </div>
          ) : null}

          {message.isStreaming && message.content && (
            <span className="inline-block w-0.5 h-4 bg-vibe-accent animate-pulse ml-0.5 align-middle" />
          )}
        </div>

        {/* Tool Calls */}
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className="w-full mt-2 space-y-1">
            {message.toolCalls.map(tc => (
              <ToolExecutionCard key={tc.id} toolCall={tc} />
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-vibe-accent/20 to-vibe-accent/5 border border-vibe-accent/30 flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-vibe-accent" />
        </div>
      )}
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
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
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
    el.style.height = Math.min(el.scrollHeight, 150) + 'px'
  }

  return (
    <div className="flex flex-col h-full bg-vibe-bg">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-vibe-border bg-vibe-surface/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-vibe-purple to-vibe-cyan flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-vibe-text">Atlas Wingman</h1>
            <p className="text-[10px] text-vibe-muted">
              Connected to agent.coolgeek.me
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-vibe-accent animate-pulse" />
            <span className="text-[10px] text-vibe-accent font-medium">Online</span>
          </div>
          <button
            onClick={clearMessages}
            className="p-2 hover:bg-vibe-border/50 rounded-lg transition-colors text-vibe-muted hover:text-vibe-text"
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
        className="flex-1 overflow-y-auto relative"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-vibe-purple/20 to-vibe-cyan/10 border border-vibe-purple/20 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-vibe-purple/70" />
            </div>
            <h2 className="text-lg font-bold text-vibe-text mb-1">Atlas Agent</h2>
            <p className="text-sm text-vibe-muted max-w-md">
              Your autonomous AI wingman. Ask me to execute tasks, search the web, manage schedules, or interact with your connected integrations.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-6 max-w-sm w-full">
              {[
                'What\'s on my calendar today?',
                'Search for React 19 updates',
                'Check my durable memory',
                'Run a web search for me',
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(suggestion)}
                  className="px-3 py-2.5 text-xs text-vibe-muted hover:text-vibe-text bg-vibe-surface border border-vibe-border hover:border-vibe-purple/30 rounded-lg transition-all text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Scroll to bottom button */}
        {showScrollDown && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 bg-vibe-surface border border-vibe-border rounded-full shadow-lg hover:bg-vibe-border transition-colors"
          >
            <ArrowDown className="w-4 h-4 text-vibe-text" />
          </button>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-vibe-border bg-vibe-surface/50 backdrop-blur-sm p-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={isLoading ? 'Waiting for response...' : 'Send a message to Atlas...'}
              disabled={isLoading}
              rows={1}
              className="w-full px-4 py-3 bg-vibe-bg border border-vibe-border rounded-xl text-sm text-vibe-text placeholder:text-vibe-muted/50 outline-none focus:border-vibe-purple/50 focus:ring-1 focus:ring-vibe-purple/20 resize-none disabled:opacity-50 transition-all"
              style={{ minHeight: '44px', maxHeight: '150px' }}
            />
          </div>

          {isLoading ? (
            <button
              type="button"
              onClick={stopGeneration}
              className="p-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors flex-shrink-0"
              title="Stop generation"
            >
              <Square className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-3 bg-vibe-accent/10 border border-vibe-accent/30 text-vibe-accent rounded-xl hover:bg-vibe-accent/20 transition-colors disabled:opacity-30 disabled:hover:bg-vibe-accent/10 flex-shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </form>
        <p className="text-center text-[10px] text-vibe-muted/40 mt-2">
          Atlas • Powered by Emergent Wingman • Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
