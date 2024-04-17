import { db, User, eq } from "astro:db";
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const user = body.user; // validate id name email
    const victory = body.victory;

    if (!user) {
      return new Response(null, {
        status: 403,
        statusText: "Missing user id",
      });
    }
    // console.log( user.email + '(' + user.user_metadata.full_name + ' / ' + user.id + ' ) ' + ( victory ? 'WIN' : 'LOSS') );

    const users = await db.select().from(User).where(eq(User.id, user.id));

    if (users.length) {
      await db.insert(User).values({
        id: user.id,
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
      let cur_streak = victory ? Number(users[0]["cur_streak"]) + 1 : 0;
      let streak_record =
        Number(users[0]["streak_record"]) > cur_streak
          ? users[0]["streak_record"]
          : cur_streak;
      await db
        .update(User)
        .set({
          id: user.id,
          name: user.user_metadata.full_name,
          email: user.email,
          streak_record: streak_record,
          cur_streak: cur_streak,
        })
        .where(eq(User.id, user.id));
      return new Response(null, {
        status: 204,
        statusText: "User updated",
      });
    }
  }
  return new Response(null, {
    status: 403,
    statusText: "Missing arguments",
  });
};
