<template>
  <div class="dropdown dropdown-end">
    <label tabindex="0" class="avatar btn btn-circle btn-ghost uppercase">
      <div v-if="$userInfo.avatar" class="h-8 w-8 rounded-full">
        <img :src="$userInfo.avatar" :alt="$userInfo.name" />
      </div>
      <div v-else class="h-6 w-6">
        <slot />
      </div>
    </label>
    <ul
      tabindex="0"
      class="menu-compact menu dropdown-content rounded-box bg-base-300 mt-3 w-52 p-2 shadow-sm"
    >
      <li v-if="$isLogged">
        <a href="/profile">Profilo</a>
      </li>
      <li v-if="$isLogged && $userInfo.isAdmin">
        <a href="/admin">Admin</a>
      </li>
      <li v-if="!$isLogged">
        <button @click="handleLogin">Login</button>
      </li>
      <li v-if="$isLogged">
        <button @click="handleLogout">Logout</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useStore } from "@nanostores/vue";
import { isLogged, userInfo } from "@lib/authStore";

const $isLogged = useStore(isLogged);
const $userInfo = useStore(userInfo);

const handleLogin = () => {
  document.dispatchEvent(new CustomEvent("requestLogin"));
};
const handleLogout = () => {
  document.dispatchEvent(new CustomEvent("requestLogout"));
};
</script>
