'use client';
import { useCartStore } from "@/providers/cart-store-provider";
import Link from "next/link";
import { useState } from "react";

export function CartPopup() {
  const { currentCart, totalPrice, addItem, removeItem } = useCartStore((state) => state);
  const [isHidden, setIsHidden] = useState(false);
  return (
    <div className="fixed z-20 bottom-0 w-full bg-background shadow-lg rounded-lg px-4 max-h-dvh overflow-y-auto">
      <div className="flex justify-between items-center py-2 sticky top-0 bg-background">
        <h2 className="" onClick={() => setIsHidden(!isHidden)}>ご注文 {isHidden ? '🔽' : '🔼'}</h2>
        <p className="">計￥{totalPrice.toString()}</p>
        <Link href='/checkout'>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 disabled:bg-foreground/20" disabled={currentCart.length === 0}>
            注文する
          </button>
        </Link>
      </div>
      <div className={isHidden ? 'hidden' : 'block'}>{currentCart.map((entry) => (
        <div key={entry.menuItemId}>
          <p className="text-lg">{entry.name}</p>
          <p className="text-sm text-gray-600">￥{entry.price.toString()}</p>
          <p className="text-sm text-gray-600">数量: {entry.quantity}</p>
          <button
            className="m-2 bg-foreground/10 px-4 py-2 rounded hover:bg-foreground/5"
            onClick={() => addItem(entry.menuItem)}
          >
            +
          </button>
          <button
            className="m-2 bg-foreground/10 px-4 py-2 rounded hover:bg-foreground/5"
            onClick={() => removeItem(entry.menuItem)}
          >
            -
          </button>
        </div>
      ))}</div>
    </div>
  )
}