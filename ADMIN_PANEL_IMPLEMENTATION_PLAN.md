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
- ⏳ Polish & security hardening (Phase 5)

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

## Phase 5: Polish & Security Hardening ⏳ TODO

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

6. **Write Phase 5 tests (required before marking complete)**
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
│   │   ├── users/           # Phase 5
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
│           └── users/           # Phase 5
├── components/
│   ├── Admin/
│   │   ├── ContentEditor.tsx    # Phase 2
│   │   ├── ImageUploader.tsx    # Phase 3
│   │   ├── ImageManager.tsx     # Phase 3
│   │   └── UserManager.tsx      # Phase 5
│   └── Auth/
│       └── ResetPasswordForm.tsx # Phase 4
├── data/
│   ├── users.json
│   ├── content.json              # Phase 2
│   └── password-reset-tokens.json
├── lib/
│   ├── auth.ts
│   ├── auth-config.ts
│   ├── auth-setup.ts
│   ├── content.ts                # Phase 2
│   ├── images.ts                  # Phase 3
│   ├── security.ts
│   ├── types.ts
│   └── validation.ts
└── middleware.ts
```

---

## Next Steps

1. ✅ **Phase 1 Complete** - Authentication foundation is done
2. ⏳ **Phase 2** - Start content management system
3. ⏳ **Phase 3** - Add image management
4. ⏳ **Phase 4** - Implement password reset
5. ⏳ **Phase 5** - Polish and security hardening

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
