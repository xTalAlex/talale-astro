<template>
  <div>
    <input id="modal" v-model="open" type="checkbox" class="modal-toggle" />
    <label class="modal" for="modal">
      <label class="modal-box relative" for="">
        <span
          class="btn btn-circle btn-sm absolute top-2 right-2 uppercase"
          @click="open = false"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 fill-current stroke-current"
            viewBox="0 0 24 24"
          >
            <path
              d="M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z"
            />
          </svg>
        </span>
        <h3 v-if="title" class="text-lg font-bold" v-text="title"></h3>
        <img v-if="image" class="w-full py-4" :src="image" />
        <p v-if="body" class="py-4" v-text="body"></p>
        <div class="modal-action">
          <button class="btn uppercase" @click="open = false">Chiudi</button>
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
    document.dispatchEvent(new CustomEvent("openModal", { detail: params }));
  };

  document.addEventListener("openModal", (e) => {
    title.value = e.detail.title;
    body.value = e.detail.body;
    image.value = e.detail.image;
    open.value = true;
  });
});
</script>
