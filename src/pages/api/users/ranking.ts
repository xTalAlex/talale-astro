import {
  getUsersRanking,
  getUserByNetlifyId,
  createUser,
  updateUser,
} from "@lib/firebase.js";
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const users = await getUsersRanking();
    return new Response(JSON.stringify(users));
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { user, victory } = body;

    if (!user?.id) {
      return new Response(JSON.stringify({ error: "Missing user id" }), {
        status: 400,
      });
    }

    const existingUser = await getUserByNetlifyId(user.id);

    if (!existingUser) {
      await createUser({
        netlify_id: user.id,
        name: user.user_metadata.full_name,
        email: user.email,
        streak_record: victory ? 1 : 0,
        cur_streak: victory ? 1 : 0,
      });
      return new Response(null, {
        status: 201,
        statusText: "User created",
      });
    } else {
      const cur_streak = victory ? Number(existingUser.cur_streak) + 1 : 0;
      const streak_record =
        Number(existingUser.streak_record) > cur_streak
          ? existingUser.streak_record
          : cur_streak;

      await updateUser(existingUser.id, {
        name: user.user_metadata.full_name,
        email: user.email,
        streak_record: streak_record,
        cur_streak: cur_streak,
      });

      return new Response(null, {
        status: 204,
        statusText: "User updated",
      });
    }
  } catch (error) {
    return new Response(JSON.stringify(error), {
      status: 500,
    });
  }
};
