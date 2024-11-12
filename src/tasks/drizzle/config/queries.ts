export const defaultUserQueries = `
import { eq } from 'drizzle-orm';

import db from '@/db';
import { users } from '@/db/schema';

type User = typeof users.$inferSelect;

export const getUsers = async () => {
  try {
    const result = await db.query.users.findMany();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getUserById = async (id: User['id']) => {
  try {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id)
    });
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getUserByEmail = async (email: User['email']) => {
  try {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email)
    });
    return result;
  } catch (error) {
    console.error(error);
  }
};
`.trim();
