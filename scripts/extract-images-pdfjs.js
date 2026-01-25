// Extract images from PDF using pdfjs-dist
const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

const pdfPath = path.join(__dirname, '..', 'Your paragraph text (2).pdf');
const outputDir = path.join(__dirname, '..', 'public', 'images', 'team');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

(async () => {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: dataBuffer });
    const pdfDocument = await loadingTask.promise;
    
    console.log(`PDF has ${pdfDocument.numPages} pages`);
    
    const imageNames = ['treasure', 'katie', 'stacy', 'tricia', 'kevin'];
    let imageIndex = 0;
    
    // Go through each page
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      
      console.log(`\nProcessing page ${pageNum}...`);
      
      // Get operator list (contains all operations including image drawing)
      const operatorList = await page.getOperatorList();
      
      // Extract images from the operator list
      for (let i = 0; i < operatorList.fnArray.length; i++) {
        const op = operatorList.fnArray[i];
        
        // Check if this is an image operation
        if (op === pdfjsLib.OPS.paintImageXObject || op === pdfjsLib.OPS.paintJpegXObject) {
          const imageName = operatorList.argsArray[i][0];
          
          try {
            // Get the image from the page's resources
            const xobject = await page.objs.get(imageName);
            
            if (xobject && xobject.data) {
              const imageData = xobject.data;
              
              // Determine file extension based on image type
              let ext = 'jpg';
              if (imageData instanceof Uint8Array) {
                // Check if it's PNG (starts with PNG signature)
                if (imageData[0] === 0x89 && imageData[1] === 0x50) {
                  ext = 'png';
                }
              }
              
              const filename = imageNames[imageIndex] || `image-${imageIndex}`;
              const imagePath = path.join(outputDir, `${filename}.${ext}`);
              
              fs.writeFileSync(imagePath, Buffer.from(imageData));
              console.log(`✓ Extracted image: ${imagePath}`);
              
              imageIndex++;
              
              // Stop after extracting 5 images (one for each team member)
              if (imageIndex >= imageNames.length) {
                console.log('\n✓ Extracted all team member images!');
                return;
              }
            }
          } catch (e) {
            // Skip images we can't extract
            console.log(`  Skipping image ${i}: ${e.message}`);
          }
        }
      }
    }
    
    console.log(`\n✓ Extraction complete! Found ${imageIndex} images.`);
    
  } catch (error) {
    console.error('Error extracting images:', error.message);
    console.error('Stack:', error.stack);
  }
})();
