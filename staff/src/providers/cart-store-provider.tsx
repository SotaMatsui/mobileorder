// src/providers/counter-store-provider.tsx
'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type CartStore, createCartStore } from '@/stores/cart-store'

export type CartStoreApi = ReturnType<typeof createCartStore>

export const CartStoreContext = createContext<CartStoreApi | undefined>(
  undefined,
)

export interface CounterStoreProviderProps {
  children: ReactNode
}

export const CartStoreProvider = ({
  children,
}: CounterStoreProviderProps) => {
  const storeRef = useRef<CartStoreApi | null>(null)
  if (storeRef.current === null) {
    storeRef.current = createCartStore()
  }

  return (
    <CartStoreContext.Provider value={storeRef.current} >
      {children}
    </CartStoreContext.Provider>
  )
}

export const useCartStore = <T,>(
  selector: (store: CartStore) => T,
): T => {
  const cartStoreContext = useContext(CartStoreContext)

  if (!cartStoreContext) {
    throw new Error(`useCartStore must be used within CartStoreProvider`)
  }

  return useStore(cartStoreContext, selector)
}
