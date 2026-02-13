import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { initContentProtection } from '@utils/protection'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const hasTracked = useRef(false)

  useEffect(() => {
    // Only track once per page load
    if (!router.isReady) {
      return
    }

    // Use full URL as key to prevent duplicate tracking for the same URL
    const fullUrl = typeof window !== 'undefined' ? window.location.href : router.asPath
    const trackingKey = `tracked_${fullUrl}`
    
    // Check if already tracked in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem(trackingKey)) {
      return
    }

    // Prevent duplicate tracking (especially in React Strict Mode)
    if (hasTracked.current) {
      return
    }

    // Mark as tracked immediately to prevent duplicate calls
    hasTracked.current = true
    
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(trackingKey, 'true')
    }

    // Track visitor when page loads
    const trackVisitor = async () => {
      try {
        const referer = document.referrer || ''
        const userAgent = navigator.userAgent
        const path = router.asPath
        
        // Get all URL query parameters
        const queryParams = router.query
        const fbclid = queryParams.fbclid as string || ''
        const currentFullUrl = typeof window !== 'undefined' ? window.location.href : ''
        
        // Extract all query parameters
        const allQueryParams: Record<string, string> = {}
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search)
          urlParams.forEach((value, key) => {
            allQueryParams[key] = value
          })
        }

        // Collect additional statistics
        const stats: Record<string, any> = {}
        
        if (typeof window !== 'undefined') {
          // Screen information
          stats.screen = {
            width: window.screen.width,
            height: window.screen.height,
            availWidth: window.screen.availWidth,
            availHeight: window.screen.availHeight,
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth,
          }
          
          // Viewport information
          stats.viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
          }
          
          // Browser information
          stats.browser = {
            language: navigator.language,
            languages: navigator.languages,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            doNotTrack: navigator.doNotTrack,
          }
          
          // Timezone information
          stats.timezone = {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
          }
          
          // Connection information (if available)
          if ('connection' in navigator) {
            const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
            if (conn) {
              stats.connection = {
                effectiveType: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt,
                saveData: conn.saveData,
              }
            }
          }
          
          // Device memory (if available)
          if ('deviceMemory' in navigator) {
            stats.deviceMemory = (navigator as any).deviceMemory
          }
          
          // Hardware concurrency
          stats.hardwareConcurrency = navigator.hardwareConcurrency || 'unknown'
          
          // Device type detection
          const ua = navigator.userAgent.toLowerCase()
          const isMobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)
          const isTablet = /tablet|ipad|playbook|silk/i.test(ua)
          stats.deviceType = isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'
          
          // Orientation
          stats.orientation = window.innerWidth > window.innerHeight ? 'Landscape' : 'Portrait'
          
          // Touch support
          stats.touchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0
          stats.maxTouchPoints = navigator.maxTouchPoints || 0
          
          // Browser detection
          const browserInfo = (() => {
            const uaLower = userAgent.toLowerCase()
            let browser = 'Unknown'
            let version = 'Unknown'
            
            if (uaLower.includes('chrome') && !uaLower.includes('edg')) {
              browser = 'Chrome'
              const match = userAgent.match(/Chrome\/([\d.]+)/)
              if (match) version = match[1]
            } else if (uaLower.includes('firefox')) {
              browser = 'Firefox'
              const match = userAgent.match(/Firefox\/([\d.]+)/)
              if (match) version = match[1]
            } else if (uaLower.includes('safari') && !uaLower.includes('chrome')) {
              browser = 'Safari'
              const match = userAgent.match(/Version\/([\d.]+)/)
              if (match) version = match[1]
            } else if (uaLower.includes('edg')) {
              browser = 'Edge'
              const match = userAgent.match(/Edg\/([\d.]+)/)
              if (match) version = match[1]
            } else if (uaLower.includes('opera') || uaLower.includes('opr')) {
              browser = 'Opera'
              const match = userAgent.match(/(?:Opera|OPR)\/([\d.]+)/)
              if (match) version = match[1]
            }
            
            return { name: browser, version }
          })()
          stats.browserInfo = browserInfo
          
          // Performance metrics
          if (typeof performance !== 'undefined' && performance.timing) {
            const perf = performance.timing
            stats.performance = {
              pageLoadTime: perf.loadEventEnd - perf.navigationStart,
              domContentLoaded: perf.domContentLoadedEventEnd - perf.navigationStart,
              firstByte: perf.responseStart - perf.navigationStart,
            }
          }
          
          // Session ID (generate if not exists)
          let sessionId = sessionStorage.getItem('session_id')
          if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            sessionStorage.setItem('session_id', sessionId)
          }
          stats.sessionId = sessionId
          
          // Visit count (increment if exists)
          let visitCount = parseInt(sessionStorage.getItem('visit_count') || '0', 10)
          visitCount++
          sessionStorage.setItem('visit_count', visitCount.toString())
          stats.visitCount = visitCount
          
          // Timestamp
          stats.timestamp = {
            clientTime: new Date().toISOString(),
            clientTimeLocal: new Date().toLocaleString('th-TH', {
              timeZone: 'Asia/Bangkok',
            }),
          }
        }

        await fetch('/api/track-visitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            referer,
            userAgent,
            path,
            fbclid,
            fullUrl: currentFullUrl,
            queryParams: allQueryParams,
            stats,
          }),
        })
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.error('Failed to track visitor:', error)
        // Reset tracking flag on error so it can retry
        hasTracked.current = false
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem(trackingKey)
        }
      }
    }

    // Track only once when router is ready
    trackVisitor()
  }, [router.isReady, router.asPath])

  // Initialize content protection
  useEffect(() => {
    const cleanup = initContentProtection()
    return cleanup
  }, [])

  return <Component {...pageProps} />
}

export default MyApp
