# Admin Panel Setup - Phase 1: Authentication

## Overview

Phase 1 of the admin panel implementation is complete! This includes:
- ✅ Secure authentication with NextAuth
- ✅ Password hashing with bcrypt
- ✅ Admin user management
- ✅ Protected admin routes
- ✅ Login page and admin dashboard

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Generate a secure secret key
# Run: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Optional: override base URL for auth redirects (e.g. ngrok for mobile testing).
# When set, redirects use this domain instead of NEXTAUTH_URL.
# APP_URL=https://lurid-holly-coercive.ngrok-free.dev
```

### 2. Create Your First Admin User

Run the admin user creation script:

```bash
# Using npx ts-node
npx ts-node scripts/create-admin.ts admin@regarden.org yourpassword123 "Admin Name"

# Or if you have ts-node installed globally
ts-node scripts/create-admin.ts admin@regarden.org yourpassword123 "Admin Name"
```

**Example:**
```bash
npx ts-node scripts/create-admin.ts admin@regarden.org SecurePass123! "Katie Martinek"
```

This will:
- Create a new admin user
- Hash the password securely
- Save to `data/users.json`

### 3. Start the Development Server

```bash
npm run dev
```

### 4. Access the Admin Panel

1. Navigate to `http://localhost:3000/admin/login`
2. Login with the credentials you created
3. You'll be redirected to the admin dashboard at `/admin`

## File Structure

```
regarden/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Admin layout wrapper
│   │   ├── page.tsx             # Admin dashboard
│   │   └── login/
│   │       └── page.tsx         # Login page
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts     # NextAuth handler
├── components/
│   ├── Admin/
│   │   └── AdminLayout.tsx      # Admin layout with header
│   └── Auth/
│       └── LoginForm.tsx         # Login form component
├── data/
│   ├── users.json                # User accounts (hashed passwords)
│   └── password-reset-tokens.json # Password reset tokens
├── lib/
│   ├── auth.ts                   # Authentication utilities
│   ├── auth-config.ts            # NextAuth configuration
│   ├── security.ts               # Security utilities (tokens, etc.)
│   ├── types.ts                  # TypeScript types
│   └── validation.ts             # Zod validation schemas
├── middleware.ts                  # Route protection middleware
└── scripts/
    └── create-admin.ts           # Admin user creation script
```

## Testing the Authentication

### Test Login
1. Go to `/admin/login`
2. Enter your admin credentials
3. Should redirect to `/admin` dashboard

### Test Protected Routes
1. Try accessing `/admin` without logging in
2. Should redirect to `/admin/login`
3. After login, should have access to all `/admin/*` routes

### Test Logout
1. Click "Logout" button in admin header
2. Should redirect to login page
3. Try accessing `/admin` again - should redirect to login

## Security Features

- ✅ Passwords are hashed with bcrypt (12 salt rounds)
- ✅ Sessions use JWT tokens
- ✅ Protected routes via middleware
- ✅ CSRF protection (built into NextAuth)
- ✅ Secure password storage (never plain text)

## Next Steps (Phase 2)

Phase 2 will include:
- Content management system
- Editable content structure
- Content editor UI
- API endpoints for content CRUD

## Troubleshooting

### "Cannot find module 'next-auth'"
Run: `npm install next-auth@beta`

### "Invalid credentials" error
- Check that you created an admin user
- Verify email/password are correct
- Check `data/users.json` exists and has user data

### Redirect loop on login
- Check `.env.local` has `NEXTAUTH_SECRET` set
- Restart the dev server after adding env variables

### TypeScript errors
- Make sure all dependencies are installed
- Run `npm install` to ensure all packages are up to date

## Notes

- All user data is stored in `data/users.json` (for local testing)
- Passwords are never stored in plain text
- The admin panel is mobile-responsive
- Session expires after 30 days of inactivity
