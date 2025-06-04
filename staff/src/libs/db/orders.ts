import { prisma } from '@/libs/db/prisma';

export const getOrders = async () => {
  try {
    const data = await prisma.order.findMany({ include: { orderItems: { include: { menuItem: true } } } });
    return data;

  } catch (error) {
    console.error('Error fetching order:', error);
    return null;

  }
};