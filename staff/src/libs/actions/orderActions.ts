'use server';

import { redirect } from 'next/navigation';
import { OrderItem as CartOrderItem } from '@/models/cart-entry';
import { Order, OrderStatus, Prisma } from '@prisma/client';
import { prisma } from '@/libs/db/prisma';
import { supabase } from '@/libs/db/supabase';

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

export async function upsertOrDeleteMenuItems(
  itemsToCreate: Prisma.MenuItemCreateManyInput[],
  itemsToUpdate: Prisma.MenuItemUpdateInput[],
  itemsToDelete: string[],
) {
  try {
    console.log("Updating menu items...");
    console.log("Items to create:", itemsToCreate);
    console.log("Items to update:", itemsToUpdate);
    console.log("Items to delete:", itemsToDelete);

    // メニューアイテムの更新
    await prisma.menuItem.createMany({
      data: itemsToCreate
    });
    await prisma.$transaction(itemsToUpdate.map((data) =>
      prisma.menuItem.update({ data, where: { id: data.id as string } })
    ));
    await prisma.menuItem.deleteMany({
      where: {
        id: {
          in: itemsToDelete,
        },
      },
    });

  }
  catch (error) {
    console.error("Error updating menu item:", error);
    return "エラー: " + error;
  }
}

export async function deleteMenuItem(menuItemId: string) {
  try {
    // メニューアイテムの削除
    await prisma.menuItem.delete({
      where: { id: menuItemId },
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return "エラー: " + error;
  }
}

export async function uploadImage(
  menuItemId: string,
  file: File
) {
  try {
    if (!file) throw new Error('No file selected for upload')

    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(`public/${menuItemId}`, file)

    if (error) throw error

    if (data) {
      console.log('File uploaded successfully:', data.path)
    }
  } catch (e) {
    console.error('Error uploading file:', e)
    throw e
  }
}