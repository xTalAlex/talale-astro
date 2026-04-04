import { authClient } from "@src/lib/auth-client";
import { atom, map } from "nanostores";

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
  const normalizedUser = {
    ...user,
    avatar: user.image ?? user.avatar ?? null,
    isAdmin: user.role === "admin",
  };
  Object.entries(normalizedUser).forEach(([key, value]) => {
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
  const session = await authClient.getSession().catch((error) => {
    console.error("Failed to load authenticated user", error);
    return null;
  });
  const user = session?.data?.user ?? null;
  if (user) {
    setAuthenticatedUser(user);
  }
}
