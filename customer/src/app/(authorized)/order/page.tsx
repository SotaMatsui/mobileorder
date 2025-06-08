import { auth } from "@/auth";
import { AddToCartButton } from "@/components/addToCartButton";
import { CartPopup } from "@/components/cartPopup";
import { OrderAgainCard } from "@/components/order-again-card";
import { AppQuickMenuButton } from "@/components/quick-menu";
import { getMenuItems } from "@/libs/db/menuItem";
import { getOrderHistory } from "@/libs/db/order-history";
import Image from "next/image";

export default async function MyPage() {
  const session = await auth();
  const allMenu = await getMenuItems();
  const orderHistory = await getOrderHistory(session!.user!.id!);
  return (
    <>
      <main className='flex min-h-screen flex-col items-center'>
        <div className='sticky top-0 z-20 w-full flex justify-between items-center mt-8 p-4 bg-background/75 backdrop-blur backdrop-saturate-200'>
          <p className="text-xl">メニュー</p>
          <div className="flex items-center gap-2">
            <AppQuickMenuButton />
          </div>
        </div>
        <section className="w-full py-4 bg-accent rounded-2xl">
          <h2 className='text-lg px-4 mb-4'>もう一度注文する</h2>
          <div className="max-w-dvw pl-4 overflow-x-scroll">
            <div className="flex gap-3 justify-start">
              {
                orderHistory != undefined && orderHistory?.length > 0 ?
                  orderHistory?.map((order) => <OrderAgainCard key={order.id} order={order} />)
                  : <p className="text-gray-500 pr-4">注文履歴がありません。</p>
              }
            </div>
          </div>
        </section>
        <section className="px-4 py-4 mb-16">
          <h2 className='text-lg mb-4'>グランドメニュー</h2>
          <div className="grid lg:grid-cols-2 gap-4 w-full max-w-4xl">
            {allMenu?.map((item) => (
              <div className='relative flex flex-col justify-end aspect-square overflow-hidden bg-foreground/10 rounded-md' key={item.id}>
                {item.imageUrl && (
                  <Image
                    width={500}
                    height={500}
                    loading='lazy'
                    src={item.imageUrl}
                    alt={item.description ? item.description : 'image of ' + item.name}
                    className='absolute z-0 top-0 w-full h-auto object-cover'
                  />
                )}
                <div className="flex flex-col justify-end h-full z-10">
                  <div className="text-white bg-gradient-to-b from-transparent to-black pt-16 px-4 pb-6">
                    <div className='flex items-center justify-between text-lg font-semibold py-1.5'>
                      <span>{item.name}</span>
                      <AddToCartButton item={item} />
                    </div>
                    <p>￥{item.price.toLocaleString()}</p>
                    <p>{item.description}</p>
                  </div>
                </div>
              </div>)
            )}
          </div>
        </section>
      </main >
      <CartPopup />
    </>
  );
}
