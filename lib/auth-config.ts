import type { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getUserByEmail, verifyPassword } from './auth'

// Source auth base URL from .env.local.
// To support both localhost and ngrok URLs simultaneously, we ensure redirects
// use the original request URL instead of a fixed NEXTAUTH_URL.
//
// NEXTAUTH_URL should be set in .env.local (e.g., http://localhost:3000).
// APP_URL can also be defined for reference (e.g., your ngrok URL).
//
// The redirect callback below ensures that redirects use relative URLs or
// preserve the original request URL, allowing both localhost and ngrok to work.
// The middleware already uses req.url for redirects, which preserves the original URL.
//
// Default NEXTAUTH_URL to localhost if not set, but don't override if already set
// (allowing users to configure it as needed)
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = 'http://localhost:3000'
}

// Build allowlist of trusted hosts to prevent host header injection attacks
// Only allow localhost and explicitly configured APP_URL
const buildTrustedHosts = (): string[] => {
  const hosts: string[] = []
  
  // Always allow localhost (development)
  hosts.push('localhost:3000', 'localhost', '127.0.0.1:3000', '127.0.0.1')
  
  // Add APP_URL host if defined (e.g., ngrok URL)
  if (process.env.APP_URL) {
    try {
      const appUrl = new URL(process.env.APP_URL)
      // Add both with and without port
      const hostname = appUrl.hostname
      const port = appUrl.port
      hosts.push(hostname)
      if (port) {
        hosts.push(`${hostname}:${port}`)
      }
    } catch {
      // Invalid APP_URL, ignore
    }
  }
  
  // Add NEXTAUTH_URL host if it's different from localhost
  if (process.env.NEXTAUTH_URL) {
    try {
      const nextAuthUrl = new URL(process.env.NEXTAUTH_URL)
      const hostname = nextAuthUrl.hostname
      const port = nextAuthUrl.port
      // Only add if it's not already localhost
      if (!hostname.includes('localhost') && hostname !== '127.0.0.1') {
        hosts.push(hostname)
        if (port) {
          hosts.push(`${hostname}:${port}`)
        }
      }
    } catch {
      // Invalid NEXTAUTH_URL, ignore
    }
  }
  
  return [...new Set(hosts)] // Remove duplicates
}

const trustedHosts = buildTrustedHosts()

export const authOptions: NextAuthConfig = {
  // Use allowlist-based trustHost to prevent host header injection attacks.
  // Only trust requests from explicitly allowed hosts (localhost and APP_URL).
  // This function receives the host header and checks if it's in our allowlist.
  // When trustHost returns true, NextAuth will use the request URL (from headers)
  // instead of NEXTAUTH_URL for constructing baseUrl and callback URLs.
  trustHost: (host: string) => {
    // Extract hostname (and port if present) from the host header
    const hostname = host.split(':')[0]
    const fullHost = host
    
    // Check if the full host (with port) or just hostname is in our allowlist
    const isTrusted = trustedHosts.includes(fullHost) || trustedHosts.includes(hostname)
    
    // In development, also allow localhost variations for flexibility
    if (process.env.NODE_ENV !== 'production') {
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return true
      }
    }
    
    return isTrusted
  },
  // Explicitly set basePath to ensure NextAuth uses the correct path
  basePath: '/api/auth',
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined
        if (!email || !password) {
          return null
        }

        const user = getUserByEmail(email)
        if (!user) {
          return null
        }

        const isValid = await verifyPassword(password, user.passwordHash)
        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // CRITICAL: Always return relative URLs so the browser resolves them
      // relative to the current page's origin (localhost or ngrok).
      // This is the key to making both localhost and ngrok work simultaneously.
      
      // If url is already a relative path, return it as-is
      if (url.startsWith('/')) {
        return url
      }
      
      // If url is an absolute URL, extract just the path to make it relative
      // The browser will resolve this relative to the current origin
      try {
        const urlObj = new URL(url)
        const relativePath = urlObj.pathname + urlObj.search + urlObj.hash
        // Return relative path - browser resolves relative to current origin
        return relativePath || '/'
      } catch {
        // If url is not a valid URL, try to extract a relative path
        if (url.startsWith(baseUrl)) {
          const path = url.replace(baseUrl, '')
          return path.startsWith('/') ? path : `/${path}`
        }
        // If it's a relative-looking path without leading slash, add it
        if (!url.includes('://')) {
          return url.startsWith('/') ? url : `/${url}`
        }
      }
      
      // Final fallback: return root path
      return '/'
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
}
