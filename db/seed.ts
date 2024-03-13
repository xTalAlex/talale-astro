import { db, User } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  await db.insert(User).values([
    {
      id: 1,
      netlify_id: "abcd1234",
      name: "Re dei Giochi",
      email: "admin@admin.com",
      streak_record: 99,
      cur_streak: 99,
    },
  ]);
}
