# How to add a new Hero Piece

คู่มือนี้สำหรับเพิ่ม Hero Piece ใหม่แบบไม่ต้องแก้หลายไฟล์ในเว็บ

## 1. Put images in `/public/pieces/[slug]`

สร้างโฟลเดอร์ด้วย slug ของชิ้นงาน เช่น:

```text
public/pieces/my-new-piece/
```

ใส่รูปงานไว้ในโฟลเดอร์นั้น เช่น:

```text
public/pieces/my-new-piece/hero.png
public/pieces/my-new-piece/gallery-01.jpg
public/pieces/my-new-piece/gallery-02.jpg
```

เวลาใส่ path ใน CSV ให้เริ่มด้วย `/pieces/...` เช่น:

```text
/pieces/my-new-piece/hero.png
```

## 2. Add one row in CSV

เปิดไฟล์:

```text
content/pieces.sample.csv
```

เพิ่ม 1 แถวสำหรับชิ้นงานใหม่

คอลัมน์ที่ต้องใส่:

```text
slug,titleTh,titleEn,category,startingPrice,sizeOptions,heroImage,galleryImages,descriptionTh,descriptionEn,availableForBuild
```

ตัวอย่าง:

```csv
my-new-piece,ชิ้นงานใหม่,My New Piece,Gallery Piece,"฿12,000+","30|60|100|170",/pieces/my-new-piece/hero.png,"/pieces/my-new-piece/hero.png|/pieces/my-new-piece/gallery-01.jpg",คำอธิบายภาษาไทย,English description,true
```

หมายเหตุ:

- `slug` ใช้ตัวพิมพ์เล็ก ตัวเลข และขีดกลางเท่านั้น
- `sizeOptions` ใช้ `30|60|100|170`
- `galleryImages` คั่นหลายรูปด้วย `|`
- ถ้าราคามี comma เช่น `฿18,900+` ให้ใส่เครื่องหมาย quote ครอบไว้

## 3. Run import command

รันคำสั่ง:

```bash
npm run import-pieces
```

ระบบจะอ่าน CSV แล้วสร้างไฟล์:

```text
src/data/pieces.generated.json
```

ถ้าข้อมูลขาด ระบบจะแจ้ง error ว่าแถวไหนขาดคอลัมน์อะไร

## 4. Check website

รันเว็บหรือ build:

```bash
npm run build
```

จากนั้นเช็ก:

- หน้าแรก section Hero Pieces
- หน้า collection detail `/collection/[slug]`
- sitemap `/sitemap.xml`

## Notes

ข้อมูลหลักของ Hero Pieces ตอนนี้มาจาก:

```text
src/data/pieces.generated.json
```

ไฟล์นี้ถูกสร้างจาก CSV อัตโนมัติ อย่าแก้ไฟล์ generated ด้วยมือถ้าไม่จำเป็น
