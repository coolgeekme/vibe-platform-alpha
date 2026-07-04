'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

interface UseSocketOptions {
  url?: string
  autoConnect?: boolean
}

interface SocketMessage {
  type: 'output' | 'error' | 'status'
  data: string
  agent?: 'claude' | 'codex'
  timestamp: number
}

export function useSocket(options: UseSocketOptions = {}) {
  const { url = 'http://localhost:4000', autoConnect = false } = options
  const socketRef = useRef<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<SocketMessage[]>([])

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return

    const socket = io(url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    socket.on('agent:output', (msg: SocketMessage) => {
      setMessages((prev) => [...prev, msg])
    })

    socket.on('agent:error', (msg: SocketMessage) => {
      setMessages((prev) => [...prev, { ...msg, type: 'error' }])
    })

    socket.on('agent:status', (msg: SocketMessage) => {
      setMessages((prev) => [...prev, { ...msg, type: 'status' }])
    })

    socketRef.current = socket
  }, [url])

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect()
    socketRef.current = null
    setConnected(false)
  }, [])

  const sendCommand = useCallback((command: string, agent: 'claude' | 'codex') => {
    if (!socketRef.current?.connected) return false
    socketRef.current.emit('agent:command', { command, agent })
    return true
  }, [])

  useEffect(() => {
    if (autoConnect) connect()
    return () => { disconnect() }
  }, [autoConnect, connect, disconnect])

  return {
    connected,
    messages,
    connect,
    disconnect,
    sendCommand,
  }
}
