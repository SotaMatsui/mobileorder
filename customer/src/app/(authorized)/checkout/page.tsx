'use client';
import { AppQuickMenuButton } from "@/components/quick-menu";
import { Button } from "@/components/ui/button";
import { order } from "@/libs/actions/orderActions";
import { useCartStore } from "@/providers/cart-store-provider";
import { ArrowLeft, Loader2, Minus, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useActionState } from "react";

export default function MyPage() {
  const { data: session } = useSession();
  const { currentCart, totalPrice, addItem, removeItem } = useCartStore((state) => state);
  const orderBinded = order.bind(null, currentCart.map((entry) => entry.toOrderItem()), session?.user?.id || '');
  const [message, action, isPending] = useActionState(orderBinded, undefined);
  return (
    <main className='flex min-h-screen flex-col items-center'>
      <div className="flex justify-between w-full items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
          >
            <ArrowLeft />
          </Button>
          <h1 className='my-6 text-center text-xl'>ご注文の確認</h1>
        </div>
        <div className="flex items-center gap-2">
          <AppQuickMenuButton />
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4 w-full max-w-4xl px-4">
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
              <div className="text-white bg-gradient-to-b from-transparent to-black pt-16 px-4 pb-6">
                <div className='flex items-center justify-between py-1.5'>
                  <span className="text-lg font-semibold">{entry.name}</span>
                  <div className="flex items-center gap-2">
                    <p>数量: {entry.quantity}</p>
                    <Button
                      onClick={() => addItem(entry.menuItem)}
                      className="dark:bg-background dark:text-foreground"
                    >
                      <Plus className="size-4" />
                    </Button>
                    <Button
                      onClick={() => removeItem(entry.menuItem)}
                      className="dark:bg-background dark:text-foreground"
                    >
                      <Minus className="size-4" />
                    </Button>
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
        <Button
          type="submit"
          disabled={currentCart.length === 0 || isPending}
          formAction={action}>
          {isPending ?
            <>
              <Loader2 className="animate-spin" />
              <span>注文しています...</span>
            </>
            : '注文を確定する'
          }
        </Button>
      </form>
    </main>
  );
}
