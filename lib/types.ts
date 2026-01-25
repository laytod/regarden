export interface User {
  id: string
  email: string
  passwordHash: string
  name: string
  role: 'admin' | 'editor'
  createdAt: string
  updatedAt: string
}

export interface PasswordResetToken {
  token: string
  userId: string
  email: string
  expiresAt: string
  used: boolean
}
