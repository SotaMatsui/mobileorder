'use client';
import { useCartStore } from "@/providers/cart-store-provider";
import Link from "next/link";

export function CartPopup() {
  const { currentCart, totalPrice, addItem, removeItem } = useCartStore((state) => state);
  return (
    <div className="fixed bottom-0 right-0 m-4 p-4 bg-background shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-2">Cart</h2>
      <div>{currentCart.map((entry) => (
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
      <div className="mt-4">
        <p className="text-lg font-bold">計￥{totalPrice.toString()}</p>
      </div>
      <Link href='/checkout'>
        <button
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 disabled:bg-foreground/20" disabled={currentCart.length === 0}>
          注文する
        </button>
      </Link>
    </div>
  )
}