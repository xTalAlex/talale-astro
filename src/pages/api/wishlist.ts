import type { APIRoute } from "astro";
import { auth } from "@lib/auth";
import { getUserWishlist, updateUserWishlist } from "@lib/database";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  let status = 500;
  let data = null;
  let error = "Failed to fetch wishlist";

  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    status = 403;
    error = "Unauthorized";
  } else {
    await getUserWishlist(session.user.id)
      .then((wishlist) => {
        status = 200;
        data = wishlist;
        error = "";
      })
      .catch((e) => {
        error = e instanceof Error ? e.message : "Failed to fetch wishlist";
      });
  }

  return new Response(JSON.stringify({ data, ...(error && { error }) }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  let status = 500;
  let error = "Failed to save wishlist";

  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    status = 403;
    error = "Unauthorized";
  } else {
    const body = await request.json().catch(() => null);
    if (!body || !Array.isArray(body.items)) {
      status = 400;
      error = "Invalid request body";
    } else {
      await updateUserWishlist(session.user.id, body)
        .then(() => {
          status = 200;
          error = "";
        })
        .catch((e) => {
          error = e instanceof Error ? e.message : "Failed to save wishlist";
        });
    }
  }

  return new Response(JSON.stringify({ ...(error && { error }) }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};
