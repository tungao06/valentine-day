# การตั้งค่า Vercel Blob Storage

## ภาพรวม

โปรเจคนี้รองรับการดึงรูปภาพและวิดีโอจาก Vercel Blob Storage โดยยังคงใช้โครงสร้าง folder เดิม (`images/story1/`, `images/story2/`, etc.)

## วิธีตั้งค่า

### 1. สร้าง Vercel Blob Store

1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard)
2. เลือกโปรเจคของคุณ
3. ไปที่ **Storage** tab
4. คลิก **Create Database** และเลือก **Blob**
5. ตั้งชื่อ Blob Store (เช่น `valentine-images`)
6. คลิก **Create**

### 2. อัปโหลดไฟล์ไปยัง Vercel Blob

#### วิธีที่ 1: ใช้ Vercel Dashboard
1. ไปที่ Blob Store ที่สร้างไว้
2. คลิก **Upload** และอัปโหลดไฟล์
3. **สำคัญ**: ต้องสร้าง folder structure เหมือนกับ `public/images/`:
   ```
   images/
   ├── story1/
   │   ├── story1_image1.jpg
   │   ├── story1_image2.jpg
   │   ├── story1_video1.mov
   │   └── story1_video2.mov
   ├── story2/
   │   ├── story2_image1.jpg
   │   ├── story2_image2.jpg
   │   └── story2_image3.jpg
   ├── story3/
   │   ├── story3_image1.jpg
   │   ├── story3_image2.jpg
   │   ├── story3_image3.jpg
   │   └── story3_video1.mov
   ├── story4/
   │   ├── story4_image1.jpg
   │   ├── story4_image2.jpg
   │   └── story4_image3.jpg
   └── story5/
       ├── story5_image1.jpg
       ├── story5_image2.jpg
       └── story5_image3.jpg
   ```

#### วิธีที่ 2: ใช้ Vercel CLI
```bash
# ติดตั้ง Vercel CLI (ถ้ายังไม่มี)
npm i -g vercel

# Login
vercel login

# อัปโหลดไฟล์ทั้งหมดจาก public/images/ ไปยัง Blob Store
vercel blob put public/images/story1/* --store=your-blob-store-name
vercel blob put public/images/story2/* --store=valentine-day-blob
# ... ทำซ้ำสำหรับทุก folder
```

### 3. ตั้งค่า Environment Variable

1. ไปที่ Vercel Dashboard > Project Settings > **Environment Variables**
2. เพิ่ม environment variable:
   - **Name**: `NEXT_PUBLIC_BLOB_STORE_URL`
   - **Value**: URL ของ Blob Store ของคุณ (ดูได้จาก Blob Store page)
     - ตัวอย่าง: `https://abc123xyz.vercel-storage.com`
   - **Environment**: Production, Preview, Development (เลือกตามต้องการ)
3. คลิก **Save**

### 4. Deploy ใหม่

หลังจากตั้งค่า environment variable แล้ว:
1. Push code ใหม่ไปยัง Git repository
2. Vercel จะ deploy อัตโนมัติ
3. หรือคลิก **Redeploy** ใน Vercel Dashboard

## การทำงาน

- **Local Development**: ถ้าไม่ตั้งค่า `NEXT_PUBLIC_BLOB_STORE_URL` ระบบจะใช้ไฟล์จาก `public/images/` folder
- **Production**: ถ้าตั้งค่า `NEXT_PUBLIC_BLOB_STORE_URL` แล้ว ระบบจะดึงไฟล์จาก Vercel Blob Storage

## ตรวจสอบว่าใช้งาน Blob Storage หรือไม่

เปิด browser console และดู network requests:
- ถ้าใช้ Blob Storage: URL จะเป็น `https://xxx.vercel-storage.com/images/...`
- ถ้าใช้ local: URL จะเป็น `/images/...`

## หมายเหตุ

- โครงสร้าง folder ใน Vercel Blob ต้องเหมือนกับ `public/images/` ทุกประการ
- ชื่อไฟล์ต้องตรงกับที่กำหนดใน `utils/images.ts`
- รองรับไฟล์: `.jpg`, `.png`, `.webp`, `.mp4`, `.webm`, `.mov`

