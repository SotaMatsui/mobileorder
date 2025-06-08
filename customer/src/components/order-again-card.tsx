'use client';

import { useCartStore } from "@/providers/cart-store-provider";
import { MenuItem, Order } from "@prisma/client";
import { ListPlusIcon } from "lucide-react";
import Image from "next/image";

export function OrderAgainCard({ order, className }: { order: Order & { menuItem: MenuItem }, className?: string }) {
  const { addItem } = useCartStore((state) => state);

  return (
    <div
      className={`relative flex flex-col justify-end aspect-square min-h-32 min-w-32 overflow-hidden bg-foreground/10 rounded-md ${className}`}
      onClick={() => { addItem(order.menuItem) }}
    >
      {order.menuItem.imageUrl && (
        <Image
          width={500}
          height={500}
          loading='lazy'
          src={order.menuItem.imageUrl}
          alt={order.menuItem.description ? order.menuItem.description : 'image of ' + order.menuItem.name}
          className='absolute z-0 top-0 w-full h-auto object-cover'
        />
      )}
      <div className="flex flex-col justify-between h-full z-10 text-white bg-gradient-to-bl from-transparent to-black/75 p-4">
        <ListPlusIcon />
        <div>
          <span>{order.menuItem.name}</span>
          <p>￥{order.menuItem.price.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}