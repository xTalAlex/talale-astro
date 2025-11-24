/**
 * @read https://auth0.github.io/node-auth0/
 */

import { ManagementClient } from "auth0";
import Config from "@config/general.json";

export const auth0Domain = import.meta.env.PUBLIC_AUTH0_DOMAIN;
export const auth0ClientId = import.meta.env.PUBLIC_AUTH0_CLIENT_ID;
export const auth0Audience = import.meta.env.AUTH0_AUDIENCE;
export const auth0Issuer = import.meta.env.AUTH0_ISSUER_BASE_URL;
export const auth0M2MClientId = import.meta.env.AUTH0_M2M_CLIENT_ID;
export const auth0M2MClientSecret = import.meta.env.AUTH0_M2M_CLIENT_SECRET;
export const auth0DBConnection = import.meta.env.AUTH0_DB_CONNECTION;
export const claimsNamespace = Config.url.trimEnd("/");

let auth0Management = null;

async function initAuth0Management() {
  auth0Management = new ManagementClient({
    domain: auth0Domain,
    clientId: auth0M2MClientId,
    clientSecret: auth0M2MClientSecret,
  });
}

export const sendVerificationEmail = async (userId, identity) => {
  return await auth0Management.jobs.verificationEmail
    .create({
      user_id: userId,
      identity,
    })
    .catch((error) => {
      throw error.body ?? error;
    });
};

export const updateUser = async (userId, data) => {
  return await auth0Management.users
    .update(userId, {
      ...data,
      connection: auth0DBConnection,
    })
    .catch((error) => {
      throw error.body ?? error;
    });
};

export const deleteUser = async (userId) => {
  return await auth0Management.users.delete(userId).catch((error) => {
    throw error.body ?? error;
  });
};

await initAuth0Management();
