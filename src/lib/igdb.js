/** 
 * 
 *  Rate limit is 4 requests per second
 * 
 **/

const API_URL = import.meta.env.IGDB_ENDPOINT;
const API_CLIENT = import.meta.env.IGDB_CLIENT;
const API_SECRET = import.meta.env.IGDB_SECRET;

var AUTH = {};

async function fetchAPI( query = '', config = null ) {

    const res = await fetch( `${API_URL}/${query}`, config )
        .then( (response) => response.json() )
        .catch( (error) => {
            throw new Error(
                '!Errore WP API: ' + query + ' [ ' + error.message + ' ] \n ' + error.Docs
            );
        });
    
    return res;
}

export async function authenticate() {

    const url = new URL("https://id.twitch.tv/oauth2/token");
    url.searchParams.append('client_id', API_CLIENT);
    url.searchParams.append('client_secret', API_SECRET);
    url.searchParams.append('grant_type','client_credentials');

    const res = await fetch(url, {
        method: 'POST'
    });

    if ( res.ok ) {
        AUTH = await res.json();
        AUTH.last_auth = Date.now();
    }
    else {
        const error = await res.json();

        throw new Error(
            '!Errore WP API: authenticate [ ' + error.message + ' ] \n ' + error.Docs
        );
    }
}

export function authenticated() {
    return AUTH.last_auth != undefined && (Date.now < AUTH.expires_in + AUTH.last_auth);
}

export async function getNintentoSwitch() {

    if(!authenticated()) await authenticate();
    const data = await fetchAPI('platforms', {
        method: 'POST',
        headers: {
            'Client-ID': API_CLIENT,
            'Authorization':'Bearer ' + AUTH.access_token,
        },
        body: `
            fields *;
            where name = "Nintendo Switch";
            limit 1;
        `
    });

    return data[0];
}

export async function getConsole(name) {

    if(!authenticated()) await authenticate();
    const data = await fetchAPI('platforms', {
        method: 'POST',
        headers: {
            'Client-ID': API_CLIENT,
            'Authorization':'Bearer ' + AUTH.access_token,
        },
        body: `
            fields *;
            where name = "${name}";
            limit 1;
        `
    });

    return data[0];
}

export async function getGames( query ) {

    if(!authenticated())  await authenticate();
    const data = await fetchAPI( 'games',{
        method: 'POST',
        headers: {
            'Client-ID': API_CLIENT,
            'Authorization':'Bearer ' + AUTH.access_token,
        },
        body: query
    });

    return data;
}

//search endpoint
// character + mug shot