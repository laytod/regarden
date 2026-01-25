# Instructions for Extracting Images from PDF

The team member photos need to be extracted from the PDF file `Your paragraph text (2).pdf` and saved to `public/images/team/`.

## Method 1: Using macOS Preview (Easiest)

1. Open the PDF file `Your paragraph text (2).pdf` in Preview
2. Navigate to each team member's page
3. For each team member:
   - Click on their photo
   - Right-click and select "Copy Image" (or Cmd+C)
   - Open Preview > New from Clipboard
   - File > Export
   - Choose format: JPEG
   - Quality: High
   - Save to: `public/images/team/[name].jpg`
     - `treasure.jpg`
     - `katie.jpg`
     - `stacy.jpg`
     - `tricia.jpg`
     - `kevin.jpg`

## Method 2: Using Command Line (if poppler is installed)

If you have `poppler` installed (via `brew install poppler`), you can run:

```bash
cd /Users/treasurewho/Dev/regarden
pdfimages "Your paragraph text (2).pdf" public/images/team/team-member
```

This will extract all images. You'll need to rename them appropriately.

## Method 3: Manual Export from PDF Viewers

1. Open the PDF in Adobe Reader or another PDF viewer
2. Use the export or save image function
3. Save each team member's photo with the correct filename

## Required Image Files

Make sure these files exist in `public/images/team/`:
- `treasure.jpg` (or .png)
- `katie.jpg` (or .png)
- `stacy.jpg` (or .png)
- `tricia.jpg` (or .png)
- `kevin.jpg` (or .png)

## Image Format

- Preferred format: JPEG (.jpg) or PNG (.png)
- Recommended size: 400x400 pixels or larger
- The website will automatically scale and crop images as needed
