'use client'

import { useState } from 'react'
import {
  Maximize2,
  RefreshCw,
  ExternalLink,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
} from 'lucide-react'

type ViewportSize = 'desktop' | 'tablet' | 'mobile'

export default function VisualEditor() {
  const [previewUrl, setPreviewUrl] = useState('about:blank')
  const [viewport, setViewport] = useState<ViewportSize>('desktop')
  const [urlInput, setUrlInput] = useState('http://localhost:3001')

  const viewportWidths: Record<ViewportSize, string> = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  }

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault()
    setPreviewUrl(urlInput)
  }

  return (
    <div className="flex flex-col h-full bg-vibe-bg">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-vibe-border bg-vibe-surface/50">
        {/* Viewport Toggles */}
        <div className="flex items-center gap-0.5 p-0.5 bg-vibe-bg rounded">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded transition-colors ${
              viewport === 'desktop'
                ? 'bg-vibe-border text-vibe-accent'
                : 'text-vibe-muted hover:text-vibe-text'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded transition-colors ${
              viewport === 'tablet'
                ? 'bg-vibe-border text-vibe-accent'
                : 'text-vibe-muted hover:text-vibe-text'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded transition-colors ${
              viewport === 'mobile'
                ? 'bg-vibe-border text-vibe-accent'
                : 'text-vibe-muted hover:text-vibe-text'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* URL Bar */}
        <form onSubmit={handleNavigate} className="flex-1 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-vibe-bg border border-vibe-border rounded-md">
            <Globe className="w-3.5 h-3.5 text-vibe-muted flex-shrink-0" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter preview URL..."
              className="flex-1 bg-transparent text-xs text-vibe-text placeholder:text-vibe-muted/50 outline-none"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPreviewUrl(urlInput)}
            className="p-1.5 hover:bg-vibe-border rounded transition-colors text-vibe-muted hover:text-vibe-text"
            title="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 hover:bg-vibe-border rounded transition-colors text-vibe-muted hover:text-vibe-text"
            title="Open in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 hover:bg-vibe-border rounded transition-colors text-vibe-muted hover:text-vibe-text"
            title="Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-4 bg-vibe-bg/50 overflow-hidden">
        <div
          className="h-full bg-white rounded-lg overflow-hidden shadow-2xl shadow-black/50 transition-all duration-300 border border-vibe-border"
          style={{ width: viewportWidths[viewport], maxWidth: '100%' }}
        >
          {previewUrl === 'about:blank' ? (
            <div className="h-full flex flex-col items-center justify-center bg-vibe-surface gap-4">
              <div className="w-16 h-16 rounded-2xl bg-vibe-bg border border-vibe-border flex items-center justify-center">
                <Globe className="w-8 h-8 text-vibe-accent/50" />
              </div>
              <div className="text-center">
                <p className="text-sm text-vibe-text/80 mb-1">Visual Editor</p>
                <p className="text-xs text-vibe-muted">
                  Enter a URL above to preview your app
                </p>
              </div>
              <button
                onClick={() => {
                  setUrlInput('http://localhost:3001')
                  setPreviewUrl('http://localhost:3001')
                }}
                className="px-4 py-2 text-xs bg-vibe-accent/10 text-vibe-accent border border-vibe-accent/20 rounded-md hover:bg-vibe-accent/20 transition-colors"
              >
                Connect to localhost:3001
              </button>
            </div>
          ) : (
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title="Visual Editor Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          )}
        </div>
      </div>
    </div>
  )
}
