'use client'

import { useState, useEffect } from 'react'
import { Brain, Clock } from 'lucide-react'

export default function BrainStatus() {
  const [currentTime, setCurrentTime] = useState<string>('')
  const [currentDate, setCurrentDate] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      // Display in MST (America/Phoenix)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Phoenix',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }
      const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Phoenix',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }
      setCurrentTime(now.toLocaleTimeString('en-US', options) + ' MST')
      setCurrentDate(now.toLocaleDateString('en-US', dateOptions))
    }

    updateTime()
    const interval = setInterval(updateTime, 30000) // Update every 30s
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
      <Brain className="w-3.5 h-3.5 text-emerald-400" />
      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tight">
        gpt-4o
      </span>
      <div className="w-px h-3 bg-emerald-500/30" />
      <Clock className="w-3 h-3 text-emerald-400/70" />
      <span className="text-[10px] font-medium text-emerald-400/80">
        {currentDate || 'Jul 6, 2026'}
      </span>
    </div>
  )
}
