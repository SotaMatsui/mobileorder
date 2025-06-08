import { prisma } from '@/libs/db/prisma';

export const getOrderHistory = async (userId: string) => {
  try {
    const data = await prisma.order.findMany({
      include: {
        menuItem: true,
      },
      take: 10, // Limit to the last 10 orders
      where: {
        userId: userId,
      },
    });
    return data;

  } catch (error) {
    console.error('Error fetching order history:', error);
    return null;

  }
};