'use server';

import { redirect } from 'next/navigation';
import { OrderItem as CartOrderItem } from '@/models/cart-entry';
import { Order, OrderStatus, Prisma } from '@prisma/client';
import { prisma } from '@/libs/db/prisma';

export async function order(cart: CartOrderItem[], uid: string) {
  try {
    // カートが空でないことを確認
    if (cart.length === 0) {
      return "カートが空です";
    }

    // 注文データを作成
    const orderData: Prisma.OrderCreateInput = {
      customer: { connect: { id: uid } },
      orderItems: {
        createMany: {
          data: cart.map(item => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity
          } satisfies Prisma.OrderItemCreateManyOrderInput)),
        }
      },
      totalAmount: cart.reduce((sum, item) => sum + item.quantity, 0),
    }
    await prisma.order.create({
      data: orderData,
    })

  } catch (error) {
    return "エラー: " + error;
  }
  // リダイレクト
  redirect('/order/order-complete');
}

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