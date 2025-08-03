const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const inputFile = path.join(__dirname, '../public/favicon.svg');
const outputDir = path.join(__dirname, '../public/icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate icons for each size
sizes.forEach(size => {
  sharp(inputFile)
    .resize(size, size)
    .png()
    .toFile(path.join(outputDir, `icon-${size}x${size}.png`))
    .then(() => {

    })
    .catch(err => {
      console.error(`Error generating icon-${size}x${size}.png:`, err);
    });
});