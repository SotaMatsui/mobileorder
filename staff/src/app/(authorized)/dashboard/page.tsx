import TitleBar from '@/components/titlebar';
import { getOrders } from '@/libs/db/orders';
import { columns, OrderColumn } from "./columns"
import { DataTable } from "./data-table"


async function getData(): Promise<OrderColumn[]> {
  const orders = await getOrders();
  const flattendOrders: OrderColumn[] = [];
  (orders ?? []).map((order) => {
    flattendOrders.push({
      status: order.status,
      orderDate: order.orderDate,
      quantity: order.quantity,
      name: order.menuItem.name,
      order: order,
      tableNumber: order.tableNumber,
    });
  })
  return flattendOrders
}
export default async function DashboardPage() {
  const data = await getData()
  return (
    <div className='min-h-screen'>
      <TitleBar title='注文ダッシュボード' />
      <main className='flex flex-col items-center'>
        <div className="container mx-auto p-10">
          <DataTable columns={columns} data={data} />
        </div>
      </main>
    </div>
  );
}
