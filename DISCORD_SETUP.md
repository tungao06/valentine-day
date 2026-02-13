# การตั้งค่า Discord Notification สำหรับ Visitor Tracking

## ภาพรวม

ระบบนี้จะส่ง notification ไปที่ Discord channel เมื่อมีคนเข้ามาดูเว็บ โดยเฉพาะจะแจ้งเตือนเป็นพิเศษเมื่อมีคนเข้ามาจาก Facebook

## วิธีตั้งค่า

### 1. สร้าง Discord Webhook

1. เปิด Discord และไปที่ Server ที่ต้องการรับ notifications
2. ไปที่ **Server Settings** > **Integrations** > **Webhooks**
3. คลิก **New Webhook**
4. ตั้งชื่อ webhook (เช่น "Valentine Website Tracker")
5. เลือก Channel ที่ต้องการรับ notifications
6. คลิก **Copy Webhook URL**
7. คลิก **Save Changes**

### 2. ตั้งค่า Environment Variable ใน Vercel

1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือกโปรเจคของคุณ
3. ไปที่ **Settings** > **Environment Variables**
4. เพิ่ม environment variable:
   - **Name**: `DISCORD_WEBHOOK_URL`
   - **Value**: วาง Webhook URL ที่ copy มาจาก Discord
     - ตัวอย่าง: `https://discord.com/api/webhooks/1234567890/abcdefghijklmnopqrstuvwxyz`
   - **Environment**: Production, Preview, Development (เลือกตามต้องการ)
5. คลิก **Save**

### 3. Deploy ใหม่

หลังจากตั้งค่า environment variable แล้ว:
1. Push code ใหม่ไปยัง Git repository
2. Vercel จะ deploy อัตโนมัติ
3. หรือคลิก **Redeploy** ใน Vercel Dashboard

## การทำงาน

- เมื่อมีคนเข้ามาดูเว็บ ระบบจะส่ง notification ไปที่ Discord
- ระบบรองรับ **Social Media Click IDs** จากหลายแพลตฟอร์ม:
  - **Facebook** (`fbclid`) 📘
  - **Google Ads** (`gclid`) 🔍
  - **TikTok** (`ttclid`) 🎵
  - **Twitter/X** (`twclid`) 🐦
  - **LinkedIn** (`li_fat_id`) 💼
  - **Snapchat** (`sc_cid`) 👻
  - **Pinterest** (`pinid`) 📌
  - **Instagram** (`igshid`) 📷
  - **YouTube** (`ytclid`) 📺
  - **Microsoft Ads** (`msclkid`) 🪟
  - **UTM Parameters** (`utm_source`, `utm_medium`, `utm_campaign`) 📊
- ถ้ามี Click ID ใน URL จะแสดงข้อมูลเพิ่มเติม:
  - **Click ID value** (full string)
  - **Click ID length** และ details
  - **Platform name** และ emoji
  - **Full URL** พร้อม query parameters ทั้งหมด
- Notification จะแสดงข้อมูล:
  - Source (Social Media platform หรือ referer อื่นๆ)
  - Page ที่เข้าดู
  - เวลาที่เข้ามาดู (เวลาไทย)
  - Device/User Agent
  - **Click IDs และข้อมูลทั้งหมด** (ถ้ามี)

## ตัวอย่าง Notification

### จาก Facebook (มี fbclid):
```
🔔 มีคนเข้ามาดูเว็บจาก Facebook (มี fbclid)!
มีคนเข้ามาดูเว็บ Valentine Day จาก Facebook (มี fbclid)! 🎉📘

🌐 Source: Facebook (มี fbclid) 📘✅
📄 Page: /
🕐 Time: 14 กุมภาพันธ์ 2567, 14:30:25

🔗 Facebook Click ID (fbclid):
IwY2xjawP8hstleHRuA2FlbQIxMQBzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEeZWyWRFLSE_KmsQMU33-A70aRiDZuK8YQRqalksTKo6H4zKsA9HfLmMU8CJ4_aem_RJmj79ItGSFEkjW2_J6QKw

📊 fbclid Details:
Length: 150 characters
Likely Source: Facebook Ads (likely)
Prefix: IwY2xjawP8hstleHRuA...
Suffix: ...FEkjW2_J6QKw

🔗 Full URL:
https://valentine-day-lemon.vercel.app/?fbclid=...

📋 All Query Parameters:
fbclid: IwY2xjawP8hstleHRuA2FlbQIxMQBzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEeZWyWRFLSE_KmsQMU33-A70aRiDZuK8YQRqalksTKo6H4zKsA9HfLmMU8CJ4_aem_RJmj79ItGSFEkjW2_J6QKw
```

### จาก Facebook (ไม่มี fbclid):
```
🔔 มีคนเข้ามาดูเว็บจาก Facebook!
มีคนเข้ามาดูเว็บ Valentine Day จาก Facebook! 🎉

🌐 Source: Facebook 📘
📄 Page: /
🕐 Time: 14 กุมภาพันธ์ 2567, 14:30:25
```

