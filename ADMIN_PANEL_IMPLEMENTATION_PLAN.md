# Admin Panel Implementation Plan

## Overview

This document outlines the complete plan for implementing a secure admin panel for the ReGarden website, allowing authenticated administrators to edit content, manage images, and handle user accounts.

## Testing Policy

**Tests must be written for each phase before that phase is marked complete.**

- **Definition of Done (per phase):** All implementation work is done **and** the phase’s test suite is written, passing, and documented.
- **Order of work:** Write or extend tests as you implement each feature (test-first or test-alongside). Do not mark a phase complete until its tests exist and pass.
- **Coverage:** Aim for 80%+ coverage of phase-specific code. Focus on critical paths: APIs, validation, security, and key UI flows.
- **Running tests:** `npm test` | `npm run test:watch` | `npm run test:coverage`
- **Handling failing tests:** When tests fail, **do not rewrite tests to make them pass**. A failing test indicates a real problem in the codebase that needs investigation and fixing. Go through failing tests iteratively together, identify the root cause, and fix the underlying issue in the implementation code. Only modify tests if they are incorrectly written (e.g., testing the wrong thing), not because the implementation doesn't match the test.

See `__tests__/README.md` for structure, conventions, and how to add new tests.

## Goals

- ✅ Secure authentication system (Phase 1 - COMPLETE)
- ✅ Content management system (Phase 2 - COMPLETE)
- ⏳ Image upload/management (Phase 3)
- ⏳ Password reset functionality (Phase 4)
- ⏳ Change tracking & audit log (Phase 5)
- ⏳ Polish & security hardening (Phase 6)

---

## Phase Completion Checklist

**A phase is only complete when all of the following are true:**

1. ✅ All implementation steps for that phase are done  
2. ✅ Phase-specific tests are written (see each phase’s **Tests** section)  
3. ✅ `npm test` passes  
4. ✅ Test files and coverage goals are documented in `__tests__/README.md`

---

## Phase 1: Authentication Foundation ✅ COMPLETE

### What Was Implemented

**Core Authentication:**
- NextAuth v5 integration with credentials provider
- Password hashing with bcryptjs (12 salt rounds)
- JWT-based sessions (30-day expiration)
- Secure user storage in JSON files (for local testing)

**User Management:**
- User data structure with roles (admin/editor)
- Admin user creation script (`npm run create-admin`)
- Password verification system
- User lookup by email/ID

**Security Features:**
- Route protection via middleware
- CSRF protection (built into NextAuth)
- Secure password storage (never plain text)
- Input validation with Zod schemas
- Password reset token system (prepared for Phase 4)

**Admin UI:**
- Login page (`/admin/login`)
- Admin dashboard (`/admin`)
- Admin layout with header and logout
- Protected route handling
- Mobile-responsive design

**Files Created:**
- `lib/auth.ts` - User management utilities
- `lib/auth-config.ts` - NextAuth configuration
- `lib/auth-setup.ts` - NextAuth instance (handlers + auth)
- `lib/security.ts` - Security utilities (tokens, etc.)
- `lib/validation.ts` - Zod validation schemas
- `lib/types.ts` - TypeScript type definitions
- `app/api/auth/[...nextauth]/route.ts` - NextAuth handler
- `components/Auth/LoginForm.tsx` - Login form
- `components/Admin/AdminLayout.tsx` - Admin layout wrapper
- `app/admin/page.tsx` - Admin dashboard
- `app/admin/login/page.tsx` - Login page
- `middleware.ts` - Route protection middleware
- `data/users.json` - User accounts storage
- `scripts/create-admin.ts` - Admin user creation script

### Tests (Phase 1)

- `__tests__/lib/auth.test.ts` – auth utilities, user CRUD, hashing, lookup  
- `__tests__/lib/validation.test.ts` – Zod schemas (login, user, password reset)  
- `__tests__/lib/security.test.ts` – reset tokens, verify, expire, cleanup  
- `__tests__/components/Auth/LoginForm.test.tsx` – form render, validation, submit, errors, redirect  

---

