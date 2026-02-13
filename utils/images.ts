// รูปภาพและวิดีโอที่จะใช้ใน story sections
// 
// สำหรับ Local Development:
// - เพิ่มรูปภาพหรือวิดีโอของคุณใน public/story1/, story2/, story3/ แล้วอัปเดต path ด้านล่าง
// 
// สำหรับ Production (Vercel Blob Storage):
// - อัปโหลดรูปภาพและวิดีโอไปยัง Vercel Blob Storage โดยใช้ structure เดิม:
//   - images/story1/
//   - images/story2/
//   - images/story3/
//   - images/story4/
//   - images/story5/
// - ตั้งค่า environment variable: NEXT_PUBLIC_BLOB_STORE_URL=https://your-blob-store-url.vercel-storage.com
// 
// ระบบจะแสดงรูปและวิดีโอทั้งหมดในแต่ละ folder
// รองรับไฟล์: .jpg, .png, .webp, .mp4, .webm, .mov

// Media สำหรับ story section ที่ 1 (จาก folder story1/)
// "วันแรกที่เจอ" - รูป/วิดีโอเกี่ยวกับการเจอกันครั้งแรก
// มี 4 ไฟล์: 2 รูป + 2 วิดีโอ
export const story1Images = [
  "/story1/story1_image1.jpg",
  "/story1/story1_image2.jpg",
  "/story1/story1_video1.mov",
  "/story1/story1_video2.mov",
];

// Media สำหรับ story section ที่ 2 (จาก folder story2/)
// "ความทรงจำที่สวยงาม" - รูป/วิดีโอเกี่ยวกับช่วงเวลาสุขๆ ร่วมกัน
// เลือก 3 รูป
export const story2Images = [
  "/story2/story2_image1.jpg",
  "/story2/story2_image2.jpg",
  "/story2/story2_image3.jpg",
];

// Media สำหรับ story section ที่ 3 (จาก folder story3/)
// "ความรักที่เติบโต" - รูป/วิดีโอเกี่ยวกับการเติบโตของความรัก
// มี 4 ไฟล์: 3 รูป + 1 วิดีโอ
export const story3Images = [
  "/story3/story3_image1.jpg",
  "/story3/story3_image2.jpg",
  "/story3/story3_image3.jpg",
  "/story3/story3_video1.mov",
];

// Media สำหรับ story section ที่ 4 (จาก folder story4/)
// "เธอคือทุกอย่าง" - รูป/วิดีโอเกี่ยวกับความพิเศษของเธอ
// มี 3 รูปอยู่แล้ว
export const story4Images = [
  "/story4/story4_image1.jpg",
  "/story4/story4_image2.jpg",
  "/story4/story4_image3.jpg",
];

// Media สำหรับ story section ที่ 5 (จาก folder story5/)
// "อนาคตของเรา" - รูป/วิดีโอเกี่ยวกับอนาคตและความฝันร่วมกัน
// เลือก 3 รูป
export const story5Images = [
  "/story5/story5_image1.jpg",
  "/story5/story5_image2.jpg",
  "/story5/story5_image3.jpg",
];

// Array ของ media ทั้งหมดสำหรับแต่ละ section
export const storyImages = [
  story1Images,
  story2Images,
  story3Images,
  story4Images,
  story5Images,
];

// Helper function เพื่อตรวจสอบว่าเป็นวิดีโอหรือไม่
// รองรับทั้งตัวพิมพ์เล็กและตัวพิมพ์ใหญ่
export const isVideo = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.MP4', '.WEBM', '.MOV', '.AVI', '.MKV'];
  return videoExtensions.some(ext => url.endsWith(ext));
};

// ตัวอย่างการใช้งาน:
// ถ้ามีรูปใน folder story1/ ชื่อ love1.jpg, love2.jpg, love3.jpg
// export const story1Images = [
//   "/story1/love1.jpg",
//   "/story1/love2.jpg",
//   "/story1/love3.jpg",
// ];

// ตัวอย่างการใช้งานวิดีโอ:
// export const story1Images = [
//   "/story1/love1.jpg",
//   "/story1/memory1.mp4",  // วิดีโอ
//   "/story1/love2.jpg",
// ];

