import { OrderItemCard } from '@/components/orderItemCard';
import { getOrders } from '@/libs/db/orders';
import Link from 'next/link';

export default async function DashboardPage() {
  const orders = await getOrders();
  return (
    <main className='flex min-h-screen flex-col items-center'>
      <h1 className='my-6 text-center text-2xl'>ダッシュボード</h1>
      <div className="grid lg:grid-cols-2 gap-4 w-full max-w-4xl">
        {orders?.map((item) => <OrderItemCard key={item.id} order={item} />)}
      </div>
      <Link
        href='/'
        className='bg-green-500 text-white rounded-lg px-8 py-2 mt-6 hover:bg-green-400 focus-visible:outline-offset-2'
      >
        ホーム
      </Link>
    </main>
  );
}
