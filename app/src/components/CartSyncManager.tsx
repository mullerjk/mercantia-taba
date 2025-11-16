'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'

/**
 * Component that automatically syncs localStorage cart with API when user logs in
 */
export function CartSyncManager() {
  const { user } = useAuth()
  const { syncWithAPI } = useCart()
  const hasSyncedRef = useRef(false)

  useEffect(() => {
    // When user logs in and we haven't synced yet, sync the cart
    if (user && !hasSyncedRef.current) {
      hasSyncedRef.current = true

      // Sync cart and dispatch event when done
      syncWithAPI(user.id).then(() => {
        // Dispatch custom event to notify cart page to reload
        window.dispatchEvent(new CustomEvent('cartSynced'))
      })
    }

    // Reset sync flag when user logs out
    if (!user) {
      hasSyncedRef.current = false
    }
  }, [user, syncWithAPI])

  return null // This component doesn't render anything
}
