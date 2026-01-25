import bcrypt from 'bcryptjs'
import { User } from './types'

// Lazy-load file system modules (only in Node.js runtime, not Edge Runtime)
function getUsersFilePath(): string {
  // Only import when actually needed (in Node.js runtime)
  if (typeof window === 'undefined' && typeof process !== 'undefined') {
    const path = require('path')
    return path.join(process.cwd(), 'data', 'users.json')
  }
  throw new Error('File system access not available')
}

// Read users from JSON file
export function getUsers(): User[] {
  try {
    // Only access file system in Node.js runtime (not Edge Runtime)
    if (typeof window !== 'undefined' || typeof process === 'undefined') {
      return [] // Browser/Edge Runtime - return empty
    }
    const fs = require('fs')
    const filePath = getUsersFilePath()
    const fileContents = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    return []
  }
}

// Write users to JSON file
export function saveUsers(users: User[]): void {
  // Only access file system in Node.js runtime (not Edge Runtime)
  if (typeof window !== 'undefined' || typeof process === 'undefined') {
    throw new Error('File system access not available in browser/Edge Runtime')
  }
  const fs = require('fs')
  const filePath = getUsersFilePath()
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2))
}

// Find user by email
export function getUserByEmail(email: string): User | null {
  const users = getUsers()
  return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null
}

// Find user by ID
export function getUserById(id: string): User | null {
  const users = getUsers()
  return users.find(user => user.id === id) || null
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Create new user
export async function createUser(
  email: string,
  password: string,
  name: string,
  role: 'admin' | 'editor' = 'editor'
): Promise<User> {
  const users = getUsers()
  
  // Check if user already exists
  if (getUserByEmail(email)) {
    throw new Error('User with this email already exists')
  }

  const passwordHash = await hashPassword(password)
  const newUser: User = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    passwordHash,
    name,
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)
  
  return newUser
}

// Update user password
export async function updateUserPassword(userId: string, newPassword: string): Promise<void> {
  const users = getUsers()
  const userIndex = users.findIndex(user => user.id === userId)
  
  if (userIndex === -1) {
    throw new Error('User not found')
  }

  users[userIndex].passwordHash = await hashPassword(newPassword)
  users[userIndex].updatedAt = new Date().toISOString()
  saveUsers(users)
}