### จากแหล่งอื่น:
```
👤 มีคนเข้ามาดูเว็บ
มีคนเข้ามาดูเว็บ Valentine Day

🌐 Source: https://google.com
📄 Page: /
🕐 Time: 14 กุมภาพันธ์ 2567, 14:30:25
```

## หมายเหตุ

- ระบบจะ track ทุกครั้งที่โหลดหน้าเว็บ
- ถ้าไม่มี `DISCORD_WEBHOOK_URL` ระบบจะทำงานปกติแต่ไม่ส่ง notification
- Tracking จะไม่รบกวน user experience (fail silently)
- ข้อมูลที่ส่งไป Discord ไม่รวมข้อมูลส่วนตัว (ไม่มี IP address)

## เกี่ยวกับ Social Media Click IDs

ระบบรองรับ Click IDs จาก Social Media หลายแพลตฟอร์ม:

### Facebook (`fbclid`) 📘
- ใช้สำหรับ tracking clicks จาก Facebook Ads, Posts, และ Stories
- ช่วยระบุว่า click มาจากโฆษณาไหน
- ใช้สำหรับวัดประสิทธิภาพของโฆษณา

### Google Ads (`gclid`) 🔍
- Google Click Identifier สำหรับ Google Ads
- ใช้สำหรับ tracking และ attribution ใน Google Analytics
- ช่วยวัด ROI ของโฆษณา Google

### TikTok (`ttclid`) 🎵
- TikTok Click ID สำหรับ TikTok Ads
- ใช้สำหรับ tracking performance ของโฆษณา TikTok

### Twitter/X (`twclid`) 🐦
- Twitter Click ID สำหรับ Twitter Ads
- ใช้สำหรับ tracking engagement จาก Twitter

### LinkedIn (`li_fat_id`) 💼
- LinkedIn Click ID สำหรับ LinkedIn Ads
- ใช้สำหรับ B2B marketing tracking

### Snapchat (`sc_cid`) 👻
- Snapchat Click ID สำหรับ Snapchat Ads
- ใช้สำหรับ tracking mobile-first campaigns

### Pinterest (`pinid`) 📌
- Pinterest Click ID สำหรับ Pinterest Ads
- ใช้สำหรับ visual marketing tracking

### Instagram (`igshid`) 📷
- Instagram Share ID
- ใช้สำหรับ tracking shares และ engagement

### YouTube (`ytclid`) 📺
- YouTube Click ID สำหรับ YouTube Ads
- ใช้สำหรับ video marketing tracking

### Microsoft Ads (`msclkid`) 🪟
- Microsoft Click ID สำหรับ Bing Ads
- ใช้สำหรับ search engine marketing

### UTM Parameters 📊
- `utm_source` - แหล่งที่มาของ traffic
- `utm_medium` - ประเภทของ marketing medium
- `utm_campaign` - ชื่อ campaign

### ข้อมูลที่ดึงได้จาก Click IDs:

1. **Click ID Value** - ค่าเต็มของ click ID (ใช้สำหรับ tracking)
2. **Length** - ความยาวของ click ID
3. **Platform** - แพลตฟอร์มที่มาจาก
4. **Prefix/Suffix** - ส่วนต้นและท้ายของ click ID (อาจมี metadata)
5. **Full URL** - URL เต็มพร้อม query parameters ทั้งหมด

### ทำไม Click IDs ถึงสำคัญ:

- **Attribution** - ใช้สำหรับวัดประสิทธิภาพของโฆษณา
- **Analytics** - ช่วยวิเคราะห์ว่า traffic มาจากไหน
- **ROI Measurement** - ช่วยวัดผลตอบแทนจากการลงโฆษณา
- **Campaign Optimization** - ช่วยปรับปรุง campaign ให้มีประสิทธิภาพมากขึ้น

## Troubleshooting

### ไม่ได้รับ notification

1. ตรวจสอบว่า `DISCORD_WEBHOOK_URL` ถูกตั้งค่าไว้ใน Vercel
2. ตรวจสอบว่า Webhook URL ยังใช้งานได้ (ไปที่ Discord > Webhooks และดูว่า webhook ยัง active อยู่หรือไม่)
3. ตรวจสอบ Vercel logs เพื่อดู error messages
4. ทดสอบ webhook โดยใช้ curl:
   ```bash
   curl -X POST "YOUR_WEBHOOK_URL" \
     -H "Content-Type: application/json" \
     -d '{"content": "Test message"}'
   ```

### ต้องการปิด tracking

ถ้าต้องการปิด tracking ชั่วคราว:
- ลบหรือ comment out code ใน `pages/_app.tsx` ที่เกี่ยวกับ `trackVisitor()`

