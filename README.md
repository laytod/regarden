# ReGarden - Community Gardens Nonprofit Website

A modern, feature-rich website for ReGarden, a nonprofit organization dedicated to community gardens. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **About Page** - Organization information, mission, vision, and values
- **Team Page** - Team member profiles with bios and contact information
- **Event Calendar** - Full-featured calendar with CRUD functionality:
  - View events in month, week, or day views
  - Create new events
  - Edit existing events
  - Delete events
  - Color-coded event types (workshop, event, meeting)
- **Volunteer Page** - Information about volunteering and volunteer application form
- **Donate Page** - Donation information and donation form
- **Newsletter Signup** - Newsletter subscription component available throughout the site

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **FullCalendar** - Interactive calendar component
- **React Hook Form** - Form handling and validation
- **React** - UI library

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

### Building for Production

1. Build the production version:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Project Structure

```
regarden/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── team/              # Team page
│   ├── events/            # Events calendar page
│   ├── volunteer/         # Volunteer page
│   ├── donate/            # Donate page
│   ├── api/               # API routes
│   │   └── events/        # Events API endpoints
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Layout/            # Navigation and Footer
│   ├── Team/              # Team member components
│   ├── Events/            # Event calendar components
│   └── Forms/             # Form components
├── data/                  # JSON data files
│   ├── team.json          # Team member data
│   └── events.json        # Events data
├── public/                # Static assets
└── package.json           # Dependencies
```

## Data Storage

For this demo, data is stored in JSON files:
- `data/team.json` - Team member information
- `data/events.json` - Events data (can be modified through the calendar interface)

The events data can be dynamically updated through the calendar interface. Changes are saved to the `data/events.json` file.

## Features in Detail

### Event Calendar

- Click on any date to create a new event
- Click on an existing event to view/edit details
- Event types are color-coded:
  - Blue: Workshops
  - Green: Events
  - Purple: Meetings
- Switch between month, week, and day views
- All events are persisted in `data/events.json`

### Forms

All forms include client-side validation using React Hook Form:
- Newsletter Signup - Email validation
- Volunteer Application - Comprehensive form with multiple fields
- Donation Form - Amount selection and donor information

**Note:** The forms are currently demo versions. In production, they would integrate with:
- Email service (for newsletter)
- Volunteer management system (for applications)
- Payment processor (for donations)

## Customization

### Colors

Colors are defined in `tailwind.config.js`:
- Primary colors (green) - Used for main actions and branding
- Earth colors (brown/gray) - Used for text and backgrounds

### Team Members

Edit `data/team.json` to update team member information:
```json
{
  "id": "1",
  "name": "Name",
  "role": "Role",
  "email": "email@regarden.org",
  "phone": "(555) 123-4567",
  "bio": "Bio text",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/...",
    "twitter": "@username"
  }
}
```

### Initial Events

Initial events are defined in `data/events.json`. These can be modified through the calendar interface, or you can edit the file directly.

## Development Notes

- The website uses Next.js App Router for routing
- All pages are server-side rendered for better SEO
- The calendar uses FullCalendar with React integration
- Form validation is handled by React Hook Form
- API routes handle CRUD operations for events

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is a demo website for ReGarden nonprofit organization.

## Contact

For questions about this website, please contact: info@regarden.org
