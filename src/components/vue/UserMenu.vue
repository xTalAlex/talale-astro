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
      <li v-if="$isLogged"><a href="/profile">Profilo</a></li>
      <li v-if="$isLogged && $userInfo.isAdmin"><a href="/admin">Admin</a></li>
      <li data-netlify-identity-button></li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "@nanostores/vue";
import { isLogged, userInfo, loginUser, logoutUser } from "@lib/authStore";
import { useStorage } from "@lib/useStorage";
import { setTawktoAttributes } from "@lib/tawkToUtils";

const $isLogged = useStore(isLogged);
const $userInfo = useStore(userInfo);

let loaded = ref(false);
const isTawktoIdentified = useStorage("isTawktoIdentified", false);

function loadIdentity() {
  if (!loaded.value) {
    window.netlifyIdentity.on("init", async (user) => {
      if (user) {
        await window.netlifyIdentity.refresh(true);
        loginUser(await user.update({}));
      } else {
        logoutUser();
        isTawktoIdentified.value = false;
        document.dispatchEvent(new Event("notLogged"));
      }
    });
    window.netlifyIdentity.on("login", (user) => {
      if (user) {
        loginUser(user);
        window.netlifyIdentity.close();
        setTawktoIdentity();
        document.dispatchEvent(new Event("userLoaded"));
      } else {
        isTawktoIdentified.value = false;
      }
    });
    window.netlifyIdentity.on("logout", () => {
      logoutUser();
      window.netlifyIdentity.close();
      isTawktoIdentified.value = false;
    });
    window.netlifyIdentity.init({
      locale: "it",
    });
    loaded.value = true;
  }
}

function setTawktoIdentity() {
  if (isTawktoIdentified.value) {
    return;
  }
  if (window.Tawk_API && window.Tawk_API.setAttributes) {
    isTawktoIdentified.value = setTawktoAttributes($userInfo.value);
  } else {
    document.addEventListener("tawktoLoaded", () => {
      isTawktoIdentified.value = setTawktoAttributes($userInfo.value);
    });
  }
}

onMounted(() => {
  if (window.netlifyIdentity) {
    loadIdentity();
  } else {
    document.addEventListener("identityLoaded", () => {
      loadIdentity();
    });
  }
});
</script>
