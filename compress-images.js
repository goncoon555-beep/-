// compress-images.js
// ใช้ sharp บีบอัดและแปลงภาพ jpg/png เป็น webp

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, 'split', 'images');
const outputDir = path.join(__dirname, 'split', 'images', 'compressed');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

fs.readdirSync(inputDir).forEach(file => {
  const ext = path.extname(file).toLowerCase();
  if (['.jpg', '.jpeg', '.png'].includes(ext)) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace(ext, '.webp'));
    sharp(inputPath)
      .resize({ width: 1200 }) // ปรับขนาดสูงสุด 1200px
      .webp({ quality: 80 }) // บีบอัดคุณภาพ 80%
      .toFile(outputPath)
      .then(() => console.log('Compressed:', outputPath))
      .catch(err => console.error('Error:', err));
  }
});
