import { atom, map } from "nanostores";
import { getFreshUser } from "@lib/auth";

export const isLogged = atom(false);

export const userInfo = map({
  id: null,
  email: null,
  emailVerified: null,
  createdAt: null,
  updatedAt: null,
  name: null,
  avatar: null,
  isAdmin: false,
});

export function setAuthenticatedUser(user) {
  Object.entries(user).forEach(([key, value]) => {
    userInfo.setKey(key, value);
  });
  isLogged.set(true);
}

export function clearAuthenticatedUser() {
  isLogged.set(false);
  userInfo.setKey("id", null);
  userInfo.setKey("email", null);
  userInfo.setKey("emailVerified", false);
  userInfo.setKey("createdAt", null);
  userInfo.setKey("updatedAt", null);
  userInfo.setKey("name", null);
  userInfo.setKey("avatar", null);
  userInfo.setKey("isAdmin", false);
}

export async function loadUser() {
  const user = await getFreshUser().catch((error) => {
    console.error("Failed to load authenticated user", error);
    return null;
  });
  if (user) setAuthenticatedUser(user);
}
