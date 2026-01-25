// Extract images using pdf-image-extractor
const fs = require('fs');
const path = require('path');
const PDFImageExtractor = require('pdf-image-extractor');

const pdfPath = path.join(__dirname, '..', 'Your paragraph text (2).pdf');
const outputDir = path.join(__dirname, '..', 'public', 'images', 'team');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

(async () => {
  try {
    console.log('Extracting images from PDF...');
    console.log(`PDF: ${pdfPath}`);
    console.log(`Output: ${outputDir}\n`);
    
    const { ExtractImages } = require('pdf-image-extractor');
    const result = await ExtractImages(pdfPath);
    
    console.log('Result type:', typeof result);
    console.log('Result:', result);
    
    const images = result?.images || result || [];
    console.log(`✓ Found ${images.length} images in PDF\n`);
    
    const imageNames = ['treasure', 'katie', 'stacy', 'tricia', 'kevin'];
    
    // Save images
    for (let i = 0; i < Math.min(images.length, imageNames.length); i++) {
      const image = images[i];
      const filename = imageNames[i];
      const imagePath = path.join(outputDir, `${filename}.jpg`);
      
      // Write image data to file
      fs.writeFileSync(imagePath, image.data);
      console.log(`✓ Extracted: ${filename}.jpg`);
    }
    
    if (images.length < 5) {
      console.log(`\n⚠ Only found ${images.length} images (expected 5 team members)`);
      console.log('Some images might need to be extracted manually.');
    } else {
      console.log('\n✓ Successfully extracted all team member images!');
    }
    
  } catch (error) {
    console.error('✗ Error extracting images:', error.message);
    console.error('\nStack:', error.stack);
    console.error('\nAlternative: Extract images manually using Preview (macOS)');
  }
})();
