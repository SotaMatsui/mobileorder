'use client';
import { order } from "@/libs/actions/orderActions";
import { useCartStore } from "@/providers/cart-store-provider";
import { useSession } from "next-auth/react";
import Image from "next/image";
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
          <div className='relative flex flex-col justify-end aspect-square overflow-hidden bg-foreground/10 rounded-md' key={entry.menuItemId}>
            {entry.menuItem.imageUrl && (
              <Image
                width={500}
                height={500}
                loading='lazy'
                src={entry.menuItem.imageUrl}
                alt={entry.menuItem.description ? entry.menuItem.description : 'image of ' + entry.menuItem.name}
                className='absolute z-0 top-0 w-full h-auto object-cover'
              />
            )}
            <div className="flex flex-col justify-end h-full z-10">
              <div className="text-background bg-gradient-to-b from-transparent to-black pt-16 px-4 pb-6">
                <div className='flex items-center justify-between text-lg font-semibold py-1.5'>
                  <span>{entry.name}</span>
                  <div className="flex items-center gap-2">
                    <p>数量: {entry.quantity}</p>
                    <button
                      className="px-4 py-2 rounded border border-white hover:cursor-pointer"
                      onClick={() => addItem(entry.menuItem)}
                    >
                      +
                    </button>
                    <button
                      className="px-4 py-2 rounded border border-white hover:cursor-pointer"
                      onClick={() => removeItem(entry.menuItem)}
                    >
                      -
                    </button>
                  </div>
                </div>
                <p>￥{entry.menuItem.price} / 小計 ￥{entry.subtotal}</p>
                <p>{entry.menuItem.description}</p>
              </div>
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
