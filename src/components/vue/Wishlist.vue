<template>
    <div>
        <div v-if="items.length" class="mt-12 carousel carousel-start w-full p-4 space-x-4 overflow-y-visible bg-neutral rounded-box">
            <div v-for="item in items" v-bind:key="item.name" 
                id="slide1" class="carousel-item relative first:pl-4">
                <img :src="item.imgSrc" :alt="item.name" class="cursor-pointer rounded-box"
                    @click="searchGame(item.id)"
                />
                <button class="btn glass btn-xs absolute -right-1 -top-1 z-10"
                    @click="removeWishlistItem(item)"
                >&times</button>
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

    function searchGame(slug){
        document.dispatchEvent(
            new CustomEvent("quickSearch", { detail: slug })
        );
    };
</script>

