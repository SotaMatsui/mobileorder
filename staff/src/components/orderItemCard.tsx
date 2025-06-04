'use client';
import { updateOrderStatus } from '@/libs/actions/orderActions';
import { MenuItem, Order, OrderItem, OrderStatus } from '@prisma/client';
import { useTransition } from 'react';
export function OrderItemCard(props: { order: Order & { orderItems: (OrderItem & { menuItem: MenuItem })[] } }) {
  const { order } = props;
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      updateOrderStatus(order, e.target.value as OrderStatus)
    });
  };

  return (
    <div className='flex flex-col'>
      <div className='flex justify-between bg-foreground/10 rounded-tl-md rounded-tr-md px-2 py-1.5 text-sm'>
        {order.orderDate.toLocaleString()}
        {isPending ? ' 更新中...' : ''}
        <select name="status" id="stauts" defaultValue={order.status} onChange={handleStatusChange}>
          {Object.values(OrderStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <div className='bg-foreground/5 rounded-bl-md rounded-br-md p-2'>
        {order.orderItems.map((orderItem) => (
          <div key={orderItem.id} className='flex justify-between'>
            <span>{orderItem.menuItem.name} x {orderItem.quantity}</span>
            <span>{orderItem.menuItem.price * orderItem.quantity} 円</span>
          </div>
        ))}
      </div>
    </div>
  );
};
