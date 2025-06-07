'use server';

import { Order, OrderStatus } from '@prisma/client';
import { prisma } from '@/libs/db/prisma';

export async function updateOrderStatus(order: Order, status: OrderStatus) {
  try {
    // 注文のステータスを更新
    await prisma.order.update({
      where: { id: order.id },
      data: { status },
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return "エラー: " + error;
  }
}