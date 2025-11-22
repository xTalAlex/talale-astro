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
    try {
      const userId = verificationResult.result.payload.sub;
      await deleteUser(userId);
      status = 200;
      deleted = true;
      error = "";
    } catch (err) {
      status = 500;
      error = err instanceof Error ? err.message : "Failed to delete user";
    }
  }

  return new Response(JSON.stringify({ deleted, ...(error && { error }) }), {
    status: status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
