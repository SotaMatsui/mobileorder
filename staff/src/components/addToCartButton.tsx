'use client';

import { useCartStore } from "@/providers/cart-store-provider";
import { MenuItem } from "@prisma/client";

export function AddToCartButton({ item }: { item: MenuItem }) {
  const { addItem } = useCartStore((state) => state);

  return (
    <button
      className='bg-foreground/5 text-foreground rounded-lg px-8 py-2 mt-6 hover:bg-foreground/3 focus-visible:outline-offset-2 hover:cursor-pointer'
      onClick={() => { addItem(item) }}
    >
      カートに追加
    </button>
  )
}