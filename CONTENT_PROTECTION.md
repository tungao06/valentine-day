# ระบบป้องกันเนื้อหา (Content Protection)

## ภาพรวม

ระบบนี้ป้องกันการ capture, record และ download เนื้อหาจากเว็บไซต์ คล้ายกับระบบป้องกันของ Netflix

## ฟีเจอร์การป้องกัน

### 1. ป้องกันการ Capture/Record หน้าจอ

- **Disable Print Screen**: ปิดการใช้งานปุ่ม Print Screen
- **Detect Screen Sharing**: ตรวจจับเมื่อมีการแชร์หน้าจอ (getDisplayMedia)
- **Visibility Change Detection**: ตรวจจับเมื่อหน้าเว็บถูกซ่อน (อาจมีการ capture)
- **Warning Message**: แสดงข้อความเตือนเมื่อตรวจพบการ capture

### 2. ป้องกันการ Download รูปภาพ

- **Disable Right-Click**: ปิดการใช้งานเมนูคลิกขวา
- **Disable Drag & Drop**: ป้องกันการลากรูปภาพออกจากเว็บ
- **Disable Image Context Menu**: ปิดเมนูบริบทของรูปภาพ
- **Watermark Overlay**: เพิ่ม watermark overlay บนรูปภาพ
- **Disable Text Selection**: ป้องกันการเลือกข้อความ

### 3. ป้องกันการเข้าถึง Developer Tools

- **Disable F12**: ปิดการใช้งาน F12 (Developer Tools)
- **Disable Ctrl+Shift+I**: ปิดการใช้งาน Inspect Element
- **Disable Ctrl+Shift+J**: ปิดการใช้งาน Console
- **Disable Ctrl+Shift+C**: ปิดการใช้งาน Element Inspector
- **Disable Ctrl+U**: ปิดการใช้งาน View Source
- **Disable Ctrl+S**: ปิดการใช้งาน Save Page
- **Disable Ctrl+P**: ปิดการใช้งาน Print

### 4. ป้องกันการ Copy เนื้อหา

- **Disable Ctrl+C**: ป้องกันการ copy ข้อความ
- **Disable Ctrl+A**: ป้องกันการ select all
- **Disable Text Selection**: ป้องกันการเลือกข้อความด้วยเมาส์

## ข้อจำกัด

⚠️ **สำคัญ**: ระบบป้องกันนี้ไม่สามารถป้องกันได้ 100% เพราะ:

1. **Browser Extensions**: ผู้ใช้สามารถใช้ browser extensions เพื่อ bypass การป้องกัน
2. **Developer Tools**: ผู้ใช้ที่มีความรู้สามารถเปิด Developer Tools ได้
3. **Screen Recording Software**: Software บางตัวสามารถ record ได้โดยไม่ผ่าน browser
4. **Mobile Devices**: บน mobile devices อาจมีข้อจำกัดในการป้องกัน
5. **Network Level**: ผู้ใช้สามารถดู source code ผ่าน network tab ได้

## การใช้งาน

ระบบจะทำงานอัตโนมัติเมื่อโหลดหน้าเว็บ ไม่ต้องตั้งค่าอะไรเพิ่มเติม

## การทดสอบ

### ทดสอบการป้องกัน:

1. **Right-Click**: ลองคลิกขวาบนรูปภาพ → ควรไม่มีเมนูแสดง
2. **Drag Image**: ลองลากรูปภาพ → ควรไม่สามารถลากได้
3. **Print Screen**: กดปุ่ม Print Screen → ควรแสดงข้อความเตือน
4. **Keyboard Shortcuts**: ลองกด Ctrl+Shift+I → ควรไม่เปิด Developer Tools
5. **Text Selection**: ลองเลือกข้อความ → ควรไม่สามารถเลือกได้

### ทดสอบ Screen Capture:

1. ลองใช้ screen recording software
2. ลองใช้ browser extension สำหรับ screenshot
3. ระบบจะพยายามตรวจจับและแสดงข้อความเตือน

## การปรับแต่ง

### ปิดการป้องกันบางส่วน

ถ้าต้องการปิดการป้องกันบางส่วน สามารถแก้ไขใน `utils/protection.ts`:

```typescript
// ปิดการป้องกัน right-click
// Comment out: disableRightClick()

// ปิดการป้องกัน keyboard shortcuts
// Comment out: disableKeyboardShortcuts()
```

### ปรับแต่ง Watermark

แก้ไข CSS ใน `styles/globals.css`:

```css
.watermark-overlay {
  /* ปรับแต่ง watermark pattern */
  background: repeating-linear-gradient(...);
}
```

## หมายเหตุ

- ระบบป้องกันนี้เป็น **deterrent** ไม่ใช่การป้องกันที่สมบูรณ์แบบ
- ผู้ใช้ที่มีความรู้ทางเทคนิคอาจสามารถ bypass ได้
- ควรใช้ร่วมกับมาตรการอื่นๆ เช่น:
  - Watermarking รูปภาพที่ server-side
  - ใช้ DRM สำหรับวิดีโอ
  - จำกัดการเข้าถึงเนื้อหา
  - ใช้ legal protection (copyright)

## Best Practices

1. **Server-Side Protection**: ควรมีระบบป้องกันที่ server-side ด้วย
2. **Watermarking**: เพิ่ม watermark ที่ server-side ก่อนส่งรูปภาพ
3. **Access Control**: จำกัดการเข้าถึงเนื้อหาเฉพาะผู้ใช้ที่ได้รับอนุญาต
4. **Monitoring**: ติดตามการใช้งานและตรวจจับพฤติกรรมผิดปกติ
5. **Legal Protection**: ใช้ copyright และ legal agreements

## Troubleshooting

### รูปภาพไม่แสดง

- ตรวจสอบว่า CSS ไม่ได้ block การแสดงรูปภาพ
- ตรวจสอบว่า watermark overlay ไม่ได้ซ่อนรูปภาพ

### การป้องกันไม่ทำงาน

- ตรวจสอบว่า JavaScript ทำงานได้ปกติ
- ตรวจสอบว่าไม่มี browser extension ที่ block JavaScript
- ตรวจสอบ console สำหรับ error messages

### Performance Issues

- Watermark overlay อาจส่งผลต่อ performance ถ้ามีรูปภาพจำนวนมาก
- พิจารณาปิด watermark สำหรับรูปภาพขนาดเล็ก (icons)

