'use client';
import { updateOrderStatus } from '@/libs/actions/orderActions';
import { Order, OrderStatus } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';
export function OrderStatusSelector(props: { order: Order }) {
  const { order } = props;
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      updateOrderStatus(order, e.target.value as OrderStatus)
    });
  };

  return (
    <div className='flex'>
      {isPending ? <Loader2 className='animate-spin p-1' /> : ''}
      <select name="status" id="stauts" defaultValue={order.status} onChange={handleStatusChange} >
        {
          Object.values(OrderStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))
        }
      </select >
    </div>
  );
};
