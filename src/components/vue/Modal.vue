<template>
  <div>
    <input type="checkbox" id="modal" class="modal-toggle" v-model="open" />
    <label class="modal" for="modal">
      <label class="modal-box relative" for="">
        <span
          class="btn btn-sm btn-circle absolute right-2 top-2"
          @click="open = false"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </span>
        <h3 class="font-bold text-lg" v-if="title" v-text="title"></h3>
        <img class="w-full py-4" v-if="image" :src="image" />
        <p class="py-4" v-if="body" v-text="body"></p>
        <div class="modal-action">
          <button class="btn" @click="open = false">Chiudi</button>
        </div>
      </label>
    </label>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

let open = ref(false);
let title = ref(null);
let body = ref(null);
let image = ref(null);

onMounted(() => {
  document.openModal = function openModal(params) {
    document.dispatchEvent(
      new CustomEvent("openModal", { detail: params })
    );
  };

  document.addEventListener("openModal", (e) => {
    title.value = e.detail.name;
    body.value = e.detail.description;
    image.value = e.detail.original_image;
    open.value = true;
  });
});
</script>