import { prisma } from '@/libs/db/prisma';

export const getMenuItems = async () => {
  try {
    const data = await prisma.menuItem.findMany();
    console.log('Fetched menu items:', data);
    return data;

  } catch (error) {
    console.error('Error fetching menu items:', error);
    return null;

  }
};