import { createRemoteJWKSet, jwtVerify } from "jose";

/**
 * @param {Request} request
 * @param {string} issuer
 * @param {string} audience
 * @returns {Promise<{
 *  token: string|null,
 *  result: import("jose").JWTVerifyResult|null,
 *  error: string|null
 * }>}
 */
export const verifyAuth0Token = async (request, issuer, audience) => {
  const normalizedIssuer = issuer.endsWith("/") ? issuer : issuer + "/";
  const token = extractBearerToken(request);
  let JWKS = null;
  let result = null;
  let error = null;

  if (!token) {
    error = "Missing or invalid Authorization header";
  } else {
    try {
      JWKS = createRemoteJWKSet(
        new URL(".well-known/jwks.json", normalizedIssuer),
      );
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to create JWKS";
    }

    try {
      result = await jwtVerify(token, JWKS, {
        issuer: normalizedIssuer,
        audience: audience,
      });
    } catch (e) {
      error = e instanceof Error ? e.message : "Token verification failed";
    }
  }

  return { result, error };
};

/**
 * @param {Request} request
 * @returns {string|null}
 */
const extractBearerToken = (request) => {
  const authorization = request.headers.get("Authorization") ?? "";

  const [type, token, ...parts] = authorization
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");

  const isValid = type === "Bearer" && token && parts.length === 0;

  return isValid ? token : null;
};
