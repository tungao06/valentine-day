/**
 * Content Protection Utilities
 * 
 * Prevents screen capture, recording, and image downloading
 * Similar to Netflix's protection system
 */

// Disable right-click context menu
export function disableRightClick() {
  if (typeof window === 'undefined') return

  document.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    return false
  }, false)

  // Also prevent on touch devices
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault()
    }
  }, { passive: false })
}

// Disable keyboard shortcuts for screenshots and developer tools
export function disableKeyboardShortcuts() {
  if (typeof window === 'undefined') return

  document.addEventListener('keydown', (e) => {
    // Disable Print Screen
    if (e.key === 'PrintScreen') {
      e.preventDefault()
      return false
    }

    // Disable F12 (Developer Tools)
    if (e.key === 'F12') {
      e.preventDefault()
      return false
    }

    // Disable Ctrl+Shift+I (Developer Tools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
      e.preventDefault()
      return false
    }

    // Disable Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
      e.preventDefault()
      return false
    }

    // Disable Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
      e.preventDefault()
      return false
    }

    // Disable Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault()
      return false
    }

    // Disable Ctrl+S (Save Page)
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      return false
    }

    // Disable Ctrl+P (Print)
    if (e.ctrlKey && e.key === 'p') {
      e.preventDefault()
      return false
    }

    // Disable Ctrl+A (Select All)
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault()
      return false
    }

    // Disable Ctrl+C (Copy)
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault()
      return false
    }

    // Disable Ctrl+X (Cut)
    if (e.ctrlKey && e.key === 'x') {
      e.preventDefault()
      return false
    }

    // Disable Ctrl+V (Paste) - optional, can be removed if needed
    // if (e.ctrlKey && e.key === 'v') {
    //   e.preventDefault()
    //   return false
    // }
  }, false)
}

// Disable text selection
export function disableTextSelection() {
  if (typeof window === 'undefined') return

  document.addEventListener('selectstart', (e) => {
    e.preventDefault()
    return false
  }, false)

  // Also disable for touch devices
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault()
    }
  }, { passive: false })
}

// Disable drag and drop for images
export function disableDragDrop() {
  if (typeof window === 'undefined') return

  document.addEventListener('dragstart', (e) => {
    if (e.target instanceof HTMLImageElement || e.target instanceof HTMLVideoElement) {
      e.preventDefault()
      return false
    }
  }, false)

  document.addEventListener('drop', (e) => {
    e.preventDefault()
    return false
  }, false)

  document.addEventListener('dragover', (e) => {
    e.preventDefault()
    return false
  }, false)
}

// Detect screen sharing/capture
export function detectScreenCapture() {
  if (typeof window === 'undefined') return () => {}

  let isCapturing = false

  // Detect if user is sharing screen (getDisplayMedia)
  const checkScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      if (stream) {
        isCapturing = true
        // Stop the stream immediately
        stream.getTracks().forEach(track => track.stop())
        // Show warning or hide content
        showProtectionWarning()
      }
    } catch (err) {
      // User denied or error
    }
  }

  // Monitor for screen capture events
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Page is hidden, might be capturing
      setTimeout(() => {
        if (document.hidden) {
          showProtectionWarning()
        }
      }, 100)
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)

  // Detect Print Screen key
  document.addEventListener('keyup', (e) => {
    if (e.key === 'PrintScreen') {
      showProtectionWarning()
    }
  })

  // Cleanup function
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
}

// Show protection warning
function showProtectionWarning() {
  if (typeof window === 'undefined') return

  const warning = document.createElement('div')
  warning.id = 'protection-warning'
  warning.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999999;
    font-family: Arial, sans-serif;
    font-size: 24px;
    text-align: center;
    padding: 20px;
  `
  warning.innerHTML = `
    <div>
      <h2 style="color: #ff6b6b; margin-bottom: 20px;">⚠️ การบันทึกหน้าจอไม่ได้รับอนุญาต</h2>
      <p style="margin-bottom: 10px;">Screen recording is not allowed</p>
      <p style="font-size: 16px; color: #ccc;">กรุณาปิดการบันทึกหน้าจอเพื่อดูเนื้อหาต่อ</p>
    </div>
  `

  document.body.appendChild(warning)

  // Remove warning after 3 seconds
  setTimeout(() => {
    if (warning.parentNode) {
      warning.parentNode.removeChild(warning)
    }
  }, 3000)
}

// Add watermark overlay to images
export function addWatermarkToImages() {
  if (typeof window === 'undefined') return () => {}

  const addWatermark = (img: HTMLImageElement) => {
    // Skip if already has watermark or if it's a small icon
    if (img.dataset.watermarked === 'true') return
    if (img.width < 50 || img.height < 50) return // Skip small images like icons

    const container = img.parentElement
    if (!container) return

    // Check if container already has watermark
    if (container.querySelector('.watermark-overlay')) return

    // Create watermark overlay
    const watermark = document.createElement('div')
    watermark.className = 'watermark-overlay'
    watermark.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      background: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 100px,
        rgba(255, 255, 255, 0.03) 100px,
        rgba(255, 255, 255, 0.03) 200px
      );
      z-index: 1;
    `

    // Make container relative if not already
    const containerStyle = getComputedStyle(container)
    if (containerStyle.position === 'static') {
      container.style.position = 'relative'
    }

    container.appendChild(watermark)
    img.dataset.watermarked = 'true'
  }

  // Add watermark to all existing images
  const images = document.querySelectorAll('img')
  images.forEach(addWatermark)

  // Watch for new images
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLImageElement) {
          addWatermark(node)
        } else if (node instanceof HTMLElement) {
          const imgs = node.querySelectorAll('img')
          imgs.forEach(addWatermark)
        }
      })
    })
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })

  return () => observer.disconnect()
}

// Initialize all protection measures
export function initContentProtection() {
  if (typeof window === 'undefined') return () => {}

  disableRightClick()
  disableKeyboardShortcuts()
  disableTextSelection()
  disableDragDrop()
  const cleanupScreenCapture = detectScreenCapture()
  const cleanupWatermark = addWatermarkToImages()

  // Return cleanup function
  return () => {
    cleanupScreenCapture()
    if (cleanupWatermark) {
      cleanupWatermark()
    }
  }
}

