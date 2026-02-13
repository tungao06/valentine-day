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

## แก้ปัญหา 404 Error (ไฟล์ไม่พบ)

ถ้าเจอ error `404 (Not Found)` เมื่อพยายามโหลดไฟล์จาก Blob Storage ให้ตรวจสอบดังนี้:

### 1. ตรวจสอบว่าไฟล์อยู่ใน Blob Storage หรือไม่

1. ไปที่ Vercel Dashboard > Storage > Blob Store ของคุณ
2. ตรวจสอบว่าไฟล์อยู่ใน path ที่ถูกต้อง:
   - ต้องมี folder `images/` อยู่ที่ root
   - ภายใน `images/` ต้องมี folder `story1/`, `story2/`, etc.
   - ไฟล์ต้องอยู่ใน folder ที่ถูกต้อง เช่น `images/story1/story1_video1.mov`

### 2. ตรวจสอบ Environment Variable

1. ไปที่ Vercel Dashboard > Project Settings > Environment Variables
2. ตรวจสอบว่า `NEXT_PUBLIC_BLOB_STORE_URL` ถูกตั้งค่าไว้แล้ว
3. ตรวจสอบว่า URL ถูกต้อง (ควรเป็น `https://[store-id].public.blob.vercel-storage.com`)
4. **สำคัญ**: ต้องไม่มี `/` ต่อท้าย URL (เช่น `https://xxx.vercel-storage.com` ไม่ใช่ `https://xxx.vercel-storage.com/`)

### 3. ตรวจสอบโครงสร้าง Folder

โครงสร้างใน Blob Storage ต้องเป็น:
```
images/
├── story1/
│   ├── story1_image1.jpg
│   ├── story1_image2.jpg
│   ├── story1_video1.mov  ← ต้องมีไฟล์นี้
│   └── story1_video2.mov
└── ...
```

**ไม่ใช่**:
```
story1/  ← ผิด! ต้องมี images/ อยู่ด้านหน้า
├── story1_video1.mov
```

### 4. ตรวจสอบชื่อไฟล์

1. เปิด `utils/images.ts` และดูชื่อไฟล์ที่กำหนดไว้
2. ตรวจสอบว่าไฟล์ใน Blob Storage มีชื่อตรงกันทุกตัวอักษร (รวมถึงตัวพิมพ์เล็ก-ใหญ่)
3. ตรวจสอบว่าไม่มี space หรืออักขระพิเศษที่ไม่คาดคิด

### 5. ตรวจสอบ URL ที่ถูกสร้าง

1. เปิด Browser Console (F12)
2. ดู Network tab เมื่อโหลดหน้าเว็บ
3. ตรวจสอบ URL ที่พยายามโหลด:
   - ควรเป็น: `https://[store-id].public.blob.vercel-storage.com/images/story1/story1_video1.mov`
   - ถ้า URL ผิด ให้ตรวจสอบ environment variable อีกครั้ง

### 6. อัปโหลดไฟล์ใหม่

ถ้ายังไม่แก้ปัญหาได้ ลองอัปโหลดไฟล์ใหม่:

1. ลบไฟล์เก่าใน Blob Storage (ถ้ามี)
2. อัปโหลดไฟล์ใหม่โดยใช้โครงสร้าง folder ที่ถูกต้อง
3. ตรวจสอบว่าไฟล์อัปโหลดสำเร็จ
4. Redeploy application

### 7. ใช้ Vercel CLI เพื่อตรวจสอบ

```bash
# ดูรายการไฟล์ใน Blob Store
vercel blob list --store=your-blob-store-name

# ตรวจสอบว่าไฟล์อยู่ใน path ที่ถูกต้อง
vercel blob list --store=your-blob-store-name --prefix=images/story1/
```

### 8. Debug Mode

ใน development mode ระบบจะ log URL ที่ถูกสร้างไว้ใน console เพื่อช่วย debug:
- เปิด Browser Console
- ดู log ที่ขึ้นต้นด้วย `[Blob URL]`
- ตรวจสอบว่า URL ถูกสร้างถูกต้องหรือไม่

