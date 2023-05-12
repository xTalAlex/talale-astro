import { atom, map } from 'nanostores';

export const isLogged = atom(false);

export const userInfo = map({
    name: null, // user.user_metadata.full_name
    email: null, // user.email
    isAdmin: false, // user.app_metadata.roles
    avatar: null, // user.user_metadata.avatar_url
})