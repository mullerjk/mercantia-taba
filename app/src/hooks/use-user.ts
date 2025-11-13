import { useAuth } from '@/contexts/AuthContext'

export function useUser() {
  const { user, profile, loading } = useAuth()

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    isModerator: profile?.role === 'moderator',
    isSeller: profile?.role === 'seller' || profile?.role === 'admin',
    isBuyer: profile?.role === 'buyer' || profile?.role === 'user',
  }
}
