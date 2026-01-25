// Extract images from PDF using pdfjs-dist
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
    // Try to import pdfjs-dist
    const pdfjsLib = require('pdfjs-dist');
    
    // Load the PDF
    const dataBuffer = fs.readFileSync(pdfPath);
    const loadingTask = pdfjsLib.getDocument({ data: dataBuffer });
    const pdfDocument = await loadingTask.promise;
    
    console.log(`✓ Loaded PDF with ${pdfDocument.numPages} pages`);
    
    const imageNames = ['treasure', 'katie', 'stacy', 'tricia', 'kevin'];
    const extractedImages = [];
    
    // Process each page
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      console.log(`\nProcessing page ${pageNum}...`);
      const page = await pdfDocument.getPage(pageNum);
      
      // Get the operator list
      const operatorList = await page.getOperatorList();
      
      // Extract images from operators
      for (let i = 0; i < operatorList.fnArray.length; i++) {
        const op = operatorList.fnArray[i];
        
        // Check for image operations (paintImageXObject, paintJpegXObject, etc.)
        if (op === 71 || op === 72 || op === 73) { // Image operation codes
          const imageName = operatorList.argsArray[i]?.[0];
          
          if (imageName) {
            try {
              // Get the image object
              const imageObj = await page.objs.get(imageName);
              
              if (imageObj && imageObj.data) {
                const imageData = imageObj.data;
                
                // Determine format
                let ext = 'jpg';
                if (imageData instanceof Uint8Array || imageData instanceof Buffer) {
                  const buf = Buffer.from(imageData);
                  // Check for PNG signature
                  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
                    ext = 'png';
                  }
                }
                
                const filename = imageNames[extractedImages.length] || `image-${extractedImages.length}`;
                const imagePath = path.join(outputDir, `${filename}.${ext}`);
                
                fs.writeFileSync(imagePath, Buffer.from(imageData));
                console.log(`  ✓ Extracted: ${filename}.${ext}`);
                
                extractedImages.push(imagePath);
                
                // Stop after extracting 5 images
                if (extractedImages.length >= 5) {
                  console.log('\n✓ Successfully extracted all team member images!');
                  return;
                }
              }
            } catch (e) {
              // Skip images we can't extract
              continue;
            }
          }
        }
      }
    }
    
    if (extractedImages.length > 0) {
      console.log(`\n✓ Extracted ${extractedImages.length} images!`);
    } else {
      console.log('\n⚠ No images found. The PDF might use a different image format.');
    }
    
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error('\nNote: You may need to extract images manually:');
    console.error('1. Open the PDF in Preview');
    console.error('2. Go to each team member page');
    console.error('3. Copy and save each photo as treasure.jpg, katie.jpg, etc.');
  }
})();
