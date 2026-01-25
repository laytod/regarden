// Script to extract images from PDF using pdf-parse
const fs = require('fs');
const path = require('path');

const pdfPath = path.join(__dirname, '..', 'Your paragraph text (2).pdf');
const outputDir = path.join(__dirname, '..', 'public', 'images', 'team');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

(async () => {
  try {
    const { PDFParse } = require('pdf-parse');
    
    const parser = new PDFParse({ url: pdfPath });
    
    // Try to get images
    try {
      const images = await parser.getImages();
      console.log(`Found ${images.length} images in PDF`);
      
      if (images.length > 0) {
        // Save each image
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          console.log(`Image ${i}:`, typeof image, Object.keys(image || {}));
          
          // Try to get image data
          if (image && image.data) {
            const imagePath = path.join(outputDir, `image-${i}.png`);
            fs.writeFileSync(imagePath, image.data);
            console.log(`Saved: ${imagePath}`);
          }
        }
      }
    } catch (e) {
      console.log('getImages() not available, trying alternative methods...');
      console.log('Error:', e.message);
    }
    
    // Try to get all content
    try {
      const allContent = await parser.getAll();
      console.log('\nAll content keys:', Object.keys(allContent));
      
      if (allContent.images) {
        console.log(`Found ${allContent.images.length} images via getAll()`);
        allContent.images.forEach((img, i) => {
          if (img.data) {
            const imagePath = path.join(outputDir, `team-${i}.png`);
            fs.writeFileSync(imagePath, Buffer.from(img.data));
            console.log(`Saved: ${imagePath}`);
          }
        });
      }
    } catch (e) {
      console.log('getAll() error:', e.message);
    }
    
    // Try getting pages and extracting images from each
    try {
      const pages = await parser.getPages();
      console.log(`\nFound ${pages.length} pages`);
      
      for (let pageNum = 0; pageNum < pages.length; pageNum++) {
        const page = pages[pageNum];
        if (page.images && page.images.length > 0) {
          console.log(`Page ${pageNum + 1} has ${page.images.length} images`);
          page.images.forEach((img, imgIdx) => {
            if (img.data) {
              const imagePath = path.join(outputDir, `page-${pageNum + 1}-img-${imgIdx}.png`);
              fs.writeFileSync(imagePath, Buffer.from(img.data));
              console.log(`Saved: ${imagePath}`);
            }
          });
        }
      }
    } catch (e) {
      console.log('getPages() error:', e.message);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
})();
