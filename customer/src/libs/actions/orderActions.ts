'use server';

import { redirect } from 'next/navigation';
import { OrderItem as CartOrderItem } from '@/models/cart-entry';
import { Prisma } from '@prisma/client';
import { prisma } from '@/libs/db/prisma';

export async function order(cart: CartOrderItem[], uid: string, tableNumber: number) {
  try {
    // カートが空でないことを確認
    if (cart.length === 0) {
      return "カートが空です";
    }

    // 注文データを作成
    const orderDatas: Prisma.OrderCreateManyInput[] =
      cart.map(item => ({
        menuItemId: item.menuItemId,
        userId: uid,
        quantity: item.quantity,
        tableNumber: tableNumber,
      } satisfies Prisma.OrderCreateManyInput));

    await prisma.order.createMany({
      data: orderDatas,
    });

  } catch (error) {
    return "エラー: " + error;
  }
  // リダイレクト
  redirect('/order/order-complete');
}
