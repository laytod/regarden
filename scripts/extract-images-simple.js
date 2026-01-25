// Try to extract images using pdf-poppler (requires poppler-utils)
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-poppler');

const pdfPath = path.join(__dirname, '..', 'Your paragraph text (2).pdf');
const outputDir = path.join(__dirname, '..', 'public', 'images', 'team');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Extracting images from PDF...');
console.log(`PDF: ${pdfPath}`);
console.log(`Output: ${outputDir}`);

const options = {
  format: 'png',  // Output format
  out_dir: outputDir,
  out_prefix: 'team',  // Prefix for output files
  page: null,  // null means extract all pages
};

pdf.convert(pdfPath, options)
  .then(res => {
    console.log('✓ PDF converted successfully!');
    console.log('Files created:', res);
    
    // The output will be page-1.png, page-2.png, etc.
    // We need to identify which pages contain team member photos
    console.log('\n✓ Images extracted! Check the output directory.');
    console.log('Note: You may need to rename the files to match team member names.');
    console.log('The PDF has multiple pages - team photos should be on specific pages.');
  })
  .catch(error => {
    console.error('✗ Error extracting images:', error.message);
    console.error('\nNote: pdf-poppler requires poppler-utils to be installed.');
    console.error('Install with: brew install poppler');
    console.error('\nAlternatively, you can extract images manually:');
    console.error('1. Open the PDF in Preview (macOS)');
    console.error('2. Navigate to each team member page');
    console.error('3. Copy the photo and save as treasure.jpg, katie.jpg, etc.');
  });
