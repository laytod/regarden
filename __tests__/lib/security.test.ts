import {
  generateResetToken,
  createResetToken,
  verifyResetToken,
  markTokenAsUsed,
  cleanupExpiredTokens,
} from '@/lib/security'
import fs from 'fs'

jest.mock('fs')
const mockedFs = fs as jest.Mocked<typeof fs>

describe('Security Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedFs.readFileSync.mockReturnValue(JSON.stringify([]))
    mockedFs.writeFileSync.mockImplementation(() => {})
  })

  describe('generateResetToken', () => {
    it('should generate a secure random token', () => {
      const token1 = generateResetToken()
      const token2 = generateResetToken()

      expect(token1).toBeDefined()
      expect(token1.length).toBeGreaterThan(32) // 32 bytes = 64 hex characters
      expect(token1).not.toBe(token2) // Should be unique
    })
  })

  describe('createResetToken', () => {
    it('should create a reset token with expiration', () => {
      const userId = '1'
      const email = 'test@example.com'

      mockedFs.readFileSync.mockReturnValue(JSON.stringify([]))

      const token = createResetToken(userId, email)

      expect(token).toBeDefined()
      expect(mockedFs.writeFileSync).toHaveBeenCalled()

      const writeCall = mockedFs.writeFileSync.mock.calls[0]
      const tokens = JSON.parse(writeCall[1] as string)
      expect(tokens).toHaveLength(1)
      expect(tokens[0].token).toBe(token)
      expect(tokens[0].userId).toBe(userId)
      expect(tokens[0].email).toBe(email)
      expect(tokens[0].used).toBe(false)
      expect(new Date(tokens[0].expiresAt).getTime()).toBeGreaterThan(Date.now())
    })
  })

  describe('verifyResetToken', () => {
    it('should verify valid token', () => {
      const validToken = {
        token: 'valid-token',
        userId: '1',
        email: 'test@example.com',
        expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        used: false,
      }

      mockedFs.readFileSync.mockReturnValue(JSON.stringify([validToken]))

      const result = verifyResetToken('valid-token')
      expect(result).toEqual(validToken)
    })

    it('should return null for expired token', () => {
      const expiredToken = {
        token: 'expired-token',
        userId: '1',
        email: 'test@example.com',
        expiresAt: new Date(Date.now() - 1000).toISOString(), // 1 second ago
        used: false,
      }

      mockedFs.readFileSync.mockReturnValue(JSON.stringify([expiredToken]))

      const result = verifyResetToken('expired-token')
      expect(result).toBeNull()
    })

    it('should return null for used token', () => {
      const usedToken = {
        token: 'used-token',
        userId: '1',
        email: 'test@example.com',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        used: true,
      }

      mockedFs.readFileSync.mockReturnValue(JSON.stringify([usedToken]))

      const result = verifyResetToken('used-token')
      expect(result).toBeNull()
    })

    it('should return null for non-existent token', () => {
      mockedFs.readFileSync.mockReturnValue(JSON.stringify([]))

      const result = verifyResetToken('non-existent-token')
      expect(result).toBeNull()
    })
  })

  describe('markTokenAsUsed', () => {
    it('should mark token as used', () => {
      const token = {
        token: 'test-token',
        userId: '1',
        email: 'test@example.com',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        used: false,
      }

      mockedFs.readFileSync.mockReturnValue(JSON.stringify([token]))

      markTokenAsUsed('test-token')

      expect(mockedFs.writeFileSync).toHaveBeenCalled()
      const writeCall = mockedFs.writeFileSync.mock.calls[0]
      const tokens = JSON.parse(writeCall[1] as string)
      expect(tokens[0].used).toBe(true)
    })
  })

  describe('cleanupExpiredTokens', () => {
    it('should remove expired tokens', () => {
      const validToken = {
        token: 'valid-token',
        userId: '1',
        email: 'test@example.com',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        used: false,
      }

      const expiredToken = {
        token: 'expired-token',
        userId: '2',
        email: 'test2@example.com',
        expiresAt: new Date(Date.now() - 1000).toISOString(),
        used: false,
      }

      const usedToken = {
        token: 'used-token',
        userId: '3',
        email: 'test3@example.com',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        used: true,
      }

      mockedFs.readFileSync.mockReturnValue(
        JSON.stringify([validToken, expiredToken, usedToken])
      )

      cleanupExpiredTokens()

      expect(mockedFs.writeFileSync).toHaveBeenCalled()
      const writeCall = mockedFs.writeFileSync.mock.calls[0]
      const tokens = JSON.parse(writeCall[1] as string)
      expect(tokens).toHaveLength(1)
      expect(tokens[0].token).toBe('valid-token')
    })
  })
})
