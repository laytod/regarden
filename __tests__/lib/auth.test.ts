/**
 * @jest-environment node
 */
import {
  getUsers,
  getUserByEmail,
  getUserById,
  createUser,
  hashPassword,
  verifyPassword,
  updateUserPassword,
} from '@/lib/auth'
import { User } from '@/lib/types'

// Mock fs and path modules at the module level
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}))

jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
}))

const fs = require('fs')
const mockedFs = fs as jest.Mocked<typeof fs>

describe('Auth Utilities', () => {
  const testUsers: User[] = [
    {
      id: '1',
      email: 'test@example.com',
      passwordHash: '$2b$12$testhash',
      name: 'Test User',
      role: 'admin',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock readFileSync to return test users
    mockedFs.readFileSync.mockReturnValue(JSON.stringify(testUsers))
    mockedFs.writeFileSync.mockImplementation(() => {})
  })

  describe('getUsers', () => {
    it('should read users from file', () => {
      const users = getUsers()
      expect(users).toEqual(testUsers)
      expect(mockedFs.readFileSync).toHaveBeenCalled()
    })

    it('should return empty array if file does not exist', () => {
      mockedFs.readFileSync.mockImplementation(() => {
        throw new Error('File not found')
      })
      const users = getUsers()
      expect(users).toEqual([])
    })

    it('should return empty array if file is invalid JSON', () => {
      mockedFs.readFileSync.mockReturnValue('invalid json')
      const users = getUsers()
      expect(users).toEqual([])
    })
  })

  describe('getUserByEmail', () => {
    it('should find user by email (case insensitive)', () => {
      const user = getUserByEmail('test@example.com')
      expect(user).toEqual(testUsers[0])
    })

    it('should find user by email with different case', () => {
      const user = getUserByEmail('TEST@EXAMPLE.COM')
      expect(user).toEqual(testUsers[0])
    })

    it('should return null if user not found', () => {
      const user = getUserByEmail('notfound@example.com')
      expect(user).toBeNull()
    })
  })

  describe('getUserById', () => {
    it('should find user by ID', () => {
      const user = getUserById('1')
      expect(user).toEqual(testUsers[0])
    })

    it('should return null if user not found', () => {
      const user = getUserById('999')
      expect(user).toBeNull()
    })
  })

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testpassword123'
      const hash = await hashPassword(password)
      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash.startsWith('$2b$12$')).toBe(true)
    })

    it('should produce different hashes for same password', async () => {
      const password = 'testpassword123'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)
      // Hashes should be different due to salt
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'testpassword123'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword(password, hash)
      expect(isValid).toBe(true)
    })

    it('should reject incorrect password', async () => {
      const password = 'testpassword123'
      const wrongPassword = 'wrongpassword'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword(wrongPassword, hash)
      expect(isValid).toBe(false)
    })
  })

  describe('createUser', () => {
    it('should create a new user', async () => {
      const email = 'newuser@example.com'
      const password = 'password123'
      const name = 'New User'

      mockedFs.readFileSync.mockReturnValue(JSON.stringify([]))

      const user = await createUser(email, password, name, 'admin')

      expect(user.email).toBe(email.toLowerCase())
      expect(user.name).toBe(name)
      expect(user.role).toBe('admin')
      expect(user.passwordHash).toBeDefined()
      expect(user.passwordHash).not.toBe(password)
      expect(user.id).toBeDefined()
      expect(user.createdAt).toBeDefined()
      expect(user.updatedAt).toBeDefined()
      expect(mockedFs.writeFileSync).toHaveBeenCalled()
    })

    it('should throw error if user already exists', async () => {
      const email = 'test@example.com'
      mockedFs.readFileSync.mockReturnValue(JSON.stringify(testUsers))

      await expect(
        createUser(email, 'password123', 'Test', 'admin')
      ).rejects.toThrow('User with this email already exists')
    })

    it('should default to editor role if not specified', async () => {
      mockedFs.readFileSync.mockReturnValue(JSON.stringify([]))
      const user = await createUser('user@example.com', 'pass', 'User')
      expect(user.role).toBe('editor')
    })
  })

  describe('updateUserPassword', () => {
    it('should update user password', async () => {
      const userId = '1'
      const newPassword = 'newpassword123'

      mockedFs.readFileSync.mockReturnValue(JSON.stringify(testUsers))

      await updateUserPassword(userId, newPassword)

      expect(mockedFs.writeFileSync).toHaveBeenCalled()
      const writeCall = mockedFs.writeFileSync.mock.calls[0]
      const updatedUsers = JSON.parse(writeCall[1] as string)
      const updatedUser = updatedUsers.find((u: User) => u.id === userId)
      expect(updatedUser.passwordHash).toBeDefined()
      expect(updatedUser.passwordHash).not.toBe(testUsers[0].passwordHash)
      expect(updatedUser.updatedAt).not.toBe(testUsers[0].updatedAt)
    })

    it('should throw error if user not found', async () => {
      mockedFs.readFileSync.mockReturnValue(JSON.stringify(testUsers))

      await expect(
        updateUserPassword('999', 'newpassword')
      ).rejects.toThrow('User not found')
    })
  })
})
