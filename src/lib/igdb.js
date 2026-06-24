/**
 *  Rate limit is 4 requests per second
 **/

const API_URL = import.meta.env.IGDB_ENDPOINT ?? "https://api.igdb.com/v4";
const API_CLIENT = import.meta.env.IGDB_CLIENT;
const API_SECRET = import.meta.env.IGDB_SECRET;

const TOKEN_SAFETY_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MS = 250;

let authToken = {
  accessToken: null,
  expiresIn: 0,
  lastAuth: null,
};

let authPromise = null;
let lastRequestTime = 0;

function checkCredentials() {
  if (!API_CLIENT || !API_SECRET) {
    throw new Error(
      "Missing IGDB credentials: set IGDB_CLIENT and IGDB_SECRET environment variables",
    );
  }
}

async function throttle() {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < RATE_LIMIT_MS) {
    await new Promise((resolve) =>
      setTimeout(resolve, RATE_LIMIT_MS - elapsed),
    );
  }
  lastRequestTime = Date.now();
}

async function fetchAPI(query = "", body = "") {
  checkCredentials();

  if (!authenticated()) {
    if (!authPromise) {
      authPromise = authenticate().finally(() => {
        authPromise = null;
      });
    }
    await authPromise;
  }

  await throttle();

  const config = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": API_CLIENT,
      Authorization: "Bearer " + authToken.accessToken,
    },
    body,
  };

  const res = await fetch(`${API_URL}/${query}`, config);

  if (!res.ok) {
    const error = await res.json();
    throw new Error("IGDB API Error: " + query + " [ " + error.message + " ]");
  }

  return res.json();
}

export async function authenticate() {
  checkCredentials();

  const url = new URL("https://id.twitch.tv/oauth2/token");
  url.searchParams.append("client_id", API_CLIENT);
  url.searchParams.append("client_secret", API_SECRET);
  url.searchParams.append("grant_type", "client_credentials");

  const res = await fetch(url, {
    method: "POST",
  });

  if (res.ok) {
    const { access_token: accessToken, expires_in: expiresIn } =
      await res.json();
    authToken = {
      accessToken,
      expiresIn,
      lastAuth: Date.now(),
    };
  } else {
    const error = await res.json();

    throw new Error(
      "IGDB API Error: authenticate [ " + error.message + " ] \n " + error.Docs,
    );
  }
}

export function authenticated() {
  return (
    authToken.lastAuth != null &&
    Date.now() <
      authToken.expiresIn * 1000 + authToken.lastAuth - TOKEN_SAFETY_WINDOW_MS
  );
}

export async function getConsole(name) {
  const safeName = name.replace(/"/g, '\\"');
  const data = await fetchAPI(
    "platforms",
    `fields *; where name = "${safeName}"; limit 1;`,
  );

  return data?.[0] ?? null;
}

export async function getNintendoSwitch2() {
  return await getConsole("Nintendo Switch 2");
}

export async function getGameStatuses() {
  const data = await fetchAPI("game_statuses", "fields *;");

  return data ?? [];
}

export async function getCharacters(query) {
  const data = await fetchAPI("characters", query);

  return data ?? [];
}

export async function getCharacterMugShots(query) {
  const data = await fetchAPI("character_mug_shots", query);

  return data ?? [];
}

export async function search(query) {
  const data = await fetchAPI("search", query);

  return data ?? [];
}

export async function getGameTypes() {
  const data = await fetchAPI("game_types", "fields *;");

  return data ?? [];
}

export async function getGames(query) {
  const data = await fetchAPI("games", query);

  return data ?? [];
}
