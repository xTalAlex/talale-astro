import type { APIRoute } from "astro";
import { verifyAuth0Token } from "@lib/jwt";
import { deleteUser, auth0Issuer, auth0Audience } from "@lib/auth0Management";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let status = 500;
  let deleted = false;
  let error = "Failed to delete user";

  const verificationResult = await verifyAuth0Token(
    request,
    auth0Issuer,
    auth0Audience,
  );

  if (verificationResult.error) {
    status = 403;
    error = verificationResult.error;
  } else if (!verificationResult.result?.payload?.sub) {
    status = 403;
    error = "Could not identify user";
  } else {
    const userId = verificationResult.result.payload.sub;
    deleted = await deleteUser(userId)
      .then(() => {
        status = 200;
        error = "";
        return true;
      })
      .catch((e) => {
        if (
          e?.statusCode === 400 ||
          e.message.includes("invalid") ||
          e.message.includes("not allowed")
        ) {
          status = 400;
        }
        error = e.message ?? e;
        return false;
      });
  }

  return new Response(JSON.stringify({ deleted, ...(error && { error }) }), {
    status: status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