## Phase 2: Content Management System ✅ COMPLETE

### Goals
- Create editable content structure
- Build content editor UI
- Implement content CRUD API
- Migrate existing content to JSON structure

### Content Inventory

**Homepage (`/`):**
- Hero heading: "Growing Gardens Growing Communities"
- Mission heading and text
- Three feature cards (Community Gardens, Education, Community)
- Newsletter section heading and description

**About Page (`/about`):**
- Page title: "About ReGarden"
- Mission section heading, text, and image
- Vision section heading and text
- Values section heading, four value cards, and image
- Contact section heading, text, and email

**Team Page (`/team`):**
- Page title: "Our Team"
- Quote text and attribution
- Three gallery images
- "Join Our Team" section heading and text
- Team member data (already in JSON, needs admin UI)

**Volunteer Page (`/volunteer`):**
- Page title and subtitle
- Main description text
- Background image
- Four volunteer type cards
- Contact coordinator section
- Application section heading and description

**Donate Page (`/donate`):**
- Page title: "Support ReGarden"
- Hero image
- "How Your Donation Helps" heading and description
- Three benefit cards
- Donation section heading and description

### Implementation Steps

1. **Create Content Data Structure**
   - Create `data/content.json` with all editable content
   - Structure: `{ homepage: {...}, about: {...}, team: {...}, volunteer: {...}, donate: {...} }`

2. **Migrate Existing Content**
   - Extract hardcoded content from pages
   - Convert to JSON structure
   - Update pages to read from JSON

3. **Build Content Editor UI**
   - Create `/admin/content` page
   - Form components for each content section
   - Rich text editor (optional) or textarea
   - Image selector component

4. **Create Content API**
   - `GET /api/admin/content` - Read all content
   - `PUT /api/admin/content` - Update content sections
   - Validation with Zod schemas

5. **Update Pages**
   - Modify pages to read from `data/content.json`
   - Fallback to current content if JSON missing
   - Server-side rendering with content

6. **Write Phase 2 tests (required before marking complete)**
   - Unit tests for `lib/content.ts` (read, update, validation)
   - API tests for `GET` / `PUT` `/api/admin/content`
   - Component tests for `ContentEditor` / `ContentSection` (render, edit, save)
   - Document new test files in `__tests__/README.md`

### Files to Create

```
app/admin/content/
  └── page.tsx              # Content editor UI
components/Admin/
  ├── ContentEditor.tsx      # Content editing form
  └── ContentSection.tsx    # Individual section editor
lib/
  └── content.ts             # Content management utilities
data/
  └── content.json           # All editable content
app/api/admin/content/
  └── route.ts               # Content CRUD API
__tests__/
  ├── lib/content.test.ts
  └── components/Admin/
      ├── ContentEditor.test.tsx
      └── ContentSection.test.tsx
```

---

## Phase 3: Image Management ⏳ TODO

### Goals
- Image upload functionality
- Image replacement
- Image deletion
- Image gallery/manager UI

### Implementation Steps

1. **Create Image Upload API**
   - `POST /api/admin/images` - Upload new image
   - File validation (type, size)
   - Save to `/public/images/`
   - Return image path

2. **Create Image Manager UI**
   - `/admin/images` page
   - Image gallery with thumbnails
   - Upload form with drag-and-drop
   - Delete functionality
   - Image preview

3. **Update Content to Reference Images**
   - Link content editor to image manager
   - Image picker component
   - Update image paths in content.json

4. **Write Phase 3 tests (required before marking complete)**
   - Unit tests for `lib/images.ts` (upload, delete, validation)
   - API tests for `POST` / `DELETE` `/api/admin/images`
   - Component tests for `ImageUploader`, `ImageManager`, `ImagePicker`
   - Document new test files in `__tests__/README.md`

### Files to Create

```
app/admin/images/
  └── page.tsx              # Image manager UI
components/Admin/
  ├── ImageUploader.tsx      # Upload component
  ├── ImageManager.tsx       # Gallery/manager
  └── ImagePicker.tsx       # Image selector for content
app/api/admin/images/
  └── route.ts               # Image upload/delete API
lib/
  └── images.ts              # Image handling utilities
__tests__/
  ├── lib/images.test.ts
  └── components/Admin/
      ├── ImageUploader.test.tsx
      └── ImageManager.test.tsx
```

