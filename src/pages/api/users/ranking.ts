import type { APIRoute } from "astro";
import { getRankings, upsertRanking } from "@lib/database";
import { verifyAuth0Token } from "@lib/jwt";
import { auth0Issuer, auth0Audience } from "@lib/auth0Management";

export const prerender = false;

export const GET: APIRoute = async () => {
  let status = 500;
  let rankings = null;
  let error = "";

  await getRankings()
    .then((data) => {
      rankings = data;
      status = 200;
    })
    .catch((e) => {
      error = e instanceof Error ? e.message : "Failed to fetch rankings";
    });

  return new Response(JSON.stringify({ rankings, ...(error && { error }) }), {
    status: status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const validatePostRequest = (
  body: any,
):
  | { id: string; name: string; email: string; victory: boolean }
  | { failed: Record<string, string> } => {
  let failed: Record<string, string> = {};

  if (!body.id) {
    failed["id"] = "The id field is required";
  }
  if (!body.name) {
    failed["name"] = "The name field is required";
  }
  if (!body.email) {
    failed["email"] = "The email field is required";
  }
  if (typeof body.victory !== "boolean") {
    failed["victory"] = "The victory field must be a boolean";
  }

  return Object.keys(failed).length
    ? {
        failed,
      }
    : {
        id: body.id,
        name: body.name,
        email: body.email,
        victory: body.victory,
      };
};

export const POST: APIRoute = async ({ request }) => {
  let status = 500;
  let result = null;
  let error = "Failed to update ranking";

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
    const body = await request.json().catch(() => ({}));
    const validated = validatePostRequest(body);

    if ("failed" in validated) {
      status = 400;
      error = Object.values(validated.failed).join(", ");
    } else {
      const { id, name, email, victory } = validated;
      await upsertRanking(id, {
        name,
        email,
        victory,
      })
        .then((upsertResult) => {
          status = upsertResult.created ? 201 : 200;
          result = {
            message: upsertResult.created ? "User created" : "User updated",
            id: upsertResult.userId,
            curStreak: upsertResult.curStreak,
            streakRecord: upsertResult.streakRecord,
          };
          error = "";
        })
        .catch((e) => {
          error = e instanceof Error ? e.message : "Failed to update ranking";
        });
    }
  }

  return new Response(JSON.stringify({ result, ...(error && { error }) }), {
    status: status,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
