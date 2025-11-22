import { createAuth0Client } from "@auth0/auth0-spa-js";
import Config from "@config/general.json";

export const auth0Domain = import.meta.env.PUBLIC_AUTH0_DOMAIN;
export const auth0ClientId = import.meta.env.PUBLIC_AUTH0_CLIENT_ID;
export const claimsNamespace = Config.url.trimEnd("/");

let auth0Client = null;

async function initAuth0() {
  auth0Client = await createAuth0Client({
    domain: auth0Domain,
    clientId: auth0ClientId,
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: Config.url,
    },
  });

  // Clean url after login with redirect
  if (
    window.location.search.includes("code=") &&
    window.location.search.includes("state=")
  ) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

export const login = (popup = true) => {
  if (popup) {
    return auth0Client.loginWithPopup().catch((error) => {
      if (error.message !== "Popup closed") {
        console.error(error);
        throw error;
      }
    });
  } else {
    return auth0Client.loginWithRedirect();
  }
};

export const logout = () => {
  return auth0Client.logout({
    logoutParams: {
      returnTo: window.location.origin,
    },
  });
};

export const authCheck = async () => {
  return await auth0Client.isAuthenticated();
};

export const adminCheck = async () => {
  const user = await getUser();
  return user?.isAdmin ?? false;
};

export const getUser = async () => {
  const user = await auth0Client.getUser();
  return normalizeUser(user);
};

export const getFreshUser = async () => {
  await auth0Client.getTokenSilently({ cacheMode: "off" });
  const user = await auth0Client.getUser();
  return normalizeUser(user);
};

export const getAccessToken = async () => {
  return await auth0Client.getTokenSilently();
};

export const updateUser = async (data) => {
  return fetch("/api/auth/user-update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAccessToken()}`,
    },
    body: JSON.stringify(data),
  });
};

export const deleteUser = async () => {
  return fetch("/api/auth/user-delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${await getAccessToken()}`,
    },
  });
};

/**
 * Normalize user object for authStore usage
 */
export const normalizeUser = (auth0User) => {
  const dbProfile = auth0User?.[claimsNamespace + "/db_profile"];

  return dbProfile || auth0User
    ? {
        id: auth0User?.sub,
        email: dbProfile?.email ?? auth0User.email,
        emailVerified: dbProfile?.email_verified ?? auth0User.email_verified,
        createdAt: auth0User[claimsNamespace + "/created_at"],
        updatedAt: auth0User.updated_at,
        name: dbProfile?.username ?? auth0User.nickname,
        avatar:
          auth0User.picture ??
          "https://robohash.org/" +
            encodeURIComponent(dbProfile?.email ?? auth0User.email ?? "") +
            ".png?bgset=bg1",
        isAdmin:
          auth0User[claimsNamespace + "/roles"]?.includes("admin") ?? false,
      }
    : null;
};

await initAuth0();
