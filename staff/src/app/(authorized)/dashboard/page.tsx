import { OrderItemCard } from '@/components/orderItemCard';
import TitleBar from '@/components/titlebar';
import { getOrders } from '@/libs/db/orders';
import Link from 'next/link';

export default async function DashboardPage() {
  const orders = await getOrders();
  return (
    <div className='min-h-screen'>
      <TitleBar title='ダッシュボード' />
      <main className='flex flex-col items-center'>
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
    </div>
  );
}
