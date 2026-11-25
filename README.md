# CHOCO HOUSE — Chocolate Store

เว็บไซต์ขายช็อกโกแลตแท่ง พร้อมตะกร้าสินค้า, Google Sheets order backend, หน้าจัดการออเดอร์, Picking List, Packing Checklist และ Shipping Label

## โครงสร้าง
- `index.html` — Landing page และ checkout
- `admin.html` — หน้าจัดการออเดอร์
- `style.css`, `script.js`, `admin.js` — รูปแบบและการทำงาน
- `config.js` — URL ของ Apps Script
- `images/` — รูปภาพสินค้าและแบนเนอร์
- `apps-script/Code.gs` — Google Apps Script เชื่อม Google Sheets

## ทดลองเว็บไซต์แบบไม่เชื่อมชีต
เปิด `index.html` ผ่าน Live Server หรือโฮสต์เว็บได้เลย โดยเว้น `API_URL` ใน `config.js` เป็นค่าว่าง ระบบจะเก็บคำสั่งซื้อใน localStorage ของเบราว์เซอร์นั้น เหมาะสำหรับทดสอบหน้าร้านเท่านั้น ข้อมูลทดลองไม่ซิงก์ข้ามอุปกรณ์

## เชื่อม Google Sheets
1. สร้าง Google Sheet ใหม่ชื่อ `CHOCO HOUSE Orders`
2. เปิด Extensions > Apps Script
3. นำโค้ดจาก `apps-script/Code.gs` ไปวางใน `Code.gs`
4. กด Save แล้วเลือกฟังก์ชัน `setup` และ Run หนึ่งครั้ง เพื่อสร้างชีต `Orders` และอนุญาตสิทธิ์
5. ไปที่ Project Settings > Script Properties เพิ่ม `ADMIN_KEY` เป็นรหัสลับที่คาดเดายาก (อย่าใส่รหัสนี้ในไฟล์เว็บไซต์)
6. Deploy > New deployment > Select type: Web app
7. Execute as: Me; Who has access: Anyone (จำเป็นต่อการรับคำสั่งซื้อจากหน้าเว็บ) แล้ว Deploy และอนุญาตสิทธิ์
8. คัดลอก Web app URL ที่ลงท้าย `/exec`
9. เปิด `config.js` แล้วใส่ URL ใน `API_URL` เช่น `API_URL: "https://script.google.com/macros/s/DEPLOYMENT_ID/exec"`
10. อัปโหลดไฟล์เว็บไซต์ขึ้น GitHub ใหม่ แล้วทดสอบสั่งซื้อจริง ตรวจว่ามีแถวใหม่ใน Google Sheets
11. เปิด `admin.html` กรอกรหัส `ADMIN_KEY` เพื่อดูออเดอร์

**สำคัญ:** เมื่อแก้ไข Apps Script ให้ Deploy > Manage deployments > Edit > New version เพื่อเผยแพร่เวอร์ชันใหม่

## GitHub Pages
1. สร้าง GitHub repository ชื่อ `choco-house` (Public หากใช้ GitHub Pages แบบฟรี)
2. อัปโหลดไฟล์ทั้งหมด โดยคงโฟลเดอร์ `images/` และ `apps-script/`
3. ไปที่ Settings > Pages
4. Source เลือก Deploy from a branch; Branch เลือก `main` และ `/ (root)`; Save
5. รอ URL ที่ GitHub Pages แจ้ง เช่น `https://YOUR-USERNAME.github.io/choco-house/`
6. ใช้โดเมนของตนเองได้ที่ Settings > Pages > Custom domain แล้วตั้ง DNS ตามค่าที่ GitHub แสดง

## การใช้งานหลังบ้าน
- เปิด `/admin.html`
- ใส่ ADMIN_KEY เพื่อโหลดคำสั่งซื้อ
- กด `ใบหยิบ` เพื่อพิมพ์ Picking List
- กด `ใบแพ็ก` เพื่อพิมพ์ Packing Checklist
- กด `ใบจ่าหน้า` เพื่อพิมพ์ Shipping Label
- กด `อัปเดตสถานะ` เพื่อบันทึกสถานะใหม่
- กด `ส่งออก CSV` เพื่อดาวน์โหลดรายการออเดอร์

## SKU เริ่มต้น
| SKU | สินค้า | ราคา |
|---|---|---:|
| CHO-001 | Milk Chocolate | 59 บาท |
| CHO-002 | Dark Chocolate | 69 บาท |

## ข้อควรทราบก่อนใช้งานเชิงพาณิชย์
- โปรเจกต์นี้เป็น starter สำหรับงานเรียน/ร้านขนาดเล็ก ยังไม่มีระบบรับชำระเงินออนไลน์, คำนวณค่าขนส่งอัตโนมัติ, เชื่อม API บริษัทขนส่ง หรือระบบสมาชิก
- Google Apps Script web app ที่เปิด Anyone สามารถรับคำสั่งซื้อจากสาธารณะได้ จึงควรเพิ่ม CAPTCHA / rate limiting / validation และตรวจสอบการใช้งานผิดปกติก่อนเปิดขายจริง
- `ADMIN_KEY` ใช้ป้องกันการเรียกดูและแก้ไขหลังบ้าน แต่การส่งข้อมูลผ่านเว็บควรใช้ HTTPS (GitHub Pages และ Apps Script ใช้ HTTPS)
- อย่าเก็บข้อมูลบัตรเครดิตใน Google Sheets; ใช้ payment gateway ที่ได้รับอนุญาต
- ตรวจสอบนโยบายความเป็นส่วนตัวและการเก็บรักษาข้อมูลส่วนบุคคลให้เหมาะสม
- ภาพสินค้า SVG เป็นภาพประกอบที่สร้างไว้ในโปรเจกต์ สามารถแทนที่ด้วยภาพสินค้าจริงใน `images/` และแก้ path ใน `script.js` ได้
