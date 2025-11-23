import { atom, map } from "nanostores";
import {
  getUserWishlist,
  updateUserWishlist,
  getUserBySecondaryId,
  createUser,
} from "@lib/database";
import { userInfo, isLogged } from "./authStore";

export const isWishlistOpen = atom(false);

export const wishlist = map(
  JSON.parse(localStorage.getItem("wishlist")) ?? {
    items: [],
    updatedAt: null,
    userId: null, // User DB ID
  },
);

/**
 * @param {*} item Requires to have an id
 */
export function addWishlistItem(item) {
  if (item.id && !wishlistContains(item)) {
    wishlist.get().items.push(item);
    wishlist.set(wishlist.get());
    wishlist.setKey("updatedAt", Date.now());
    localStorage.setItem("wishlist", JSON.stringify(wishlist.get()));
    saveWishlist();
    return true;
  }
  return false;
}

export function removeWishlistItem(item) {
  if (wishlistContains(item)) {
    wishlist.setKey(
      "items",
      wishlist.get()["items"].filter((g) => g.id != item.id),
    );
    wishlist.setKey("updatedAt", Date.now());
    localStorage.setItem("wishlist", JSON.stringify(wishlist.get()));
    saveWishlist();
    return true;
  }
  return false;
}

export function wishlistContains(item) {
  return wishlist.get()["items"].find((g) => g.id == item.id) != undefined;
}

/**
 * Load wishlist from DB to localStorage
 */
export const loadWishlist = async (userId) => {
  let dbUserId = wishlist.get().userId;
  if (!dbUserId) {
    const dbUser = await getUserBySecondaryId(userId).catch((error) => {
      console.error(error);
      return null;
    });
    dbUserId = dbUser ? dbUser.id : null;
  }

  if (dbUserId) {
    wishlist.setKey("userId", dbUserId);

    getUserWishlist(dbUserId)
      .then(async (dbWishlist) => {
        const localWishlist = wishlist.get();
        if (
          dbWishlist &&
          (!localWishlist.items.length ||
            dbWishlist?.updatedAt > localWishlist.updatedAt)
        ) {
          dbWishlist.userId = dbUserId;
          wishlist.set(dbWishlist);
          localStorage.setItem("wishlist", JSON.stringify(dbWishlist));
        } else {
          localStorage.setItem("wishlist", JSON.stringify(wishlist.get()));
          const { userId, ...wishlistData } = wishlist.get();
          await updateUserWishlist(dbUserId, wishlistData);
        }
      })
      .catch((error) => {
        console.error(error);
        wishlist.setKey("userId", null);
        localStorage.setItem("wishlist", JSON.stringify(wishlist.get()));
      });
  }
};

/**
 * Save mapped wishlist to DB
 */
async function saveWishlist() {
  const user = userInfo.get();
  if (isLogged.get() && user.id) {
    let dbUserId = wishlist.get().userId;
    if (!dbUserId) {
      const dbUser = await getUserBySecondaryId(user.id);
      dbUserId = dbUser ? dbUser.id : null;
    }
    if (!dbUserId) {
      dbUserId = await createUser({
        secondaryId: user.id,
        name: user.name,
        email: user.email,
      });
    }
    wishlist.setKey("userId", dbUserId);
    localStorage.setItem("wishlist", JSON.stringify(wishlist.get()));
    const { userId, ...wishlistData } = wishlist.get();
    await updateUserWishlist(dbUserId, wishlistData).catch((error) => {
      console.error(error);
      wishlist.setKey("userId", null);
      localStorage.setItem("wishlist", JSON.stringify(wishlist.get()));
    });
  }
}

isLogged.subscribe((logged) => {
  if (logged) {
    const user = userInfo.get();
    if (user.id) {
      loadWishlist(user.id);
    }
  }
});
