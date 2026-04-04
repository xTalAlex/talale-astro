import { atom, map } from "nanostores";
import { userInfo, isLogged } from "./authStore";

export const isWishlistOpen = atom(false);

export const wishlist = map(
  JSON.parse(localStorage.getItem("wishlist")) ?? {
    items: [],
    updatedAt: null,
  },
);

/**
 * @param {*} item Requires to have an id
 */
export function addWishlistItem(item) {
  let added = false;
  if (item.id && !wishlistContains(item)) {
    wishlist.get().items.push(item);
    wishlist.set(wishlist.get());
    wishlist.setKey("updatedAt", Date.now());
    localStorage.setItem("wishlist", JSON.stringify(wishlist.get()));
    saveWishlist();
    added = true;
  }
  return added;
}

export function removeWishlistItem(item) {
  let removed = false;
  if (wishlistContains(item)) {
    wishlist.setKey(
      "items",
      wishlist.get()["items"].filter((g) => g.id != item.id),
    );
    wishlist.setKey("updatedAt", Date.now());
    localStorage.setItem("wishlist", JSON.stringify(wishlist.get()));
    saveWishlist();
    removed = true;
  }
  return removed;
}

export function wishlistContains(item) {
  return wishlist.get()["items"].find((g) => g.id == item.id) != undefined;
}

/**
 * Load wishlist from DB, merging with localStorage
 */
export const loadWishlist = async () => {
  const user = userInfo.get();
  if (!user.id) {
    return;
  }

  fetch("/api/wishlist")
    .then((res) => res.json())
    .then(async ({ data: dbWishlist, error }) => {
      if (error) {
        console.error(error);
        return;
      }
      const localWishlist = wishlist.get();
      const dbUpdatedAt = dbWishlist?.updatedAt
        ? new Date(dbWishlist.updatedAt).getTime()
        : 0;
      const localUpdatedAt = localWishlist.updatedAt
        ? new Date(localWishlist.updatedAt).getTime()
        : 0;

      if (dbWishlist?.items?.length && dbUpdatedAt >= localUpdatedAt) {
        wishlist.set(dbWishlist);
        localStorage.setItem("wishlist", JSON.stringify(dbWishlist));
      } else {
        localStorage.setItem("wishlist", JSON.stringify(wishlist.get()));
        await saveWishlist();
      }
    })
    .catch((error) => {
      console.error(error);
      localStorage.setItem("wishlist", JSON.stringify(wishlist.get()));
    });
};

/**
 * Save wishlist to DB
 */
async function saveWishlist() {
  if (isLogged.get()) {
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wishlist.get()),
    }).catch((error) => {
      console.error(error);
    });
  }
}

isLogged.subscribe((logged) => {
  if (logged) {
    loadWishlist();
  }
});
