// Simple script to read PDF using pdf-parse
const fs = require('fs');
const path = require('path');

const pdfPath = path.join(__dirname, '..', 'Your paragraph text (2).pdf');

// Use dynamic import for ESM module
import('pdf-parse').then(pdfParseModule => {
  const dataBuffer = fs.readFileSync(pdfPath);
  const pdfParse = pdfParseModule.default || pdfParseModule;
  
  return pdfParse(dataBuffer);
}).then(data => {
  const text = data.text;
  
  console.log('=== Full PDF Text ===\n');
  console.log(text);
  
  console.log('\n\n=== Looking for Team Members ===\n');
  const members = ['Treasure', 'Katie', 'Stacy', 'Tricia', 'Kevin'];
  
  members.forEach(member => {
    const index = text.indexOf(member);
    if (index !== -1) {
      const snippet = text.substring(index, index + 500);
      console.log(`\n--- ${member} ---`);
      console.log(snippet);
      console.log('\n');
    }
  });
}).catch(error => {
  console.error('Error:', error.message);
  console.error('\nTrying alternative method...');
  
  // Alternative: try using the CJS version directly
  try {
    const pdfParse = require('pdf-parse/lib/pdf-parse.js');
    const dataBuffer = fs.readFileSync(pdfPath);
    pdfParse(dataBuffer).then(data => {
      console.log('\n=== PDF Text (Alternative Method) ===\n');
      console.log(data.text.substring(0, 3000));
    });
  } catch (e) {
    console.error('Alternative method also failed:', e.message);
  }
});
