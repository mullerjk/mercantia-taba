import { useAuth } from '@/contexts/AuthContext'

export function useUser() {
  const { user, loading } = useAuth()

  return {
    user,
    profile: user, // User object now contains profile data
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isModerator: user?.role === 'moderator',
    isSeller: user?.role === 'seller' || user?.role === 'admin',
    isBuyer: user?.role === 'buyer' || user?.role === 'user',
  }
}
