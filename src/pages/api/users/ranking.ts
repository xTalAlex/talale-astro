import type { APIRoute } from "astro";
import { db, User } from "astro:db";

export const GET: APIRoute = async ({ params, request }) => {
  const users = await db.select().from(User);
  return new Response(JSON.stringify(users));
};
