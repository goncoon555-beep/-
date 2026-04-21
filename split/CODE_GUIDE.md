# 📋 คำแนะนำการใช้โค้ด script.js

## 🏗️ โครงสร้างไฟล์แบ่งเป็น 14 ส่วน:

### 0️⃣ **Supabase Database (ใหม่!)**
- การตั้งค่าเชื่อมต่อฐานข้อมูลจริง
```javascript
const SUPABASE_URL = '...';
const SUPABASE_KEY = '...';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
```
- ตารางที่ใช้: `products`, `transactions` (ดูไฟล์ `schema.sql`)

### 1️⃣ **Config (บรรทัด 4-15)**
- ตั้งค่าชื่อร้าน เบอร์โทร ที่อยู่ สี ฯลฯ

### 2️⃣ **State/Data (บรรทัด 17-30)**
- ตัวแปรเก็บสถานะ เช่น ID ที่แก้ไข รหัสบาร์โค้ด สถานะเข้าสู่ระบบ
```javascript
let editingProductId = null;      // ID สินค้าที่กำลังแก้ไข
let barcodeDraft = [];             // รหัสบาร์โค้ดชั่วคราว
let isLoggedIn = false;            // สถานะเข้าสู่ระบบ
```

### 3️⃣ **Utility Functions (บรรทัด 33-45)**
- ฟังก์ชันช่วยงาน เช่น:
  - `formatPrice(price)` — แปลงตัวเลขเป็นรูปแบบไทย
  - `getProductEmoji(category)` — หาอิโมจิตามประเภทสินค้า
  - `groupProducts()` — รวมสินค้าที่เหมือนกัน

### 4️⃣ **Rendering (บรรทัด 62-145)** 
**ใช้บน: หน้า Home + Products**
- `createSimplifiedProductCard()` — สร้างการ์ดสินค้า
- `renderAllProducts()` — แสดงสินค้าทั้งหมดบนหน้า Products
- `renderFeaturedProducts()` — แสดงสินค้าหน้า Home
- `filterProducts()` — ค้นหาตามหมวดหมู่

### 5️⃣ **Product Detail Modal (บรรทัด 147-193)**
**เมื่อกดสินค้า: ขึ้นหน้าต่างดูรายละเอียด**
- `showProductDetail()` — เปิด modal แสดง ชื่อ หมวด ราคา ประกัน รูป
- `closeProductDetail()` — ปิด modal

### 6️⃣ **Admin Table (บรรทัด 195-277)**
**ใช้บน: หน้า Admin แสดงรายการสินค้าทั้งหมด**
- `renderAdminTable()` — วาดตารางสินค้า
- `renderAdminGrouped()` — จัดกลุ่มตามหมวดหมู่
- `toggleGroupByCategory()` — สลับโหมดแสดง

### 7️⃣ **Save/Load (บรรทัด 289-306)**
- `saveProductsToStorage()` — บันทึกลง Browser Storage
- `loadProductsFromStorage()` — อ่านจาก Browser Storage เมื่อโปรแกรมเปิด

### 8️⃣ **File Upload (บรรทัด 318-328)**
- `showFilesPreview()` — แสดงตัวอย่างรูปที่เลือก
- `attachFileInputHandlers()` — ตรวจของการอัพโหลดไฟล์

### 9️⃣ **Barcode Input (บรรทัด 330-372)**
- `updateBarcodeDraft()` — อัปเดตรหัสบาร์โค้ดชั่วคราว
- `handleBarcodeInput()` — เพิ่มบาร์โค้ด (Enter)
- `clearBarcodes()` — ล้างบาร์โค้ด
- `generateBarcode()` — สร้างบาร์โค้ดอัตโนมัติ

### 🔟 **Product Form (บรรทัด 374-508)**
**ใช้บน: หน้า Admin ฟอร์มสินค้า**
- `clearForm()` — เคลียร์ฟอร์ม
- `saveProduct()` — บันทึกสินค้าใหม่/อัปเดต
- `populateEditForm()` — เติมข้อมูลเก่าลงฟอร์มแก้ไข
- `editProduct()` — เปิด modal แก้ไข
- `saveEdit()` — บันทึกการแก้ไข

