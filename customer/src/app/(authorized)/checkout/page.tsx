'use client';
import { order } from "@/libs/actions/orderActions";
import { useCartStore } from "@/providers/cart-store-provider";
import { useSession } from "next-auth/react";
import { useActionState } from "react";

export default function MyPage() {
  const { data: session } = useSession();
  const { currentCart, totalPrice, addItem, removeItem } = useCartStore((state) => state);
  const orderBinded = order.bind(null, currentCart.map((entry) => entry.toOrderItem()), session?.user?.id || '');
  const [message, action, isPending] = useActionState(orderBinded, undefined);
  return (
    <main className='flex min-h-screen flex-col items-center px-4'>
      <h1 className='my-6 text-center text-2xl'>Confirm Your Order</h1>
      <div className="grid lg:grid-cols-2 gap-4 w-full max-w-4xl">
        {currentCart?.map((entry) => (
          <div className='flex flex-col' key={entry.menuItemId}>
            <div className='bg-foreground/10 rounded-tl-md rounded-tr-md px-2 py-1.5 text-sm'>
              {entry.name}
            </div>
            <pre className='bg-foreground/5 rounded-bl-md rounded-br-md p-2 text-xs'>
              {JSON.stringify(entry.menuItem, null, 1)}
            </pre>
            <div className="flex items-center">
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
              <p className="text-sm text-gray-600">￥{entry.subtotal}</p>
            </div>
          </div>)
        )}
      </div>
      <div className="mt-4">
        <p className="text-lg font-bold">合計: ￥{totalPrice.toString()}</p>
      </div>
      {message != undefined ? <p className="bg-red-700 text-white px-4 py-2 rounded">{message}</p> : null}
      <form>
        <button
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 disabled:bg-foreground/20"
          disabled={currentCart.length === 0 || isPending}
          formAction={action}>
          {isPending ? '注文しています...' : '注文を確定する'}
        </button>
      </form>
    </main>
  );
}
