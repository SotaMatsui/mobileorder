import { prisma } from '@/libs/db/prisma';

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;

  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;

  }
};

export const createUserByEmail = async (email: string, hashedPassword: string) => {
  try {
    const user = await prisma.user.create({
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