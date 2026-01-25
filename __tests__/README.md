# Test Suite for ReGarden Admin Panel

## Overview

This test suite covers Phase 1 (Authentication Foundation), Phase 2 (Content Management System), and Phase 3 (Image Management) to ensure we don't break things as we move forward.

**Policy (see `ADMIN_PANEL_IMPLEMENTATION_PLAN.md`):** Tests must be written for each phase before that phase is marked complete. Each phase has a **Tests** section in the plan; implement those tests and keep this README updated as you add phases.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

### Unit Tests

- **`lib/auth.test.ts`** - Tests for authentication utilities
  - User CRUD operations
  - Password hashing and verification
  - User lookup functions

- **`lib/validation.test.ts`** - Tests for Zod validation schemas
  - Login validation
  - User creation validation
  - Password reset validation
  - Content update schema (partial updates, reject empty)

- **`lib/security.test.ts`** - Tests for security utilities
  - Password reset token generation
  - Token verification
  - Token expiration handling

- **`lib/content.test.ts`** - Tests for content utilities
  - getContent: read, parse, defaults on error, normalize partial
  - updateContent: merge partial, write, replace arrays

- **`lib/images.test.ts`** - Tests for image utilities (Phase 3)
  - validateImageFile: accept JPEG/PNG/GIF/WebP, reject invalid type/size
  - isAllowedImagePath: allow /images/*, reject traversal and invalid paths
  - listImages: scan dir, subdirs, filter by extension
  - saveImage: write buffer, subfolder, sanitize
  - deleteImage: unlink, path validation, not found

### API Tests

- **`api/admin/content.test.ts`** - Tests for content API
  - GET: 401 when unauthenticated, 200 + content when authenticated
  - PUT: 401 when unauthenticated, 400 on invalid body, 200 on valid update

- **`api/admin/images.test.ts`** - Tests for images API (Phase 3)
  - GET: 401 when unauthenticated, 200 + images when authenticated
  - POST: 401, 400 no file / validation fail, 200 upload success
  - DELETE: 401, 400 missing/invalid path, 404 not found, 200 success

### Component Tests

- **`components/Auth/LoginForm.test.tsx`** - Tests for login form
  - Form rendering
  - Input validation
  - Login submission
  - Error handling
  - Success redirect

- **`components/Admin/ContentSection.test.tsx`** - Tests for content section
  - Renders title and children
  - Optional description

- **`components/Admin/ContentEditor.test.tsx`** - Tests for content editor
  - Loading state
  - Form render after fetch
  - Error on fetch failure
  - Save (PUT) and success message

- **`components/Admin/ImageUploader.test.tsx`** - Tests for image upload (Phase 3)
  - Renders upload section, subfolder input, drop zone
  - Uploading state, onUploadSuccess, onUploadError

- **`components/Admin/ImageManager.test.tsx`** - Tests for image manager (Phase 3)
  - Loading, gallery after fetch, error + retry

- **`components/Admin/ImagePicker.test.tsx`** - Tests for image picker (Phase 3)
  - Renders label, input, choose button; value via input
  - Modal open/fetch, select image, close

## Test Coverage Goals

- **Phase 1**: Aim for 80%+ coverage of authentication-related code
- **Phase 3**: Aim for 80%+ coverage of image-related code (lib/images, API, components)
- Focus on critical paths:
  - User authentication
  - Password security
  - Route protection
  - Input validation

## Adding New Tests

When adding new features (and **before** marking a phase complete):

1. Create test file in `__tests__/` directory (see the plan’s **Tests** section for each phase).
2. Follow naming convention: `*.test.ts` or `*.test.tsx`
3. Group related tests using `describe` blocks
4. Use descriptive test names
5. Mock external dependencies (file system, NextAuth, etc.)
6. Update this README with the new test file and what it covers.

## Continuous Integration

These tests should be run:
- Before committing code
- In CI/CD pipeline
- Before deploying to production

## Notes

- Tests use mocked file system operations (no actual file I/O)
- NextAuth is mocked to avoid requiring actual authentication
- Router is mocked to avoid Next.js routing issues
- All tests should be fast and isolated
