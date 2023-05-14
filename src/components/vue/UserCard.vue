<template>
    <div class="mx-auto bg-base-100 rounded-box col-span-3 row-span-3 grid w-72 flex-shrink-0 place-items-center items-center gap-4 p-4 py-8 shadow-xl xl:mx-0 xl:w-full svelte-1n6ue57"
        v-if="$isLogged"
    >
        <div class="dropdown">
            <div tabindex="0">
                <div class="avatar" :class="{ 'online': $isLogged, 'offline': !$isLogged }">
                    <div class="mask mask-squircle bg-base-content h-24 w-24 bg-opacity-10 p-px"><img
                        :src="$userInfo.avatar" width="94" height="94" alt="Avatar Tailwind CSS Component"
                        class="mask mask-squircle"></div>
                </div>
            </div>
            <div tabindex="0" class="dropdown-content py-2">
                <div class="card compact bg-neutral-focus text-neutral-content rounded-box w-72 shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title font-extrabold capitalize">ID - {{ $userInfo.id }}</h2>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="dropdown w-full">
                <div tabindex="0">
                    <div class="text-center">
                        <div class="text-lg font-extrabold">{{ $userInfo.name }}</div>
                        <div class="text-base-content/70 my-3 text-sm">{{ $userInfo.email }}
                            <br>
                            {{  $userInfo.confirmed_at ? 'Email verificata' : 'Email non verificata' }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="dropdown w-full">
                <div tabindex="0">
                    <div class="mt-2 text-center">
                        <div class="badge badge-ghost">
                            Iscrizione  {{ formatDate($userInfo.created_at) }}
                        </div>
                        <div class="badge badge-ghost">
                            Modifica {{ formatDate($userInfo.updated_at) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="dropdown dropdown-top">
            <div tabindex="0">
                <div class="btn-group">
                    <button class="btn btn-accent btn-sm">
                        {{ $userInfo.isAdmin ? 'ADMIN' : 'USER' }}
                    </button> 
                    <button
                        aria-label="button component" class="btn btn-accent btn-square btn-sm"><svg
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            class="h-6 w-6 stroke-current">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z">
                            </path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="grid place-items-center" v-else>
        <a class="link" @click="login">Effettua il Log in per vedere il tuo profilo</a>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from '@nanostores/vue';
import { isLogged, userInfo } from "@lib/authStore";
import { formatDate } from "src/utils";

const $isLogged = useStore(isLogged);
const $userInfo = useStore(userInfo);

function login(){
  netlifyIdentity.open();
}

</script>