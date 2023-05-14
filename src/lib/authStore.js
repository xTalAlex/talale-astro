import { atom, map } from 'nanostores';

export const isLogged = atom(false);

/**
 * 
 *  user
 *      id
 *      email
 *      confirmed_at
 *      created_at
 *      updated_at
 *      token
 *          access_token
 *      user_metadata
 *          full_name
 *          avatar_url
 *      app_metadata
 *          provider
 *          roles
 *      url
 */

export const userInfo = map({
    id: null,
    email: null,
    confirmed_at: null,
    created_at: null,
    updated_at: null,
    name: null,
    avatar: null,
    isAdmin: false,
})

export function loginUser( user ) {
    userInfo.setKey("id", user.id);
    userInfo.setKey("email", user.email);
    userInfo.setKey("confirmed_at", user.confirmed_at);
    userInfo.setKey("created_at", user.created_at);
    userInfo.setKey("updated_at", user.updated_at);
    userInfo.setKey("name", user.user_metadata?.full_name);
    userInfo.setKey("avatar", user.user_metadata?.avatar_url ?? 'https://robohash.org/' + encodeURIComponent(user.email) + '.png?bgset=bg1' );
    userInfo.setKey("isAdmin", user.app_metadata?.roles?.includes('admin'));    
    isLogged.set(true);
}

export function logoutUser() {
    isLogged.set(false);
    userInfo.setKey("id", null);
    userInfo.setKey("email", null);
    userInfo.setKey("confirmed_at", null);
    userInfo.setKey("created_at", null);
    userInfo.setKey("updated_at", null);
    userInfo.setKey("name", null);
    userInfo.setKey("avatar", null );
    userInfo.setKey("isAdmin", false);  
}