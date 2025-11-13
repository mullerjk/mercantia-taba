'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
  requireAuth?: boolean
  fallback?: React.ReactNode
}

export function ProtectedRoute({
  children,
  redirectTo = '/auth/login',
  requireAuth = true,
  fallback
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // User needs to be authenticated but isn't
        router.push(`${redirectTo}?redirectTo=${encodeURIComponent(window.location.pathname)}`)
      } else if (!requireAuth && user) {
        // User should not be authenticated but is (e.g., login page when already logged in)
        router.push('/dashboard')
      }
    }
  }, [user, loading, requireAuth, redirectTo, router])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )
    )
  }

  // If authentication check fails, don't render children
  if (requireAuth && !user) {
    return null
  }

  // If user should not be authenticated but is, don't render children
  if (!requireAuth && user) {
    return null
  }

  return <>{children}</>
}

// Convenience components for common use cases
export function RequireAuth({ children, redirectTo, fallback }: Omit<ProtectedRouteProps, 'requireAuth'>) {
  return (
    <ProtectedRoute requireAuth={true} redirectTo={redirectTo} fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}

export function RequireNoAuth({ children, redirectTo, fallback }: Omit<ProtectedRouteProps, 'requireAuth'>) {
  return (
    <ProtectedRoute requireAuth={false} redirectTo={redirectTo} fallback={fallback}>
      {children}
    </ProtectedRoute>
  )
}
