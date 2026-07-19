import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../public');

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (file.endsWith('.webp')) {
      await optimizeImage(fullPath);
    }
  }
}

async function optimizeImage(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const tmpPath = filePath + '.tmp';
    
    // Resize down to 1920 max width/height if larger, set quality to 70
    await sharp(buffer)
      .resize({
        width: 1920,
        height: 1920,
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 65, effort: 6 })
      .toFile(tmpPath);
    
    fs.renameSync(tmpPath, filePath);
    console.log(`Optimized: ${filePath.split('/public/')[1]}`);
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

processDirectory(publicDir).then(() => {
  console.log('Image optimization complete!');
});
