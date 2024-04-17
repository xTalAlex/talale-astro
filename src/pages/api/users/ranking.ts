import type { APIRoute } from "astro";
import { db, User } from "astro:db";

export const prerender = false;

export const GET: APIRoute = async (ctx) => {
  //const users = await db.select().from(User);
  const users = {};
  return new Response(JSON.stringify(users));
};
