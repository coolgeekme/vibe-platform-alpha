import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Atlas \u2014 Wingman',
  description: 'Your AI personal assistant',
  manifest: '/manifest.json',
  themeColor: '#09090b',
}

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
