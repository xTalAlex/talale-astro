<template>
    <ul
        class="menu glass rounded-box fixed top-10 z-30 transition ease-in-out delay-200 right-0 hover:right-1 translate-x-14 group hover:translate-y-10 hover:-translate-x-0 -rotate-90 hover:rotate-0">
        <li>
            <div :class="{ 'text-accent': isPlaying }">
                <svg class="rotate-90 delay-200 group-hover:rotate-0 stroke-current"
                    :class="isPlaying ? 'h-6 w-6 animate-pulse' : 'h-6 w-6 animate-pulse'"
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M22 2h-2v2h2v12h-2v2h2v-2h2V4h-2V2ZM2 4H0v12h2v2h2v-2H2V4Zm0 0V2h2v2H2Zm4 2H4v8h2V6Zm0 0V4h2v2H6Zm4 0h4v2h-4V6Zm0 6H8V8h2v4Zm4 0h-4v2H8v4H6v4h2v-4h2v-4h4v4h2v4h2v-4h-2v-4h-2v-2Zm0 0h2V8h-2v4Zm6-6h-2V4h-2v2h2v8h2V6Z" />
                </svg>
            </div>
        </li>
        <li>
            <div class="dropdown dropdown-hover dropdown-left p-0">
                <label class="cursor-pointer px-4 py-3 h-full w-full" tabindex="0">
                    <svg class="h-6 w-6 stroke-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M10 13h6V5h6v4h-4v10h-8v-6zm2 2v2h4v-2h-4zM2 17h6v2H2v-2zm6-4H2v2h6v-2zM2 9h12v2H2V9zm12-4H2v2h12V5z" />
                    </svg>
                </label>
                <ul tabindex="0"
                    class="-mr-1 -mt-12 dropdown-content menu text-sm font-semibold shadow-xl bg-base-200 rounded-box w-52">
                    <li v-for="station in stations">
                        <a v-on:click="changeStation(station)" :class="{ 'active': lastRadioStation.name == station.name }">
                            <img class="h-8 w-8" v-bind:src="station.imgSrc" />{{ station.name }}
                        </a>
                    </li>
                </ul>
            </div>
        </li>
        <li>
            <div class="dropdown dropdown-hover dropdown-left p-0">
                <label class="cursor-pointer px-4 py-3 h-full w-full" tabindex="0">
                    <button class="" v-on:click="toggle">
                        <!-- Play -->
                        <svg class="h-5 w-5 stroke-current" :class="{ 'hidden': isPlaying }" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24">
                            <path fill="currentColor" d="M10 20H8V4h2v2h2v3h2v2h2v2h-2v2h-2v3h-2v2z" />
                        </svg>
                        <!-- Pause -->
                        <svg class="h-5 w-5 stroke-current" :class="{ 'hidden': !isPlaying }" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24">
                            <path fill="currentColor" d="M10 4H5v16h5V4zm9 0h-5v16h5V4z" />
                        </svg>
                    </button>
                </label>
                <ul tabindex="0" class="-mr-1 -z-10 mt-1 dropdown-content menu shadow-xl bg-base-200 rounded-box w-52">
                    <li><div><input class="range range-xs" type="range" v-model="volume" min="0" max="100" v-on:change="setVolume"/></div></li>
                </ul>
            </div>
            <audio class="hidden" ref="radioPlayer" src=""></audio>
        </li>
    </ul>
</template>

<script setup>
import { stations } from '@data/radio-stations';
import { useStorage } from "@lib/useStorage";
import Hls from "hls.js";

import { ref, onMounted } from "vue";

const lastRadioStation = useStorage('lastRadioStation', stations[0]);

let hls = ref(null);
let volume = ref(null);
let isPlaying = ref(false);

const radioPlayer = ref(null)


function isHlsUrl(url){
    return url.includes('.m3u8')
}

function changeStation(station, startPlaying = true) {
    pause();
    if(isHlsUrl(station.url)){
        if(Hls.isSupported()) {
            hls.value.loadSource(station.url);
            hls.value.attachMedia(radioPlayer.value);
            // hls.value.on(Hls.Events.MANIFEST_PARSED,function() {
            //     radioPlayer.value.play();
            // });
        }
        else if (radioPlayer.value.canPlayType('application/vnd.apple.mpegurl')) {
            radioPlayer.value.src = station.url;
            // radioPlayer.value.addEventListener('canplay',function() {
            //     radioPlayer.value.play();
            // });
        }
    }
    else{
        radioPlayer.value.src = station.url;
        if(startPlaying) play();
    }
    lastRadioStation.value = station;
    setVolume();
    if (startPlaying) play();
}

function play() {
    if (radioPlayer.value.paused) {
        radioPlayer.value.play().
        then( () => {
            isPlaying.value = true;
            lastRadioStation.value.isPlaying = true;
        })
        .catch( (e) => {
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
    }
}

function toggle() {
    radioPlayer.value.paused ? play() : pause();
}

function setVolume() {
    radioPlayer.value.volume = volume.value/100;
    lastRadioStation.value.volume = volume.value/100;
}

onMounted(() => {
    if(Hls.isSupported()) hls.value = new Hls();
    volume.value = lastRadioStation.value?.volume ? lastRadioStation.value.volume * 100 : 100;
    changeStation(lastRadioStation.value, lastRadioStation.value.isPlaying);
});
</script>