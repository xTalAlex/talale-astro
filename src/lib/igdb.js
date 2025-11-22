/**
 *
 *  Rate limit is 4 requests per second
 *
 **/

const API_URL = import.meta.env.IGDB_ENDPOINT ?? "https://api.igdb.com/v4";
const API_CLIENT = import.meta.env.IGDB_CLIENT;
const API_SECRET = import.meta.env.IGDB_SECRET;

var authToken = {
  accessToken: null,
  expiresIn: 0,
  lastAuth: null,
};

async function fetchAPI(query = "", config = null) {
  if (!authenticated()) await authenticate();

  const res =
    API_CLIENT && API_SECRET
      ? await fetch(`${API_URL}/${query}`, config)
          .then((response) => response.json())
          .catch((error) => {
            throw new Error(
              "!Errore IGDB API: " +
                query +
                " [ " +
                error.message +
                " ] \n " +
                error.Docs,
            );
          })
      : null;

  return res;
}

export async function authenticate() {
  if (!API_CLIENT || !API_SECRET) {
    return null;
  }

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
      "!Errore IGDB API: authenticate [ " +
        error.message +
        " ] \n " +
        error.Docs,
    );
  }
}

export function authenticated() {
  return (
    authToken.lastAuth != null &&
    Date.now() < authToken.expiresIn + authToken.lastAuth
  );
}

export async function getNintendoSwitch2() {
  const data = await fetchAPI("platforms", {
    method: "POST",
    headers: {
      "Client-ID": API_CLIENT,
      Authorization: "Bearer " + authToken.accessToken,
    },
    body: `
            fields *;
            where name = "Nintendo Switch 2";
            limit 1;
        `,
  });

  return data?.[0] ?? null;
}

export async function getConsole(name) {
  const data = await fetchAPI("platforms", {
    method: "POST",
    headers: {
      "Client-ID": API_CLIENT,
      Authorization: "Bearer " + authToken.accessToken,
    },
    body: `
            fields *;
            where name = "${name}";
            limit 1;
        `,
  });

  return data?.[0] ?? null;
}

export async function getGameStatuses() {
  const data = await fetchAPI("game_statuses", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": API_CLIENT,
      Authorization: "Bearer " + authToken.accessToken,
    },
    body: "fields *;",
  });

  return data ?? [];
}

export async function getGameTypes() {
  const data = await fetchAPI("game_types", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": API_CLIENT,
      Authorization: "Bearer " + authToken.accessToken,
    },
    body: "fields *;",
  });

  return data ?? [];
}

export async function getGames(query) {
  const data = await fetchAPI("games", {
    method: "POST",
    headers: {
      "Client-ID": API_CLIENT,
      Authorization: "Bearer " + authToken.accessToken,
    },
    body: query,
  });

  return data ?? [];
}

//search endpoint
// character + mug shot
