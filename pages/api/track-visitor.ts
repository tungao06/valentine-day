// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  success: boolean
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const { referer, userAgent, path, fbclid, fullUrl, queryParams, stats } = req.body

    // Get Discord webhook URL from environment variable
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL

    if (!discordWebhookUrl) {
      console.warn('DISCORD_WEBHOOK_URL is not set')
      return res.status(200).json({ 
        success: false, 
        message: 'Discord webhook not configured' 
      })
    }

    // Define social media click IDs and their platforms
    const socialMediaClids: Record<string, { name: string; emoji: string; color: number; domain?: string[] }> = {
      fbclid: { name: 'Facebook', emoji: '📘', color: 0x1877F2, domain: ['facebook.com', 'fb.com', 'm.facebook.com', 'l.facebook.com'] },
      gclid: { name: 'Google Ads', emoji: '🔍', color: 0x4285F4, domain: ['google.com', 'google.co.th'] },
      ttclid: { name: 'TikTok', emoji: '🎵', color: 0x000000, domain: ['tiktok.com', 'tiktok.co.th'] },
      twclid: { name: 'Twitter/X', emoji: '🐦', color: 0x1DA1F2, domain: ['twitter.com', 'x.com'] },
      li_fat_id: { name: 'LinkedIn', emoji: '💼', color: 0x0077B5, domain: ['linkedin.com'] },
      sc_cid: { name: 'Snapchat', emoji: '👻', color: 0xFFFC00, domain: ['snapchat.com'] },
      pinid: { name: 'Pinterest', emoji: '📌', color: 0xBD081C, domain: ['pinterest.com', 'pinterest.co.th'] },
      igshid: { name: 'Instagram', emoji: '📷', color: 0xE4405F, domain: ['instagram.com'] },
      ytclid: { name: 'YouTube', emoji: '📺', color: 0xFF0000, domain: ['youtube.com', 'youtu.be'] },
      msclkid: { name: 'Microsoft Ads', emoji: '🪟', color: 0x00A4EF, domain: ['bing.com', 'microsoft.com'] },
      utm_source: { name: 'UTM Source', emoji: '🔗', color: 0x5865F2, domain: [] },
      utm_medium: { name: 'UTM Medium', emoji: '📊', color: 0x5865F2, domain: [] },
      utm_campaign: { name: 'UTM Campaign', emoji: '📢', color: 0x5865F2, domain: [] },
    }

    // Extract all click IDs from query parameters
    const detectedClids: Array<{ key: string; value: string; info: any }> = []
    
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        const lowerKey = key.toLowerCase()
        if (socialMediaClids[lowerKey]) {
          detectedClids.push({
            key: lowerKey,
            value: value as string,
            info: socialMediaClids[lowerKey]
          })
        }
      })
    }

    // Check if visitor came from social media based on referer or clid
    let detectedPlatform: { name: string; emoji: string; color: number } | null = null
    let isFromSocialMedia = false

    if (detectedClids.length > 0) {
      // Use the first detected clid as primary platform
      detectedPlatform = detectedClids[0].info
      isFromSocialMedia = true
    } else if (referer) {
      // Check referer against known domains
      for (const [key, info] of Object.entries(socialMediaClids)) {
        if (info.domain && info.domain.some(domain => referer.includes(domain))) {
          detectedPlatform = info
          isFromSocialMedia = true
          break
        }
      }
    }

    // Legacy Facebook check (for backward compatibility)
    const isFromFacebook = referer?.includes('facebook.com') || 
                          referer?.includes('fb.com') ||
                          referer?.includes('m.facebook.com') ||
                          referer?.includes('l.facebook.com') ||
                          !!fbclid

    // Get visitor info
    const timestamp = new Date().toLocaleString('th-TH', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })

    // Create Discord message
    let title = '👤 มีคนเข้ามาดูเว็บ'
    let description = 'มีคนเข้ามาดูเว็บ Valentine Day'
    let color = 0x5865F2 // Default Discord blurple

    if (detectedClids.length > 0) {
      const primaryClid = detectedClids[0]
      title = `🔔 มีคนเข้ามาดูเว็บจาก ${primaryClid.info.name} (มี ${primaryClid.key})!`
      description = `**มีคนเข้ามาดูเว็บ Valentine Day จาก ${primaryClid.info.name} (มี ${primaryClid.key})!** 🎉${primaryClid.info.emoji}`
      color = primaryClid.info.color
    } else if (detectedPlatform) {
      title = `🔔 มีคนเข้ามาดูเว็บจาก ${detectedPlatform.name}!`
      description = `**มีคนเข้ามาดูเว็บ Valentine Day จาก ${detectedPlatform.name}!** 🎉${detectedPlatform.emoji}`
      color = detectedPlatform.color
    } else if (isFromFacebook) {
      title = '🔔 มีคนเข้ามาดูเว็บจาก Facebook!'
      description = '**มีคนเข้ามาดูเว็บ Valentine Day จาก Facebook!** 🎉'
      color = 0x1877F2
    }

    const embed = {
      title: title,
      description: description,
      color: color,
      fields: [
        {
          name: '🌐 Source',
          value: detectedClids.length > 0
            ? `**${detectedClids[0].info.name} (มี ${detectedClids[0].key})** ${detectedClids[0].info.emoji}✅`
            : detectedPlatform
              ? `**${detectedPlatform.name}** ${detectedPlatform.emoji}`
              : isFromFacebook
                ? '**Facebook** 📘'
                : referer || 'Direct / Unknown',
          inline: true
        },
        {
          name: '📄 Page',
          value: path || '/',
          inline: true
        },
        {
          name: '🕐 Time',
          value: timestamp,
          inline: true
        }
      ],
      footer: {
        text: 'Valentine Day Website Tracker'
      },
      timestamp: new Date().toISOString()
    }

    // Add summary of click IDs (short summary)
    if (detectedClids.length > 0) {
      const clidSummary = detectedClids.map(clid => {
        const clidValue = clid.value
        const clidLength = clidValue.length
        return `${clid.info.emoji} **${clid.info.name}** (\`${clid.key}\`): ${clidLength} chars`
      }).join('\n')
      
      embed.fields.push({
        name: '📊 Click IDs Summary',
        value: clidSummary,
        inline: false
      })

      // Add detailed click ID information (only first one to keep it short)
      const primaryClid = detectedClids[0]
      const clidValue = primaryClid.value
      const clidLength = clidValue.length
      
      embed.fields.push({
        name: `🔗 ${primaryClid.info.name} Click ID (${primaryClid.key})`,
        value: `\`\`\`${clidValue.length > 100 ? clidValue.substring(0, 100) + '...' : clidValue}\`\`\``,
        inline: false
      })

      // Add full URL if available
      if (fullUrl) {
        embed.fields.push({
          name: '🔗 Full URL',
          value: `\`\`\`${fullUrl.length > 300 ? fullUrl.substring(0, 300) + '...' : fullUrl}\`\`\``,
          inline: false
        })
      }
    }

    // Add referer if available and not from Facebook
    if (referer && !isFromFacebook) {
      embed.fields.push({
        name: '🔗 Referer',
        value: referer.length > 200 ? referer.substring(0, 200) + '...' : referer,
        inline: false
      })
    }

    // Add statistics if available
    if (stats) {
      const statsFields: any[] = []
      
      // Device & Screen Info
      if (stats.screen || stats.viewport) {
        const screenInfo = []
        if (stats.screen) {
          screenInfo.push(`**Screen:** ${stats.screen.width}x${stats.screen.height}`)
          screenInfo.push(`**Available:** ${stats.screen.availWidth}x${stats.screen.availHeight}`)
        }
        if (stats.viewport) {
          screenInfo.push(`**Viewport:** ${stats.viewport.width}x${stats.viewport.height}`)
        }
        if (stats.screen?.colorDepth) {
          screenInfo.push(`**Color Depth:** ${stats.screen.colorDepth} bit`)
        }
        statsFields.push({
          name: '📱 Screen & Viewport',
          value: screenInfo.join(' | '),
          inline: true
        })
      }
      
      // Browser Info
      if (stats.browser) {
        const browserInfo = []
        if (stats.browser.language) {
          browserInfo.push(`**Language:** ${stats.browser.language}`)
        }
        if (stats.browser.platform) {
          browserInfo.push(`**Platform:** ${stats.browser.platform}`)
        }
        if (stats.browser.onLine !== undefined) {
          browserInfo.push(`**Online:** ${stats.browser.onLine ? '✅' : '❌'}`)
        }
        if (stats.browser.cookieEnabled !== undefined) {
          browserInfo.push(`**Cookies:** ${stats.browser.cookieEnabled ? '✅' : '❌'}`)
        }
        statsFields.push({
          name: '🌐 Browser Info',
          value: browserInfo.join(' | '),
          inline: true
        })
      }
      
      // Timezone
      if (stats.timezone) {
        statsFields.push({
          name: '🕐 Timezone',
          value: `**${stats.timezone.timezone}** (UTC${stats.timezone.timezoneOffset > 0 ? '-' : '+'}${Math.abs(stats.timezone.timezoneOffset / 60)})`,
          inline: true
        })
      }
      
      // Connection Info
      if (stats.connection) {
        const connInfo = []
        if (stats.connection.effectiveType) {
          connInfo.push(`**Type:** ${stats.connection.effectiveType}`)
        }
        if (stats.connection.downlink) {
          connInfo.push(`**Downlink:** ${stats.connection.downlink} Mbps`)
        }
        if (stats.connection.rtt) {
          connInfo.push(`**RTT:** ${stats.connection.rtt} ms`)
        }
        if (stats.connection.saveData) {
          connInfo.push(`**Save Data:** ✅`)
        }
        if (connInfo.length > 0) {
          statsFields.push({
            name: '📶 Connection',
            value: connInfo.join(' | '),
            inline: true
          })
        }
      }
      
      // Device Memory & Hardware
      if (stats.deviceMemory || stats.hardwareConcurrency) {
        const hardwareInfo = []
        if (stats.deviceMemory) {
          hardwareInfo.push(`**Memory:** ${stats.deviceMemory} GB`)
        }
        if (stats.hardwareConcurrency) {
          hardwareInfo.push(`**CPU Cores:** ${stats.hardwareConcurrency}`)
        }
        if (hardwareInfo.length > 0) {
          statsFields.push({
            name: '💻 Hardware',
            value: hardwareInfo.join(' | '),
            inline: true
          })
        }
      }
      
      // Add all stats fields
      embed.fields.push(...statsFields)
      
      // Add user agent (shortened)
      if (userAgent) {
        // Try to extract browser and OS from user agent
        let browserInfo = 'Unknown'
        let osInfo = 'Unknown'
        
        if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
          browserInfo = 'Chrome'
        } else if (userAgent.includes('Firefox')) {
          browserInfo = 'Firefox'
        } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
          browserInfo = 'Safari'
        } else if (userAgent.includes('Edg')) {
          browserInfo = 'Edge'
        }
        
        if (userAgent.includes('Windows')) {
          osInfo = 'Windows'
        } else if (userAgent.includes('Mac')) {
          osInfo = 'macOS'
        } else if (userAgent.includes('Linux')) {
          osInfo = 'Linux'
        } else if (userAgent.includes('Android')) {
          osInfo = 'Android'
        } else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) {
          osInfo = 'iOS'
        }
        
        embed.fields.push({
          name: '💻 Device Summary',
          value: `**Browser:** ${browserInfo} | **OS:** ${osInfo}`,
          inline: false
        })
      }
    } else if (userAgent) {
      // Fallback if no stats
      embed.fields.push({
        name: '💻 User Agent',
        value: userAgent.length > 200 ? userAgent.substring(0, 200) + '...' : userAgent,
        inline: false
      })
    }

    // Send to Discord
    const response = await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    })

    if (!response.ok) {
      console.error('Failed to send Discord notification:', await response.text())
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send notification' 
      })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error tracking visitor:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    })
  }
}

