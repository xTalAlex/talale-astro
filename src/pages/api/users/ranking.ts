import { db, User, eq, desc } from "astro:db";
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async () => {
  const users = await db
    .select()
    .from(User)
    .orderBy(desc(User.streak_record), desc(User.cur_streak));
  return new Response(JSON.stringify(users));
};

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") != "application/json") {
    return new Response(null, {
      status: 403,
      statusText: "Missing arguments",
    });
  }

  const body = await request.json();
  const user = body.user; // validate id name email
  const victory = body.victory;

  if (!user) {
    return new Response(null, {
      status: 403,
      statusText: "Missing user id",
    });
  }

  const users = await db
    .select()
    .from(User)
    .where(eq(User.netlify_id, user.id));

  if (!users.length) {
    await db.insert(User).values({
      netlify_id: user.id,
      name: user.user_metadata.full_name,
      email: user.email,
      streak_record: victory,
      cur_streak: victory,
    });
    return new Response(null, {
      status: 201,
      statusText: "User created",
    });
  } else {
    const cur_streak = victory ? Number(users[0]["cur_streak"]) + 1 : 0;
    const streak_record =
      Number(users[0]["streak_record"]) > cur_streak
        ? users[0]["streak_record"]
        : cur_streak;
    await db
      .update(User)
      .set({
        name: user.user_metadata.full_name,
        email: user.email,
        streak_record: streak_record,
        cur_streak: cur_streak,
        updated_at: new Date(),
      })
      .where(eq(User.netlify_id, user.id));
    return new Response(null, {
      status: 204,
      statusText: "User updated",
    });
  }
};
