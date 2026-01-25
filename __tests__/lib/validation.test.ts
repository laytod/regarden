import {
  loginSchema,
  createUserSchema,
  passwordResetRequestSchema,
  passwordResetSchema,
  changePasswordSchema,
} from '@/lib/validation'

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      }
      expect(() => loginSchema.parse(validData)).not.toThrow()
    })

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'notanemail',
        password: 'password123',
      }
      expect(() => loginSchema.parse(invalidData)).toThrow()
    })

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      }
      expect(() => loginSchema.parse(invalidData)).toThrow()
    })
  })

  describe('createUserSchema', () => {
    it('should validate correct user data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'admin' as const,
      }
      expect(() => createUserSchema.parse(validData)).not.toThrow()
    })

    it('should reject password shorter than 8 characters', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
        name: 'Test User',
      }
      expect(() => createUserSchema.parse(invalidData)).toThrow()
    })

    it('should default to editor role', () => {
      const data = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }
      const result = createUserSchema.parse(data)
      expect(result.role).toBe('editor')
    })
  })

  describe('passwordResetRequestSchema', () => {
    it('should validate correct email', () => {
      const validData = { email: 'test@example.com' }
      expect(() => passwordResetRequestSchema.parse(validData)).not.toThrow()
    })

    it('should reject invalid email', () => {
      const invalidData = { email: 'notanemail' }
      expect(() => passwordResetRequestSchema.parse(invalidData)).toThrow()
    })
  })

  describe('passwordResetSchema', () => {
    it('should validate correct reset data', () => {
      const validData = {
        token: 'valid-token-123',
        password: 'newpassword123',
      }
      expect(() => passwordResetSchema.parse(validData)).not.toThrow()
    })

    it('should reject empty token', () => {
      const invalidData = {
        token: '',
        password: 'newpassword123',
      }
      expect(() => passwordResetSchema.parse(invalidData)).toThrow()
    })

    it('should reject short password', () => {
      const invalidData = {
        token: 'valid-token',
        password: 'short',
      }
      expect(() => passwordResetSchema.parse(invalidData)).toThrow()
    })
  })

  describe('changePasswordSchema', () => {
    it('should validate correct password change data', () => {
      const validData = {
        currentPassword: 'oldpassword123',
        newPassword: 'newpassword123',
      }
      expect(() => changePasswordSchema.parse(validData)).not.toThrow()
    })

    it('should reject empty current password', () => {
      const invalidData = {
        currentPassword: '',
        newPassword: 'newpassword123',
      }
      expect(() => changePasswordSchema.parse(invalidData)).toThrow()
    })

    it('should reject short new password', () => {
      const invalidData = {
        currentPassword: 'oldpassword123',
        newPassword: 'short',
      }
      expect(() => changePasswordSchema.parse(invalidData)).toThrow()
    })
  })
})
