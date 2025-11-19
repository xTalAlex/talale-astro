import Base64 from "crypto-js/enc-base64";
import hmacSHA256 from "crypto-js/hmac-sha256";
import type { APIRoute } from "astro";

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
    const key = "7579df8f50cb2d01262d60a06f9304f187e746a8";

    const hash = Base64.stringify(hmacSHA256(email, key));

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