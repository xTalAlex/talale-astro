import Config from "@config/general.json";
import { createAuth0Client } from "@auth0/auth0-spa-js";

let auth0Client = null;

async function initAuth0() {
  try {
    auth0Client = await createAuth0Client({
      domain: import.meta.env.PUBLIC_AUTH0_DOMAIN,
      clientId: import.meta.env.PUBLIC_AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    });

    // Check if user is returning from login
    if (
      window.location.search.includes("code=") &&
      window.location.search.includes("state=")
    ) {
      try {
        await auth0Client.handleRedirectCallback();
        // Clean up the URL to remove query parameters
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      } catch (err) {
        showError(err.message);
      }
    }
  } catch (err) {
    showError(err.message);
  }
}

export const login = (popup = true) => {
  if (popup) {
    return auth0Client.loginWithPopup();
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

export const getUser = async () => {
  return await auth0Client.getUser();
};

export const getAccessToken = async () => {
  return await auth0Client.getTokenSilently({
    authorizationParams: {
      audience: Config.url,
      // scope: "read:messages",
    },
  });
};

export const updateUser = async (data) => {};

export const storeAppMetadata = async (data) => {
  const user = await getUser();
};

export const storeUserMetadata = async (data) => {
  const user = await getUser();
};

await initAuth0();
