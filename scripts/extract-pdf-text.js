// Script to extract text from PDF using pdf-parse v2
const fs = require('fs');
const path = require('path');

const pdfPath = path.join(__dirname, '..', 'Your paragraph text (2).pdf.pdf');

(async () => {
  try {
    const { PDFParse } = require('pdf-parse');
    
    // Try using file path directly
    const parser = new PDFParse({ url: pdfPath });
    
    const result = await parser.getText();
    const text = result.text;
    
    console.log('=== PDF Text Extracted ===\n');
    console.log(text.substring(0, 3000));
    console.log('\n\n=== Total length: ' + text.length + ' characters ===\n');
    
    // Find team member sections
    const members = ['Treasure', 'Katie', 'Stacy', 'Tricia', 'Kevin'];
    
    console.log('\n=== Looking for Team Member Bios ===\n');
    members.forEach(member => {
        const regex = new RegExp(`${member}[\\s\\S]{0,800}`, 'i');
        const match = text.match(regex);
        if (match) {
            console.log(`\n--- ${member} ---`);
            const bioText = match[0].substring(member.length, 600).trim();
            console.log(bioText);
            console.log('\n');
        } else {
            console.log(`${member}: Not found in text`);
        }
    });
    
  } catch (error) {
    console.error('Error reading PDF:', error.message);
    console.error('\nStack:', error.stack);
  }
})();