---

## Phase 4: Password Reset ⏳ TODO

### Goals
- Password reset token generation
- Email service integration (or mock for local)
- Reset password UI
- Token expiration and validation

### Implementation Steps

1. **Password Reset Request**
   - `POST /api/auth/reset-password` - Generate token
   - Store token in `data/password-reset-tokens.json`
   - Send email with reset link (or log for local)

2. **Password Reset Page**
   - `/admin/reset-password` - Request reset
   - `/admin/reset-password/[token]` - Reset with token
   - Form validation

3. **Password Reset API**
   - `POST /api/auth/reset-token` - Verify and reset
   - Validate token (not expired, not used)
   - Update password
   - Mark token as used

4. **Write Phase 4 tests (required before marking complete)**
   - Extend `lib/security.test.ts` or add tests for reset-specific flows
   - API tests for `POST /api/auth/reset-password` and `POST /api/auth/reset-token`
   - Component tests for `ResetPasswordForm` (request reset, submit token, validation)
   - Document new test files in `__tests__/README.md`

### Files to Create

```
app/admin/reset-password/
  ├── page.tsx               # Request reset page
  └── [token]/page.tsx       # Reset with token page
components/Auth/
  └── ResetPasswordForm.tsx  # Reset form
app/api/auth/reset-password/
  └── route.ts               # Request reset API
app/api/auth/reset-token/
  └── route.ts               # Verify & reset API
__tests__/
  └── components/Auth/ResetPasswordForm.test.tsx
```

---

## Phase 5: Change Tracking & Audit Log ⏳ TODO

### Goals
- Track all changes made through admin panel
- Attribute each change to specific user
- Display change history in read-only audit log
- Maintain immutable change records

### Implementation Steps

1. **Create Change Log Data Structure**
   - Create `data/change-log.json` to store change records
   - Structure: Array of change log entries with id, timestamp, user info, change type, and details
   - Auto-create file if missing

2. **Create Change Log Library**
   - `lib/change-log.ts` - Functions to record and retrieve changes
   - `recordChange()` - Add new change entry with auto-generated ID and timestamp
   - `getChangeLog()` - Get recent changes (with optional limit, user filter, type filter)
   - Handle file read/write operations

3. **Update Content API to Record Changes**
   - Modify `PUT /api/admin/content` handler
   - After successful update, call `recordChange()` with user info from session
   - Record which sections were changed (compare old vs new values)
   - Store change details with section paths

4. **Update Image API to Record Changes**
   - Modify `POST /api/admin/images` handler - Record image uploads
   - Modify `DELETE /api/admin/images` handler - Record image deletions
   - Extract user info from session and record change with image path

5. **Create Change Log API Endpoint**
   - `GET /api/admin/change-log` - Retrieve change log entries
   - Support query params: `?limit=50&userId=xxx&type=content`
   - Protected route (requires authentication)
   - Return array of change log entries

6. **Create Change Log UI Component**
   - `components/Admin/ChangeLog.tsx` - Display change log entries
   - Show user name/email, formatted timestamp, change type badge, change details
   - Read-only display (no edit/delete functionality)
   - Optional: Pagination or "load more" for large logs
   - Optional: Filters by user or change type

7. **Create Change Log Admin Page**
   - `/admin/change-log` page - View change history
   - Protected route (requires authentication)
   - Display ChangeLog component
   - Page title: "Change History" or "Audit Log"

8. **Update Admin Dashboard**
   - Add new card linking to change log page
   - Update dashboard navigation

9. **Update Types**
   - Add `ChangeType` type: `'content' | 'image_upload' | 'image_delete'`
   - Add `ChangeLogEntry` interface to `lib/types.ts`

