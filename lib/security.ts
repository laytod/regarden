import crypto from 'crypto'
import { PasswordResetToken } from './types'
import fs from 'fs'
import path from 'path'

const TOKENS_FILE = path.join(process.cwd(), 'data', 'password-reset-tokens.json')

// Read reset tokens from JSON file
export function getResetTokens(): PasswordResetToken[] {
  try {
    const fileContents = fs.readFileSync(TOKENS_FILE, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    return []
  }
}

// Write reset tokens to JSON file
export function saveResetTokens(tokens: PasswordResetToken[]): void {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2))
}

// Generate secure random token
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Create password reset token
export function createResetToken(userId: string, email: string): string {
  const tokens = getResetTokens()
  const token = generateResetToken()
  
  // Expires in 1 hour
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()
  
  const resetToken: PasswordResetToken = {
    token,
    userId,
    email,
    expiresAt,
    used: false,
  }
  
  tokens.push(resetToken)
  saveResetTokens(tokens)
  
  return token
}

// Verify and get reset token
export function verifyResetToken(token: string): PasswordResetToken | null {
  const tokens = getResetTokens()
  const resetToken = tokens.find(
    t => t.token === token && !t.used && new Date(t.expiresAt) > new Date()
  )
  
  return resetToken || null
}

// Mark token as used
export function markTokenAsUsed(token: string): void {
  const tokens = getResetTokens()
  const tokenIndex = tokens.findIndex(t => t.token === token)
  
  if (tokenIndex !== -1) {
    tokens[tokenIndex].used = true
    saveResetTokens(tokens)
  }
}

// Clean up expired tokens (can be called periodically)
export function cleanupExpiredTokens(): void {
  const tokens = getResetTokens()
  const validTokens = tokens.filter(
    t => !t.used && new Date(t.expiresAt) > new Date()
  )
  saveResetTokens(validTokens)
}
