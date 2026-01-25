const fs = require('fs');
const pdfParse = require('pdf-parse');

(async () => {
  try {
    const dataBuffer = fs.readFileSync('Your paragraph text (2).pdf');
    const data = await pdfParse(dataBuffer);
    const text = data.text;
    
    // Split by page markers
    const pages = text.split(/-- \d+ of \d+ --/);
    
    console.log('=== PAGE 2 MISSION STATEMENT ===\n');
    if (pages[2]) {
      console.log(pages[2].trim());
    } else {
      // If no page markers, try to find mission statement
      const missionMatch = text.match(/mission[^.]*([^.]{100,1000})/i);
      if (missionMatch) {
        console.log(missionMatch[1]);
      } else {
        console.log('Mission not found. Showing page 2 area:');
        console.log(text.substring(1000, 3000));
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
