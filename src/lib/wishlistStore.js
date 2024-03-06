import { atom, map } from "nanostores";

/**
 *
 *  Items must contain and id
 *
 */

export const isWishlistOpen = atom(false);

export const wishlist = map(
  JSON.parse(localStorage.getItem("wishlist")) ?? {
    items: [],
    updated_at: Date.now(),
  },
);

export function addWishlistItem(item) {
  if (!wishlistContains(item)) {
    wishlist.value.items.push(item);
    wishlist.set(wishlist.get());
    wishlist.setKey("updated_at", Date.now());
    localStorage.setItem("wishlist", JSON.stringify(wishlist.get()));
    storeAsUserMetadata({ wishlist: wishlist.value });
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
    wishlist.setKey("updated_at", Date.now());
    localStorage.setItem("wishlist", JSON.stringify(wishlist.get()));
    storeAsUserMetadata({ wishlist: wishlist.value });
    return true;
  }
  return false;
}

export function wishlistContains(item) {
  return wishlist.get()["items"].find((g) => g.id == item.id) != undefined;
}

const storeAsUserMetadata = (data) => {
  if (window.netlifyIdentity && window.netlifyIdentity.currentUser()) {
    window.netlifyIdentity.currentUser().update({
      data: data,
    });
  }
};

const setWishlist = () => {
  if (window.netlifyIdentity.currentUser().user_metadata.wishlist) {
    wishlist.set(window.netlifyIdentity.currentUser().user_metadata.wishlist);
    localStorage.setItem(
      "wishlist",
      JSON.stringify(
        window.netlifyIdentity.currentUser().user_metadata.wishlist,
      ),
    );
  }
};

document.addEventListener("userLoaded", () => {
  setWishlist();
});
