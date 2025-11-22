import { createRemoteJWKSet, jwtVerify } from "jose";

export const verifyAuth0Token = async (request, issuer, audience) => {
  const token = extractBearerToken(request);

  // JWKS (JSON Web Key Set) contains public keys for token verification
  const JWKS = createRemoteJWKSet(new URL(".well-known/jwks.json", issuer));

  const normalizedIsuer = issuer.endsWith("/") ? issuer : issuer + "/";

  const result = await jwtVerify(token, JWKS, {
    issuer: normalizedIsuer,
    audience: audience,
  });

  return { token, result };
};

const extractBearerToken = (request) => {
  const authorization = request.headers.get("Authorization") ?? "";

  const [type, token, ...parts] = authorization
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim()
    .split(" ");

  if (type !== "Bearer" || parts.length !== 0) {
    throw new Error("Missing or invalid Authorization header");
  }

  return token;
};
