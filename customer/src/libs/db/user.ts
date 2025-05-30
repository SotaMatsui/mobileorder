import { prisma } from '@/libs/db/prisma';

export const getCustomerByEmail = async (email: string) => {
  try {
    const user = await prisma.customer.findUnique({ where: { email } });
    return user;

  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;

  }
};

export const createCustomerByEmail = async (email: string, hashedPassword: string) => {
  try {
    const user = await prisma.customer.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });
    return user;

  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;

  }
};