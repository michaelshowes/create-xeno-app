export const defaultSchema = `
  export { default as users } from './users';
`.trim();

export const defaultUserSchema = `
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

const users = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 320 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: varchar('image', { length: 2048 })
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  emailVerified: true
});
export const selectUserSchema = createSelectSchema(users);

export default users;
`.trim();
