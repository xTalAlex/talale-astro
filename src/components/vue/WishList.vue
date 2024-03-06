<template>
  <div>
    <div
      v-if="items.length"
      class="carousel-start carousel mt-12 w-full space-x-4 overflow-y-visible rounded-box bg-neutral p-4"
    >
      <div
        v-for="item in items"
        v-bind:key="item.name"
        :id="slideId(item.id)"
        class="carousel-item relative first:pl-4"
      >
        <img
          :src="item.imgSrc"
          :alt="item.name"
          class="cursor-pointer rounded-box"
          @click="searchGame(item.id)"
        />
        <button
          class="btn glass btn-xs absolute -right-1 -top-1 z-10 uppercase"
          @click="removeWishlistItem(item)"
        >
          &times;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "@nanostores/vue";
import { wishlist, removeWishlistItem } from "@lib/wishlistStore";

const $wishlist = useStore(wishlist);
//const $isWishlistOpen = useStore(isWishlistOpen);

const items = computed(() => {
  return Object.values($wishlist.value["items"]);
});

function slideId(gameId) {
  return "wishlisted" + gameId;
}

function searchGame(slug) {
  document.dispatchEvent(new CustomEvent("quickSearch", { detail: slug }));
}
</script>
