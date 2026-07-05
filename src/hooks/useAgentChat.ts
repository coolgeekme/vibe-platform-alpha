'use client'

import { useState, useCallback, useRef } from 'react'

const AGENT_URL = 'https://agent.coolgeek.me'

export type MessageRole = 'user' | 'assistant' | 'system'

export interface ToolCall {
  id: string
  name: string
  arguments: string
  result?: string
  status: 'pending' | 'running' | 'completed' | 'error'
}

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  toolCalls?: ToolCall[]
  isStreaming?: boolean
}

export function useAgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    const assistantId = generateId()
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
      toolCalls: [],
    }

    setMessages(prev => [...prev, assistantMessage])

    try {
      abortRef.current = new AbortController()

      const response = await fetch(`${AGENT_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.trim(),
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
        signal: abortRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const contentType = response.headers.get('content-type') || ''

      if (contentType.includes('text/event-stream') || contentType.includes('stream')) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (reader) {
          let fullContent = ''
          let toolCalls: ToolCall[] = []

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') break

                try {
                  const parsed = JSON.parse(data)

                  if (parsed.type === 'content' || parsed.type === 'text') {
                    fullContent += parsed.content || parsed.text || ''
                    setMessages(prev =>
                      prev.map(m =>
                        m.id === assistantId
                          ? { ...m, content: fullContent }
                          : m
                      )
                    )
                  } else if (parsed.type === 'tool_call') {
                    const toolCall: ToolCall = {
                      id: parsed.id || generateId(),
                      name: parsed.name || parsed.tool,
                      arguments: typeof parsed.arguments === 'string'
                        ? parsed.arguments
                        : JSON.stringify(parsed.arguments, null, 2),
                      status: 'running',
                    }
                    toolCalls = [...toolCalls, toolCall]
                    setMessages(prev =>
                      prev.map(m =>
                        m.id === assistantId
                          ? { ...m, toolCalls: [...toolCalls] }
                          : m
                      )
                    )
                  } else if (parsed.type === 'tool_result') {
                    toolCalls = toolCalls.map(tc =>
                      tc.id === parsed.id || tc.name === parsed.name
                        ? {
                            ...tc,
                            result: typeof parsed.result === 'string'
                              ? parsed.result
                              : JSON.stringify(parsed.result, null, 2),
                            status: parsed.error ? 'error' : 'completed',
                          }
                        : tc
                    )
                    setMessages(prev =>
                      prev.map(m =>
                        m.id === assistantId
                          ? { ...m, toolCalls: [...toolCalls] }
                          : m
                      )
                    )
                  }
                } catch {
                  fullContent += data
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === assistantId
                        ? { ...m, content: fullContent }
                        : m
                    )
                  )
                }
              }
            }
          }
        }
      } else {
        const data = await response.json()
        const content = data.content || data.message || data.response || JSON.stringify(data)
        const toolCalls: ToolCall[] = (data.tool_calls || data.toolCalls || []).map((tc: any) => ({
          id: tc.id || generateId(),
          name: tc.name || tc.function?.name,
          arguments: typeof tc.arguments === 'string'
            ? tc.arguments
            : JSON.stringify(tc.arguments || tc.function?.arguments, null, 2),
          result: tc.result ? (typeof tc.result === 'string' ? tc.result : JSON.stringify(tc.result, null, 2)) : undefined,
          status: tc.result ? 'completed' : 'pending',
        }))

        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content, toolCalls: toolCalls.length > 0 ? toolCalls : undefined }
              : m
          )
        )
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: m.content || '(cancelled)', isStreaming: false }
              : m
          )
        )
      } else {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? {
                  ...m,
                  content: `\u26a0\ufe0f Connection error: ${err.message}. The agent endpoint may be unavailable.`,
                  isStreaming: false,
                }
              : m
          )
        )
      }
    } finally {
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId ? { ...m, isStreaming: false } : m
        )
      )
      setIsLoading(false)
      abortRef.current = null
    }
  }, [messages, isLoading])

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    sendMessage,
    stopGeneration,
    clearMessages,
  }
}
