<template>
  <div
    class="tooltip tooltip-top"
    :data-tip="isWishlisted ? 'Rimuovi' : 'Salva'"
  >
    <button
      class="btn btn-xs w-6 font-bold uppercase"
      :class="isWishlisted ? 'btn-neutral' : 'btn-accent'"
      @click="toggleItem()"
      v-text="isWishlisted ? '-' : '+'"
    ></button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "@nanostores/vue";
import {
  wishlist,
  addWishlistItem,
  removeWishlistItem,
  wishlistContains,
} from "@lib/wishlistStore";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imgSrc: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Number,
    required: false,
    default: null,
  },
});

const $wishlist = useStore(wishlist);

const loading = ref(false);

const items = computed(() => {
  return Object.values($wishlist.value["items"]);
});

const game = computed(() => {
  return {
    id: props.id,
    name: props.name,
    imgSrc: props.imgSrc,
    releaseDate: props.releaseDate,
  };
});

const isWishlisted = ref(wishlistContains(game.value));

watch(
  items,
  () => {
    isWishlisted.value = wishlistContains(game.value);
  },
  { deep: true },
);

function toggleItem() {
  isWishlisted.value
    ? removeWishlistItem(game.value)
    : addWishlistItem(game.value);
}
</script>
