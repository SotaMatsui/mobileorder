import { AddToCartButton } from "@/components/addToCartButton";
import { CartPopup } from "@/components/cartPopup";
import { getMenuItems } from "@/libs/db/menuItem";
import Image from "next/image";

export default async function MyPage() {
  const data = await getMenuItems();
  return (
    <main className='flex min-h-screen flex-col items-center px-4'>
      <h1 className='my-6 text-center text-2xl'>Start Your Order</h1>
      <CartPopup />
      <div className="grid lg:grid-cols-2 gap-4 w-full max-w-4xl">
        {data?.map((item) => (
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
              <div className="text-background bg-gradient-to-b from-transparent to-black pt-16 px-4 pb-6">
                <div className='flex items-center justify-between text-lg font-semibold py-1.5'>
                  <span>{item.name}</span>
                  <AddToCartButton item={item} className="border border-white w-fit" />
                </div>
                <p>￥{item.price}</p>
                <p>{item.description}</p>
              </div>
            </div>
          </div>)
        )}
      </div>
    </main >
  );
}
