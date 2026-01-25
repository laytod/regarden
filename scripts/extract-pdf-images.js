const pdf = require('pdf-poppler');
const fs = require('fs');
const path = require('path');

const pdfPath = path.join(__dirname, '..', 'Your paragraph text (2).pdf');
const outputDir = path.join(__dirname, '..', 'public', 'images', 'team');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const options = {
  format: 'png',
  out_dir: outputDir,
  out_prefix: 'page',
  page: null, // extract all pages
};

console.log('Extracting images from PDF...');
console.log(`PDF: ${pdfPath}`);
console.log(`Output: ${outputDir}`);

pdf.convert(pdfPath, options)
  .then(res => {
    console.log('PDF images extracted successfully!');
    console.log('Files:', res);
  })
  .catch(error => {
    console.error('Error extracting images:', error);
    console.error('\nIf you see an error, you may need to:');
    console.error('1. Install poppler: brew install poppler');
    console.error('2. Or manually extract images from the PDF');
  });
