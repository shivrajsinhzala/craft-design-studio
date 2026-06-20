import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Recursively get all files in a directory
function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      files.push(name);
    }
  }
  return files;
}

async function optimize() {
  console.log('Scanning public directory for images...');
  
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error('Error: "public" directory not found.');
    return;
  }

  const allFiles = getFiles(PUBLIC_DIR);
  const imageExtensions = ['.png', '.jpg', '.jpeg'];
  const targets = allFiles.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
  });

  console.log(`Found ${targets.length} images to optimize.`);

  let successCount = 0;
  let totalSavedMB = 0;

  for (const filePath of targets) {
    const ext = path.extname(filePath);
    const dirName = path.dirname(filePath);
    const baseName = path.basename(filePath, ext);
    const outputPath = path.join(dirName, `${baseName}.webp`);

    try {
      const stats = fs.statSync(filePath);
      const originalSizeMB = stats.size / (1024 * 1024);

      console.log(`Optimizing: ${path.relative(PUBLIC_DIR, filePath)} (${originalSizeMB.toFixed(2)} MB)`);

      // Convert to webp with quality 82, keeping original dimensions
      await sharp(filePath)
        .webp({ quality: 82 })
        .toFile(outputPath);

      const newStats = fs.statSync(outputPath);
      const newSizeMB = newStats.size / (1024 * 1024);
      const savedMB = originalSizeMB - newSizeMB;
      totalSavedMB += savedMB;

      console.log(`  └─> Created: ${path.relative(PUBLIC_DIR, outputPath)} (${newSizeMB.toFixed(2)} MB) [Saved: ${(savedMB).toFixed(2)} MB / ${((savedMB / originalSizeMB) * 100).toFixed(1)}%]`);

      // Delete the original file
      fs.unlinkSync(filePath);
      successCount++;
    } catch (err) {
      console.error(`  └─> Failed to optimize ${path.relative(PUBLIC_DIR, filePath)}:`, err.message);
    }
  }

  console.log('\n--- Optimization Summary ---');
  console.log(`Successfully optimized: ${successCount} / ${targets.length} images`);
  console.log(`Total storage space saved: ${totalSavedMB.toFixed(2)} MB`);
}

optimize();
