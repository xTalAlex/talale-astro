import type { APIRoute } from "astro";
import CryptoJS from "crypto-js";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    if (!body || !body.email) {
      return new Response(JSON.stringify({ error: "Missing email" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const { email } = body;

    const key = import.meta.env.TAWKTO_SECRET_KEY;

    const hash = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(email, key));

    console.log(email, "-", hash);

    return new Response(JSON.stringify({ hash }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
