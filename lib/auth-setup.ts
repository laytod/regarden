import NextAuth from 'next-auth'
import { authOptions } from './auth-config'

// Create NextAuth instance once and export both handler and auth function
export const { handlers, auth } = NextAuth(authOptions)
