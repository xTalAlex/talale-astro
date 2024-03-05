<template>
  <div class="card">
    <div class="card-body">
      <div class="card-title flex justify-between -mt-20 pt-20" id="laravel-tips">
        Laravel Daily Tips
        <div class="tooltip tooltip-left" :data-tip="refreshing ? 'Refresh in cooldown' : 'Refresh'">
          <button aria-label="Refresh" class="btn uppercase btn-sm btn-circle btn-secondary" :disabled="refreshing"
            @click="fetchTips">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 stroke-current fill-current" viewBox="0 0 24 24">
              <path
                d="M16 2h-2v2h2v2H4v2H2v5h2V8h12v2h-2v2h2v-2h2V8h2V6h-2V4h-2V2zM6 20h2v2h2v-2H8v-2h12v-2h2v-5h-2v5H8v-2h2v-2H8v2H6v2H4v2h2v2z" />
            </svg>
          </button>
        </div>
      </div>
      <div class="stack mt-6 mx-auto w-full">
        <div class="card bg-secondary shadow-xl h-96" :class="{ 'image-full': curTip?.original_image }">
          <Transition enter-active-class="ease-out duration-500" enter-from-class="opacity-0" enter-to-class="opacity-100"
            leave-active-class="duration-0" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <figure class="w-full h-96 object-cover transition-opacity" v-if="!loading && curTip.original_image">
              <img class="w-full" :src="curTip.original_image" :alt="curTip.name" />
            </figure>
          </Transition>
          <div class="card-body flex items-center justify-center" v-if="loading">
            <progress v-if="loading" class="progress progress-primary w-56"></progress>
          </div>
          <div class="card-body" v-show="!loading">
            <Transition enter-active-class="ease-out duration-300" enter-from-class="translate-x-12 opacity-80"
              enter-to-class="translate-x-0 opacity-100" leave-active-class="ease-in duration-75"
              leave-from-class="translate-x-0 opacity-100" leave-to-class="-translate-x-full opacity-0">
              <p class="card-title transition transform" :class="{ 'text-primary-content': !curTip.original_image }"
                v-if="!loading" v-text="curTip.name"></p>
            </Transition>
            <div class="card-actions justify-end">
              <button class="btn uppercase btn-primary" @click="openModal">
                Visualizza
              </button>
            </div>
          </div>
        </div>
        <div class="card bg-secondary h-24 cursor-pointer" v-on:click="nextTip"></div>
        <div class="card bg-secondary h-24 cursor-pointer" v-on:click="nextTip"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

let totTips = 3;
let tips = ref(null);
let curTipId = ref(0);
let loading = ref(true);
let refreshing = ref(false);

function fetchTips() {
	refreshing.value = true;
	fetch(
		"https://laraveldaily.com/api/v1/tips?" +
    "count=" +
    totTips +
    "&content=html"
	).then((response) => {
		if (!response.ok) {
			setTimeout(() => (refreshing.value = false), 10000);
		} else {
			response.json().then((data) => {
				if (data.data) {
					tips.value = data?.data.map((tip) => ({
						name: tip.name,
						description: tip.description,
						original_image: tip.original_image,
						stream_image: tip.stream_image,
					}));
					loading.value = false;
				}
				setTimeout(() => (refreshing.value = false), 3000);
			});
		}
	});
}

function nextTip() {
	if (!loading.value) {
		loading.value = true;
		curTipId.value = (curTipId.value + 1) % totTips;
		setTimeout(() => {
			loading.value = false;
		}, 300);
	}
}

function openModal() {
	document.openModal(curTip.value);
}

const curTip = computed(() => {
	return tips.value ? tips.value[curTipId.value] : null;
});

onMounted(() => {
	fetchTips();
});
</script>