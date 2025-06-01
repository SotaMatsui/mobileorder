import { AddToCartButton } from "@/components/addToCartButton";
import { CartPopup } from "@/components/cartPopup";
import { getMenuItems } from "@/libs/db/menuItem";

export default async function MyPage() {
  const data = await getMenuItems();
  return (
    <main className='flex min-h-screen flex-col items-center px-4'>
      <h1 className='my-6 text-center text-2xl'>Start Your Order</h1>
      <CartPopup />
      <div className="grid lg:grid-cols-2 gap-4 w-full max-w-4xl">
        {data?.map((item) => (
          <div className='flex flex-col' key={item.id}>
            <div className='bg-foreground/10 rounded-tl-md rounded-tr-md px-2 py-1.5 text-sm'>
              {item.name}
            </div>
            <pre className='bg-foreground/5 rounded-bl-md rounded-br-md p-2 text-xs'>
              {JSON.stringify(item, null, 1)}
            </pre>
            <AddToCartButton item={item} />
          </div>)
        )}
      </div>
    </main>
  );
}
