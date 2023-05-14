import { atom, map } from 'nanostores';

export const isLogged = atom(false);

export const userInfo = map({
    name: null, // user.user_metadata.full_name
    email: null, // user.email
    isAdmin: false, // user.app_metadata.roles
    avatar: null, // user.user_metadata.avatar_url
})

export function loginUser( user ) {
    userInfo.setKey("name", user.user_metadata?.full_name);
    userInfo.setKey("email", user.email);
    userInfo.setKey("isAdmin", user.app_metadata?.roles?.includes('admin'));
    userInfo.setKey("avatar", user.user_metadata?.avatar_url ?? 'https://robohash.org/' + encodeURIComponent($userInfo.value.email) + '.png?bgset=bg1' );
    isLogged.set(true);
}

export function logoutUser() {
    isLogged.set(false);
    userInfo.setKey("name", null);
    userInfo.setKey("email", null);
    userInfo.setKey("isAdmin", false);
    userInfo.setKey("avatar", null);
}