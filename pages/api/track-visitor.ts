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
    const { referer, userAgent, path } = req.body

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
                          referer?.includes('l.facebook.com')

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
    const title = isFromFacebook 
      ? '🔔 มีคนเข้ามาดูเว็บจาก Facebook!' 
      : '👤 มีคนเข้ามาดูเว็บ'

    const color = isFromFacebook ? 0x1877F2 : 0x5865F2 // Facebook blue or Discord blurple

    const embed = {
      title: title,
      description: isFromFacebook 
        ? '**มีคนเข้ามาดูเว็บ Valentine Day จาก Facebook!** 🎉'
        : 'มีคนเข้ามาดูเว็บ Valentine Day',
      color: color,
      fields: [
        {
          name: '🌐 Source',
          value: isFromFacebook 
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

    // Add user agent if available
    if (userAgent) {
      embed.fields.push({
        name: '💻 Device',
        value: userAgent.length > 100 ? userAgent.substring(0, 100) + '...' : userAgent,
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

