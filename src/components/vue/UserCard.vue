<template>
    <div class="card w-full bg-base-200 shadow-xl sm:flex-row" 
        v-if="$isLogged"
    >
        <div class="w-full sm:w-1/2 md:w-1/3 grid place-items-center p-4 py-8 ">
            <div class="dropdown dropdown-top">
                <div tabindex="0">
                    <div class="avatar" :class="{ 'online': $isLogged, 'offline': !$isLogged }">
                        <div class="mask mask-squircle bg-base-content h-24 w-24 bg-opacity-10 p-px">
                            <img :src="$userInfo.avatar" width="94" height="94" alt={{ $userInfo.name }}
                            class="mask mask-squircle"></div>
                    </div>
                </div>
                <div tabindex="0" class="dropdown-content py-2">
                    <div class="card compact bg-neutral text-neutral-content rounded-box md:w-72 shadow-xl">
                        <div class="card-body">
                            <div class="card-title font-extrabold capitalize text-base">ID - {{ $userInfo.id }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center w-full">
                <div class="text-lg font-extrabold">{{ $userInfo.name }}</div>
                <div class="text-base-content/70 my-3 text-sm" 
                    :class="{ 'text-warning' : !$userInfo.confirmed_at}"
                >{{ $userInfo.email }}</div>
            </div>
            <div class="flex flex-col items-center justify-center space-y-1 my-6 sm:my-0">
                <div class="badge badge-ghost cursor-default">
                    Iscrizione: {{ formatDate($userInfo.created_at) }}
                </div>
                <div class="badge badge-ghost cursor-default">
                    Ultima Modifica: {{ formatDate($userInfo.updated_at) }}
                </div>
            </div>
            <div class="mt-2 badge badge-accent badge-sm font-bold py-4 cursor-default tracking-wide">
                {{ $userInfo.isAdmin ? 'ADMIN' : 'UTENTE' }}
            </div>
        </div>
        <div class="w-full sm:w-1/2 md:w-2/3 card">
            <div class="card-body">
                <Tabs headerClass="card-title">
                    <Tab title="Info">
                        <UserInfo />
                    </Tab>
                    <Tab title="Modifica">
                        <UserUpdate :defaultName="$userInfo.name" :defaultEmail="$userInfo.email" @userUpdated="loadUser"/>
                    </Tab>
                </Tabs>
            </div>
        </div>
    </div>
    <div class="grid place-items-center" v-else>
        <a class="link" @click="login">Sei disconnesso. Vai al Login.</a>
    </div>
</template>

<script setup>
import Tabs from "@components/vue/common/Tabs.vue";
import Tab from "@components/vue/common/Tab.vue";
import UserUpdate from "@components/vue/UserUpdate.vue";
import UserInfo from "@components/vue/UserInfo.vue";
import { useStore } from '@nanostores/vue';
import { isLogged, userInfo, loadUser } from "@lib/authStore";
import { formatDate } from "src/utils";

const $isLogged = useStore(isLogged);
const $userInfo = useStore(userInfo);

function login() {
    netlifyIdentity.open();
}

</script>