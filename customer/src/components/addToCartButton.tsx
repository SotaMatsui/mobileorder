'use client';

import { useCartStore } from "@/providers/cart-store-provider";
import { MenuItem } from "@prisma/client";

export function AddToCartButton({ item, className }: { item: MenuItem, className?: string }) {
  const { addItem } = useCartStore((state) => state);

  return (
    <button
      className={`rounded-lg px-8 py-2 focus-visible:outline-offset-2 hover:cursor-pointer ${className}`}
      onClick={() => { addItem(item) }}
    >
      カートに追加
    </button>
  )
}