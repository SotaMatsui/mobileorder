import { CartEntry } from '@/models/cart-entry'
import { MenuItem } from '@prisma/client'
import { createStore } from 'zustand/vanilla'

export type CartState = {
  currentCart: CartEntry[],
  totalPrice: number,
}

export type CartActions = {
  addItem: (item: MenuItem) => void,
  removeItem: (item: MenuItem) => void
}

export type CartStore = CartState & CartActions

export const defaultInitState: CartState = {
  currentCart: [],
  totalPrice: 0,
}

const getTotalPrice = (cart: CartEntry[]) => {
  return cart.reduce((total, entry) => {
    return total + (entry.price * entry.quantity)
  }, 0)
}

export const createCartStore = (
  initState: CartState = defaultInitState,
) => {
  return createStore<CartStore>()((set) => ({
    ...initState,
    addItem: (item) => set((state) => {
      // 既にカートに入っている場合は数量を増やす
      for (const CartEntry of state.currentCart) {
        if (CartEntry.isSameMenuItemObject(item)) {
          CartEntry.increaseQuantity()
          return {
            currentCart: [...state.currentCart],
            totalPrice: getTotalPrice(state.currentCart)
          }
        }
      }
      // まだカートに入っていない場合は新規追加
      const newCartEntry = new CartEntry(item, 1)
      return ({
        currentCart: [...state.currentCart, newCartEntry],
        totalPrice: getTotalPrice([...state.currentCart, newCartEntry])
      })
    }),
    removeItem: (item) => set((state) => {
      for (const CartEntry of state.currentCart) {

        if (CartEntry.isSameMenuItemObject(item) && CartEntry.quantity > 1) {
          // 削除後もカートに残る場合は数量を減らす
          CartEntry.decreaseQuantity()
          return {
            currentCart: [...state.currentCart],
            totalPrice: getTotalPrice(state.currentCart)
          }

        } else if (CartEntry.isSameMenuItemObject(item) && CartEntry.quantity === 1) {
          // 数量が1のときはカートから削除
          const newCart = state.currentCart.filter((entry) => !entry.isSameMenuItemObject(item))
          return {
            currentCart: newCart,
            totalPrice: getTotalPrice(newCart)
          }

        }
      }

      return {}
    }),
  }))
}
