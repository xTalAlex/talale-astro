<template>
  <div>
    <input type="checkbox" id="modal" class="modal-toggle" v-model="open" />
    <label class="modal" for="modal">
      <label class="modal-box relative" for="">
        <span
          class="btn btn-sm btn-circle absolute right-2 top-2"
          @click="open = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 stroke-current fill-current" viewBox="0 0 24 24"><path d="M5 5h2v2H5V5zm4 4H7V7h2v2zm2 2H9V9h2v2zm2 0h-2v2H9v2H7v2H5v2h2v-2h2v-2h2v-2h2v2h2v2h2v2h2v-2h-2v-2h-2v-2h-2v-2zm2-2v2h-2V9h2zm2-2v2h-2V7h2zm0 0V5h2v2h-2z"/></svg>
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