### 1️⃣1️⃣ **Delete Confirm (บรรทัด 510-537)**
**เมื่อกด ปุ่ม 🗑️ ในตาราง Admin**
- `showDeleteConfirmModal()` — เปิด modal ถามยืนยันอีกที
- `confirmDelete()` → `deleteProduct()` — ลบสินค้าจริง

### 1️⃣2️⃣ **Toast Message (บรรทัด 539-540)**
- `showToast()` — แสดงข้อความยืนยันสั้นๆ (ขึ้นมาแล้วหายใน 3 วินาที)

### 1️⃣3️⃣ **Filter/Search (บรรทัด 542-576)**
**ใช้บน: หน้า Admin ค้นหา**
- `applyFilters()` — ค้นหาตามชื่อ ประเภท ที่มา วันที่
- `clearFilters()` — ล้างค้นหา
- `renderAdminTableWithData()` — วาดตารางข้อมูลที่ค้นหา

### 1️⃣4️⃣ **UI/Navigation (บรรทัด 590-760)**
- `updateUI()` — อัปเดตชื่อร้านแสดง
- `showPage()` — สลับหน้า (Home/Products/Admin)
- `toggleMobileMenu()` — เปิด/ปิด Menu Mobile
- `goToSlide()` — นำเสนอรูปภาพ
- `showLoginModal()` — เปิดหน้าต่าง Login
- `handleLogin()` — ตรวจสอบ Username/Password
- `attachNavListeners()` — ตั้ง Click Event บนปุ่ม Menu

### 🚀 **Init & Ready (บรรทัด 720-783)**
- `ensurePartialsReady()` — รอโหลดทั้งหมดก่อนเริ่มใช้
- `init()` — ฟังก์ชันเริ่มต้นที่รัน 1 ครั้ง

---

## 🗂️ การไหลของข้อมูล:

```
1. โปรแกรมเปิด → loadProductsFromStorage() → renderFeaturedProducts()
2. คลิกสินค้า → showProductDetail() → แสดง Modal
3. คลิก Admin button (ถ้า login) → showPage('admin') → renderAdminTable()
4. กรอกฟอร์ม + บันทึก → saveProduct() → saveProductsToStorage() → render ทุกหน้า
5. คลิกแก้ไข → editProduct() → Modal + Input fields + saveEdit()
6. คลิก🗑️ → showDeleteConfirmModal() → ถามยืนยัน → confirmDelete() → deleteProduct()
```

---

## 🎯 ตัวอย่างหลัก:

### โครงสร้างสินค้า (Product Object):
```javascript
{
  id: 1,                    // ID ไม่ซ้ำกัน
  name: 'iPhone 15',        // ชื่อสินค้า
  category: 'iPhone',       // หมวดหมู่
  storage: '256GB',         // ความจุ
  type: 'มือ1',            // ประเภท (มือ1/มือ2)
  price_cash: 48900,        // ราคาปลีก
  price_down: 0,            // ราคาดาวน์
  price_repair: 2000,       // ราคาซ่อม
  cost: 40000,              // ต้นทุน
  description: 'ชิป A17',   // รายละเอียด
  warranty: '1 ปี',         // ประกัน
  warranty_expire: '2025-02-18', // วันหมดประกัน
  quantity: 5,              // จำนวนสต็อก
  barcodes: ['BC123'],      // รหัสบาร์โค้ด
  images: [],               // รูปภาพ
  featured: true            // แสดงที่ home?
}
```

---

## 🔐 Authentication:
- Username: `admin`
- Password: `1234`
- ข้อมูลล็อคการเข้าถูกเก็บใน `isLoggedIn` variable เท่านั้น (ไม่ secure - สำหรับทดสอบ)

---

## 💾 Data Storage:
- ไม่มีฐานข้อมูล ใช้ **Browser LocalStorage** ซึ่งเก็บข้อมูลภายในเครื่องเท่านั้น
- ข้อมูลหายเมื่อ Clear Cache

---

**✅ สรุป: โค้ดนี้ไม่ยุ่งยาก เพราะแต่ละฟังก์ชันมีหน้าที่เฉพาะเจาะจงชัดเจน!**