10. **Write Phase 6 tests (required before marking complete)**
    - Unit tests for `lib/change-log.ts` (record, retrieve, filter)
    - API tests for `GET /api/admin/change-log` (auth, query params, responses)
    - Component tests for `ChangeLog` (render, formatting, read-only)
    - Update existing content/images API tests to verify change recording
    - Document new test files in `__tests__/README.md`

### Data Structure

```typescript
interface ChangeLogEntry {
  id: string                    // Unique ID (timestamp-based)
  timestamp: string             // ISO 8601 timestamp
  userId: string                // User ID from session
  userEmail: string             // User email
  userName: string              // User name
  changeType: 'content' | 'image_upload' | 'image_delete'
  details: {
    // For content changes:
    section?: string            // e.g., "homepage.hero.heading"
    oldValue?: unknown          // Previous value (if available)
    newValue?: unknown          // New value
    
    // For image changes:
    imagePath?: string          // Image path for upload/delete
    action?: string             // "uploaded" or "deleted"
  }
}
```

### Files to Create

```
lib/
  └── change-log.ts              # Change log utilities
app/api/admin/change-log/
  └── route.ts                   # Change log API endpoint
app/admin/change-log/
  └── page.tsx                   # Change log admin page
components/Admin/
  └── ChangeLog.tsx              # Change log display component
data/
  └── change-log.json            # Change log storage (auto-created)
__tests__/
  ├── lib/change-log.test.ts
  ├── api/admin/change-log.test.ts
  └── components/Admin/ChangeLog.test.tsx
```

### Files to Modify

```
lib/types.ts                     # Add ChangeLogEntry and ChangeType types
app/api/admin/content/route.ts   # Record changes on PUT
app/api/admin/images/route.ts    # Record changes on POST/DELETE
app/admin/page.tsx               # Add change log link
__tests__/api/admin/content.test.ts  # Test change recording
__tests__/api/admin/images.test.ts  # Test change recording
```

### Security Considerations

- Change log entries are read-only (no API to modify/delete)
- Only authenticated admins can view change log
- User information comes from session (trusted source)
- Change log file stored in `data/` directory (not publicly accessible)

### User Experience

- Change log accessible from admin dashboard
- Clear, readable format showing who changed what and when
- Helps with accountability and debugging
- Non-editable to maintain audit trail integrity

---

## Phase 6: Polish & Security Hardening ⏳ TODO

### Goals
- Rate limiting on auth endpoints
- Security headers
- Input sanitization
- Error handling improvements
- Mobile-responsive admin UI
- User management UI

### Implementation Steps

1. **Rate Limiting**
   - Add rate limiting to login endpoint (5 attempts per 15 min)
   - Add rate limiting to password reset

2. **Security Headers**
   - Content Security Policy
   - X-Frame-Options
   - X-Content-Type-Options

3. **Input Sanitization**
   - Sanitize all user inputs
   - HTML escaping for content
   - File upload validation

4. **User Management UI**
   - `/admin/users` page
   - List all users
   - Create/edit/delete users
   - Role management

5. **Error Handling**
   - Better error messages
   - Error logging
   - User-friendly error pages

6. **Write Phase 6 tests (required before marking complete)**
   - Unit tests for `lib/rate-limit.ts` and any new security helpers
   - API tests for rate-limited auth endpoints and `/api/admin/users`
   - Component tests for `UserManager` (list, create, edit, delete, roles)
   - Document new test files in `__tests__/README.md`

### Files to Create

```
app/admin/users/
  └── page.tsx               # User management UI
components/Admin/
  └── UserManager.tsx        # User management component
app/api/admin/users/
  └── route.ts               # User CRUD API
lib/
  └── rate-limit.ts          # Rate limiting utilities
__tests__/
  ├── lib/rate-limit.test.ts
  └── components/Admin/UserManager.test.tsx
```

---

## Technology Stack

### Current (Phase 1)
- **NextAuth v5** - Authentication
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Password reset tokens
- **Zod** - Input validation
- **TypeScript** - Type safety
- **JSON files** - Data storage (local testing)

### Future Considerations
- **Database** - PostgreSQL/MongoDB/SQLite (when ready)
- **Email Service** - SendGrid/Resend/Nodemailer (for password reset)
- **File Storage** - Local filesystem (current) or cloud storage (S3, etc.)

