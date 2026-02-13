import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    // Track visitor when page loads
    const trackVisitor = async () => {
      try {
        const referer = document.referrer || ''
        const userAgent = navigator.userAgent
        const path = router.asPath
        
        // Get all URL query parameters
        const queryParams = router.query
        const fbclid = queryParams.fbclid as string || ''
        const fullUrl = typeof window !== 'undefined' ? window.location.href : ''
        
        // Extract all query parameters
        const allQueryParams: Record<string, string> = {}
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search)
          urlParams.forEach((value, key) => {
            allQueryParams[key] = value
          })
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
            fullUrl,
            queryParams: allQueryParams,
          }),
        })
      } catch (error) {
        // Silently fail - don't interrupt user experience
        console.error('Failed to track visitor:', error)
      }
    }

    // Track on initial page load (wait for router to be ready)
    if (router.isReady) {
      trackVisitor()
    }

    // Track on route change
    const handleRouteChange = () => {
      trackVisitor()
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])

  return <Component {...pageProps} />
}

export default MyApp
