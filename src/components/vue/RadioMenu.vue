<template>
  <ul
    class="group menu glass fixed top-10 z-30 rounded-box p-1 transition-transform delay-200 ease-in-out"
    :class="{
      'right-1 -translate-x-0 translate-y-10 rotate-0': open,
      'right-0 translate-x-16 -rotate-90': !open,
    }"
  >
    <li>
      <div
        class=""
        :class="{ 'text-accent': isPlaying }"
        v-on:click="open = !open"
      >
        <svg
          class="h-6 w-6 stroke-current transition-transform delay-200"
          :class="{ 'rotate-90': !open, 'rotate-0': open }"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M22 2h-2v2h2v12h-2v2h2v-2h2V4h-2V2ZM2 4H0v12h2v2h2v-2H2V4Zm0 0V2h2v2H2Zm4 2H4v8h2V6Zm0 0V4h2v2H6Zm4 0h4v2h-4V6Zm0 6H8V8h2v4Zm4 0h-4v2H8v4H6v4h2v-4h2v-4h4v4h2v4h2v-4h-2v-4h-2v-2Zm0 0h2V8h-2v4Zm6-6h-2V4h-2v2h2v8h2V6Z"
          />
        </svg>
      </div>
    </li>
    <li>
      <div class="dropdown dropdown-left dropdown-hover p-0">
        <label class="h-full w-full cursor-pointer px-4 py-3" tabindex="0">
          <svg
            class="h-6 w-6 stroke-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M10 13h6V5h6v4h-4v10h-8v-6zm2 2v2h4v-2h-4zM2 17h6v2H2v-2zm6-4H2v2h6v-2zM2 9h12v2H2V9zm12-4H2v2h12V5z"
            />
          </svg>
        </label>
        <ul
          tabindex="0"
          class="menu dropdown-content -mr-1 -mt-12 w-52 rounded-box bg-base-200 text-sm font-semibold shadow-xl"
        >
          <li v-for="(station, index) in stations" v-bind:key="index">
            <a
              v-on:click="changeStation(station)"
              :class="{ 'bg-base-300': lastRadioStation.name == station.name }"
            >
              <img class="h-8 w-8" v-bind:src="station.imgSrc" />{{
                station.name
              }}
            </a>
          </li>
        </ul>
      </div>
    </li>
    <li>
      <div class="dropdown dropdown-left dropdown-hover p-0">
        <label class="h-full w-full cursor-pointer px-4 py-3" tabindex="0">
          <button class="" v-on:click="toggle">
            <!-- Play -->
            <svg
              class="h-5 w-5 stroke-current"
              :class="{ hidden: isPlaying }"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M10 20H8V4h2v2h2v3h2v2h2v2h-2v2h-2v3h-2v2z"
              />
            </svg>
            <!-- Pause -->
            <svg
              class="h-5 w-5 stroke-current"
              :class="{ hidden: !isPlaying }"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M10 4H5v16h5V4zm9 0h-5v16h5V4z" />
            </svg>
          </button>
        </label>
        <ul
          tabindex="0"
          class="menu dropdown-content -z-10 -mr-1 mt-1 w-52 rounded-box bg-base-200 shadow-xl"
        >
          <li>
            <div>
              <input
                class="range range-xs"
                type="range"
                v-model="volume"
                min="0"
                max="100"
                v-on:change="setVolume"
              />
            </div>
          </li>
        </ul>
      </div>
      <audio class="hidden" ref="radioPlayer" src=""></audio>
    </li>
  </ul>
</template>

<script setup>
import { stations } from "@data/radio-stations";
import { useStorage } from "@lib/useStorage";
import Hls from "hls.js";

import { ref, computed, onMounted } from "vue";

const lastRadioStation = useStorage("lastRadioStation", stations[0]);

let open = ref(false);
let hls = ref(null);
let volume = ref(null);
let isPlaying = ref(false);

let supportsMediaSession = ref(false);

const radioPlayer = ref(null);

const stationIndex = computed(() => {
  let index = stations.map((s) => s.name).indexOf(lastRadioStation.value?.name);
  return index >= 0 ? index : 0;
});

function isHlsUrl(url) {
  return url.includes(".m3u8");
}

function changeStation(station, startPlaying = true) {
  pause();
  if (isHlsUrl(station.url)) {
    if (Hls.isSupported()) {
      hls.value.loadSource(station.url);
      hls.value.attachMedia(radioPlayer.value);
      // hls.value.on(Hls.Events.MANIFEST_PARSED,function() {
      //     radioPlayer.value.play();
      // });
    } else if (radioPlayer.value.canPlayType("application/vnd.apple.mpegurl")) {
      radioPlayer.value.src = station.url;
      // radioPlayer.value.addEventListener('canplay',function() {
      //     radioPlayer.value.play();
      // });
    }
  } else {
    radioPlayer.value.src = station.url;
    if (startPlaying) play();
  }
  lastRadioStation.value = station;

  if (supportsMediaSession.value) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: lastRadioStation.value.name,
      artist: "talale.it",
      artwork: [
        {
          src: lastRadioStation.value.imgSrc,
        },
      ],
    });
    navigator.mediaSession.playbackState = "paused";
  }

  setVolume();
  if (startPlaying) play();
}

function previousStation() {
  changeStation(
    stations[
      (stationIndex.value - (1 % stations.length) + stations.length) %
        stations.length
    ],
    isPlaying.value,
  );
}

function nextStation() {
  changeStation(
    stations[(stationIndex.value + 1) % stations.length],
    isPlaying.value,
  );
}

function play() {
  if (radioPlayer.value.paused) {
    radioPlayer.value
      .play()
      .then(() => {
        isPlaying.value = true;
        lastRadioStation.value.isPlaying = true;
        navigator.mediaSession.playbackState = "playing";
      })
      .catch(() => {
        radioPlayer.value.pause();
        isPlaying.value = false;
        lastRadioStation.value.isPlaying = false;
      });
  }
}

function pause() {
  if (!radioPlayer.value.paused) {
    radioPlayer.value.pause();
    isPlaying.value = false;
    lastRadioStation.value.isPlaying = false;
    navigator.mediaSession.playbackState = "paused";
  }
}

function stop() {
  if (!radioPlayer.value.paused) {
    radioPlayer.value.pause();
    isPlaying.value = false;
    lastRadioStation.value.isPlaying = false;
    navigator.mediaSession.playbackState = "none";
  }
}

function toggle() {
  radioPlayer.value.paused ? play() : pause();
}

function setVolume() {
  radioPlayer.value.volume = volume.value / 100;
  lastRadioStation.value.volume = volume.value / 100;
}

onMounted(() => {
  supportsMediaSession.value = "mediaSession" in navigator;
  if (Hls.isSupported()) hls.value = new Hls();
  volume.value = lastRadioStation.value?.volume
    ? lastRadioStation.value.volume * 100
    : 100;
  changeStation(
    lastRadioStation.value,
    lastRadioStation.value.isPlaying ?? false,
  );

  if (supportsMediaSession.value) {
    navigator.mediaSession.setActionHandler("play", function () {
      play();
    });
    navigator.mediaSession.setActionHandler("pause", function () {
      pause();
    });
    navigator.mediaSession.setActionHandler("stop", () => {
      stop();
    });
    navigator.mediaSession.setActionHandler("seekbackward", () => {
      previousStation();
    });
    navigator.mediaSession.setActionHandler("seekforward", () => {
      nextStation();
    });
    navigator.mediaSession.setActionHandler("previoustrack", () => {
      previousStation();
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => {
      nextStation();
    });
  }
});
</script>
