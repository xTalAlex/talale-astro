<template>
    <div>
        <div v-if="items.length" class="mt-12 carousel carousel-start w-full p-4 space-x-4 overflow-y-visible bg-neutral rounded-box">
            <div v-for="item in items" v-bind:key="item.name" 
                id="slide1" class="carousel-item relative first:pl-4">
                <img :src="item.imgSrc" :alt="item.name" class="rounded-box" />
                <button class="btn glass btn-xs absolute -right-1 -top-1"
                    @click="removeWishlistItem(item)"
                >x</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { computed } from "vue";
    import { useStore } from '@nanostores/vue';
    import { wishlist, isWishlistOpen, removeWishlistItem } from '@lib/wishlistStore';

    const $wishlist = useStore(wishlist);
    const $isWishlistOpen = useStore(isWishlistOpen);

    const items = computed(() => {
        return Object.values($wishlist.value["items"]);
    })
</script>

