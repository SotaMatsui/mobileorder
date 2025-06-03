import { prisma } from '@/libs/db/prisma';

export const getStaffByEmail = async (email: string) => {
  try {
    const user = await prisma.staff.findUnique({ where: { email } });
    return user;

  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;

  }
};

export const createStaffByEmail = async (email: string, hashedPassword: string) => {
  try {
    const user = await prisma.staff.create({
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