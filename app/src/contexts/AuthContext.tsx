'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  emailVerified: boolean
  role: string
  createdAt: string
  updatedAt: string | null
  lastLoginAt: string | null
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token')
    if (storedToken) {
      setToken(storedToken)
      verifyToken(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async (authToken: string) => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setToken(authToken)
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('auth_token')
        setToken(null)
        setUser(null)
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      localStorage.removeItem('auth_token')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, fullName })
      })

      const data = await response.json()

      if (response.ok) {
        const { user: newUser, token: newToken } = data
        setUser(newUser)
        setToken(newToken)
        localStorage.setItem('auth_token', newToken)
        return { error: null }
      } else {
        return { error: data.error || 'Registration failed' }
      }
    } catch (error) {
      console.error('Sign up error:', error)
      return { error: 'Network error' }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        const { user: loggedInUser, token: newToken } = data
        setUser(loggedInUser)
        setToken(newToken)
        localStorage.setItem('auth_token', newToken)
        return { error: null }
      } else {
        return { error: data.error || 'Login failed' }
      }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: 'Network error' }
    }
  }

  const signOut = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      } catch (error) {
        console.error('Logout error:', error)
      }
    }

    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')

    // Redirect to marketplace after logout
    window.location.href = '/marketplace'
  }

  const refreshUser = async () => {
    if (token) {
      await verifyToken(token)
    }
  }

  const value: AuthContextType = {
    user,
    token,
    loading,
    signUp,
    signIn,
    signOut,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
