# ReGarden Website - Setup & Demo Instructions

## Quick Start Guide

Follow these steps to get the ReGarden website running on your local machine:

### Step 1: Install Dependencies

Open a terminal in the project directory (`/Users/treasurewho/Dev/regarden`) and run:

```bash
npm install
```

This will install all required dependencies including Next.js, React, TypeScript, Tailwind CSS, FullCalendar, and other packages.

**Expected output:** The installation should complete without errors. This may take 1-2 minutes.

### Step 2: Start the Development Server

Once dependencies are installed, start the development server:

```bash
npm run dev
```

**Expected output:** You should see something like:
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- info Loaded env from .env
```

### Step 3: Open the Website

Open your web browser and navigate to:

```
http://localhost:3000
```

You should see the ReGarden homepage with:
- A navigation bar at the top
- A hero section with "Growing Community, One Garden at a Time"
- Mission section
- Impact statistics
- Newsletter signup

## Navigating the Website

### Main Pages

1. **Home** (`/`) - Landing page with mission and impact
2. **About** (`/about`) - Organization information, mission, vision, values
3. **Team** (`/team`) - Team member profiles with bios and contact info
4. **Events** (`/events`) - Event calendar with CRUD functionality
5. **Volunteer** (`/volunteer`) - Volunteer information and application form
6. **Donate** (`/donate`) - Donation information and donation form

### Key Features to Demo

#### 1. Event Calendar (Events Page)

**To Create an Event:**
1. Navigate to the Events page
2. Click the "+ Add Event" button OR click on any date in the calendar
3. Fill in the event form:
   - Title (required)
   - Date (required)
   - Start Time (required)
   - End Time (required)
   - Location (required)
   - Description (required)
   - Event Type (required): Event, Workshop, or Meeting
   - Contact Person (required)
   - Contact Email (required)
4. Click "Create Event" or "Update Event"

**To Edit an Event:**
1. Click on any existing event in the calendar
2. Modify the event details
3. Click "Update Event"

**To Delete an Event:**
1. Click on an event to open it
2. Click the "Delete Event" button at the bottom
3. Confirm the deletion

**Calendar Views:**
- Switch between Month, Week, and Day views using the buttons in the top right
- Events are color-coded:
  - **Blue** = Workshops
  - **Green** = Events
  - **Purple** = Meetings

#### 2. Team Page

- View all team members with their:
  - Names and roles
  - Bios
  - Email addresses
  - Phone numbers
  - Social media links (where available)

#### 3. Newsletter Signup

- Available on the homepage and in the footer
- Enter an email address
- Form validates email format
- Shows success message after submission

#### 4. Volunteer Application

- Complete the volunteer application form:
  - Personal information
  - Volunteer interests (multiple selection)
  - Availability
  - Gardening experience level
  - Optional message
- Form validates all required fields

#### 5. Donation Form

- Select a preset amount or enter a custom amount
- Option to make it a monthly recurring donation
- Enter donor information
- Option to make donation anonymous
- Optional message

## Data Files

The website uses JSON files for data storage (demo purposes):

- **`data/team.json`** - Team member information
- **`data/events.json`** - Events data (can be modified through the calendar)

**Note:** When you create, update, or delete events through the calendar interface, the changes are saved to `data/events.json`.

## Troubleshooting

### Port 3000 Already in Use

If port 3000 is already in use, Next.js will automatically try the next available port (3001, 3002, etc.). Check the terminal output for the actual URL.

Alternatively, you can specify a different port:

```bash
PORT=3001 npm run dev
```

### Module Not Found Errors

If you encounter "module not found" errors:

1. Make sure you've run `npm install`
2. Delete `node_modules` folder and `package-lock.json`
3. Run `npm install` again

### TypeScript Errors

If you see TypeScript errors:

1. Make sure you're using Node.js 18.x or higher
2. Try deleting `.next` folder and rebuilding:
   ```bash
   rm -rf .next
   npm run dev
   ```

### Events Not Saving

Make sure the `data/events.json` file exists and is writable. The file should be located at:
```
/Users/treasurewho/Dev/regarden/data/events.json
```

## Building for Production

To build a production version:

```bash
npm run build
npm start
```

The production build will be optimized and ready for deployment.

## Stopping the Server

To stop the development server, press `Ctrl+C` (or `Cmd+C` on Mac) in the terminal where the server is running.

## Next Steps

1. **Customize Content:** Edit the data files (`data/team.json`, `data/events.json`) with your actual content
2. **Update Styling:** Modify colors and styles in `tailwind.config.js`
3. **Add Images:** Replace placeholder images in team profiles
4. **Integrate APIs:** Connect forms to actual email services and payment processors
5. **Deploy:** Deploy to Vercel, Netlify, or your preferred hosting platform

## Demo Checklist

Before presenting the demo, test these features:

- [ ] Navigate to all pages
- [ ] View team member profiles
- [ ] Create a new event
- [ ] Edit an existing event
- [ ] Delete an event
- [ ] Switch calendar views (month/week/day)
- [ ] Fill out newsletter signup form
- [ ] Fill out volunteer application form
- [ ] Fill out donation form
- [ ] Check mobile responsiveness (resize browser window)

## Questions?

If you encounter any issues or have questions, refer to the main README.md file for more detailed information.

---

**Ready to start?** Run `npm install` then `npm run dev` to get started!
