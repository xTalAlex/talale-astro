import type { APIRoute } from "astro";
import { verifyAuth0Token } from "@lib/jwt";
import {
  sendVerificationEmail,
  updateUser,
  claimsNamespace,
  auth0Issuer,
  auth0Audience,
} from "@lib/auth0Management";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let status = 500;
  let updated = null;
  let error = "Failed to update user";

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
    const user = verificationResult.result.payload;
    const userId = user.sub;

    const updatedData = await request.json();

    // updatedData validation could be added here

    const emailChanged = updatedData.email && updatedData.email !== user.email;
    if (emailChanged) {
      updatedData.email_verified = false;
    }

    if (updatedData.username) {
      updatedData.user_metadata = {
        username_cs: updatedData.username,
      };
    }

    updated = await updateUser(userId, updatedData).catch((e) => {
      if (e instanceof Error) {
        const auth0Error = e as any;
        if (
          auth0Error.statusCode === 400 ||
          e.message.includes("invalid") ||
          e.message.includes("not allowed")
        ) {
          status = 400;
        }
        error = e.message;
      }
      return null;
    });

    if (updated) {
      status = 200;
      error = "";

      if (emailChanged) {
        const dbProfile = user[claimsNamespace + "/db_profile"] as
          | { user_id?: string; provider?: string }
          | undefined;

        if (dbProfile?.user_id && dbProfile?.provider) {
          await sendVerificationEmail(userId, {
            user_id: dbProfile.user_id,
            provider: dbProfile.provider,
          }).catch((e) => {
            error =
              e instanceof Error
                ? e.message
                : "Failed to send verification email";
          });
        }
      }
    }
  }

  return new Response(JSON.stringify({ updated, ...(error && { error }) }), {
    status: status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
