'use client'

import { useEffect, useRef } from 'react'

const AGENT_URL = 'https://agent.coolgeek.me'

export default function PushNotificationManager() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    async function setupPush() {
      // Check browser support
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.log('[Push] Not supported in this browser')
        return
      }

      try {
        // Register service worker
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('[Push] Service worker registered')

        // Request notification permission
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
          console.log('[Push] Permission denied')
          return
        }

        // Fetch VAPID public key from backend
        const vapidRes = await fetch(`${AGENT_URL}/notifications/vapid-public-key`)
        const { public_key } = await vapidRes.json()
        if (!public_key) {
          console.log('[Push] No VAPID public key configured')
          return
        }

        // Convert VAPID key to Uint8Array
        const applicationServerKey = urlBase64ToUint8Array(public_key)

        // Subscribe to push
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey,
        })

        // Send subscription to backend
        await fetch(`${AGENT_URL}/notifications/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: subscription.toJSON() }),
        })

        console.log('[Push] Subscribed successfully')
      } catch (err) {
        console.error('[Push] Setup failed:', err)
      }
    }

    // Small delay to not block initial render
    setTimeout(setupPush, 2000)
  }, [])

  return null
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