---

## Security Measures

### Implemented (Phase 1)
- ✅ Password hashing (bcrypt, 12 salt rounds)
- ✅ JWT sessions with expiration
- ✅ Route protection via middleware
- ✅ CSRF protection (NextAuth)
- ✅ Secure password storage
- ✅ Input validation (Zod)

### Planned (Phase 5)
- ⏳ Rate limiting
- ⏳ Security headers
- ⏳ Input sanitization
- ⏳ File upload validation
- ⏳ Error logging

---

## Local Testing (No Database)

### Current Setup
- User accounts: `data/users.json`
- Password reset tokens: `data/password-reset-tokens.json`
- Content: `data/content.json` (Phase 2)
- Images: `/public/images/` directory
- Change log: `data/change-log.json` (Phase 5)

### Testing Strategy
- **Automated (required):** Each phase must have its test suite written and passing before that phase is complete. Run `npm test` (see **Testing Policy** and **Phase Completion Checklist** above).
- **Manual (supplemental):**
  1. Create admin user via script
  2. Test login/logout flow
  3. Test content editing (Phase 2)
  4. Test image uploads (Phase 3)
  5. Test password reset (Phase 4)

---

## Migration Path to Database

When ready to add a database:

**Option 1: PostgreSQL with Prisma**
- Add Prisma ORM
- Create schema for users, content, images
- Migrate JSON data to database
- Update API routes to use Prisma

**Option 2: MongoDB**
- Add Mongoose
- Create models
- Migrate data
- Update API routes

**Option 3: SQLite (Simple)**
- Add better-sqlite3
- Create tables
- Migrate data
- Minimal changes to API

The JSON file structure can be directly mapped to database tables/collections.

---

## File Structure

```
regarden/
├── app/
│   ├── admin/
│   │   ├── content/         # Phase 2
│   │   ├── images/          # Phase 3
│   │   ├── change-log/      # Phase 5
│   │   ├── users/           # Phase 6
│   │   ├── reset-password/  # Phase 4
│   │   ├── login/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/
│       │   ├── reset-password/  # Phase 4
│       │   └── reset-token/     # Phase 4
│       └── admin/
│           ├── content/         # Phase 2
│           ├── images/          # Phase 3
│           ├── change-log/      # Phase 5
│           └── users/           # Phase 6
├── components/
│   ├── Admin/
│   │   ├── ContentEditor.tsx    # Phase 2
│   │   ├── ImageUploader.tsx    # Phase 3
│   │   ├── ImageManager.tsx     # Phase 3
│   │   ├── ChangeLog.tsx        # Phase 5
│   │   └── UserManager.tsx      # Phase 6
│   └── Auth/
│       └── ResetPasswordForm.tsx # Phase 4
├── data/
│   ├── users.json
│   ├── content.json              # Phase 2
│   ├── change-log.json           # Phase 5
│   └── password-reset-tokens.json
├── lib/
│   ├── auth.ts
│   ├── auth-config.ts
│   ├── auth-setup.ts
│   ├── content.ts                # Phase 2
│   ├── images.ts                  # Phase 3
│   ├── change-log.ts              # Phase 5
│   ├── rate-limit.ts              # Phase 6
│   ├── security.ts
│   ├── types.ts
│   └── validation.ts
└── middleware.ts
```

---

## Next Steps

1. ✅ **Phase 1 Complete** - Authentication foundation is done
2. ✅ **Phase 2 Complete** - Content management system is done
3. ⏳ **Phase 3** - Add image management
4. ⏳ **Phase 4** - Implement password reset
5. ⏳ **Phase 5** - Change tracking & audit log
6. ⏳ **Phase 6** - Polish and security hardening

---

## Notes

- All authentication works without a database (JSON file storage)
- Ready for database migration when needed
- Admin panel is fully functional and secure
- All code is TypeScript-typed and linted
- Mobile-responsive design maintained throughout

---

**Last Updated:** Phase 2 Complete
**Status:** Ready for Phase 3 Implementation
