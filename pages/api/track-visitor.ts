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
    const { referer, userAgent, path, fbclid, fullUrl, queryParams } = req.body

    // Get Discord webhook URL from environment variable
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL

    if (!discordWebhookUrl) {
      console.warn('DISCORD_WEBHOOK_URL is not set')
      return res.status(200).json({ 
        success: false, 
        message: 'Discord webhook not configured' 
      })
    }

    // Check if visitor came from Facebook
    const isFromFacebook = referer?.includes('facebook.com') || 
                          referer?.includes('fb.com') ||
                          referer?.includes('m.facebook.com') ||
                          referer?.includes('l.facebook.com') ||
                          !!fbclid // If has fbclid, definitely from Facebook

    // Parse fbclid information
    const hasFbclid = !!fbclid
    const fbclidInfo: any = {}
    
    if (hasFbclid) {
      fbclidInfo.hasFbclid = true
      fbclidInfo.fbclidValue = fbclid
      fbclidInfo.fbclidLength = fbclid.length
      
      // Try to extract information from fbclid
      // fbclid format: usually contains encoded data about the click
      // It may contain: timestamp, ad ID, user ID (hashed), etc.
      
      // Check if it looks like it's from Facebook Ads (usually longer)
      if (fbclid.length > 100) {
        fbclidInfo.likelySource = 'Facebook Ads (likely)'
      } else {
        fbclidInfo.likelySource = 'Facebook Post/Share (likely)'
      }
      
      // Extract first few characters (might contain metadata)
      fbclidInfo.prefix = fbclid.substring(0, 20)
      fbclidInfo.suffix = fbclid.substring(fbclid.length - 20)
    }

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
    const title = hasFbclid
      ? '🔔 มีคนเข้ามาดูเว็บจาก Facebook (มี fbclid)!' 
      : isFromFacebook 
        ? '🔔 มีคนเข้ามาดูเว็บจาก Facebook!' 
        : '👤 มีคนเข้ามาดูเว็บ'

    const color = hasFbclid ? 0x1877F2 : isFromFacebook ? 0x1877F2 : 0x5865F2 // Facebook blue or Discord blurple

    const embed = {
      title: title,
      description: hasFbclid
        ? '**มีคนเข้ามาดูเว็บ Valentine Day จาก Facebook (มี fbclid)!** 🎉📘'
        : isFromFacebook 
          ? '**มีคนเข้ามาดูเว็บ Valentine Day จาก Facebook!** 🎉'
          : 'มีคนเข้ามาดูเว็บ Valentine Day',
      color: color,
      fields: [
        {
          name: '🌐 Source',
          value: hasFbclid
            ? '**Facebook (มี fbclid)** 📘✅'
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

    // Add fbclid information if available
    if (hasFbclid) {
      embed.fields.push({
        name: '🔗 Facebook Click ID (fbclid)',
        value: `\`\`\`${fbclid}\`\`\``,
        inline: false
      })

      embed.fields.push({
        name: '📊 fbclid Details',
        value: [
          `**Length:** ${fbclidInfo.fbclidLength} characters`,
          `**Likely Source:** ${fbclidInfo.likelySource}`,
          `**Prefix:** \`${fbclidInfo.prefix}...\``,
          `**Suffix:** \`...${fbclidInfo.suffix}\``,
        ].join('\n'),
        inline: false
      })

      // Add full URL if available
      if (fullUrl) {
        embed.fields.push({
          name: '🔗 Full URL',
          value: `\`\`\`${fullUrl.length > 200 ? fullUrl.substring(0, 200) + '...' : fullUrl}\`\`\``,
          inline: false
        })
      }

      // Add all query parameters
      if (queryParams && Object.keys(queryParams).length > 0) {
        const queryParamsText = Object.entries(queryParams)
          .map(([key, value]) => `**${key}:** \`${value}\``)
          .join('\n')
        
        embed.fields.push({
          name: '📋 All Query Parameters',
          value: queryParamsText.length > 1000 
            ? queryParamsText.substring(0, 1000) + '...' 
            : queryParamsText,
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

    // Add user agent if available
    if (userAgent) {
      embed.fields.push({
        name: '💻 Device/User Agent',
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

