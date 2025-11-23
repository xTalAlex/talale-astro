<template>
  <div v-if="$isLogged" class="card bg-base-200 w-full shadow-xl sm:flex-row">
    <div class="grid w-full place-items-center p-4 py-8 sm:w-1/2 md:w-1/3">
      <div class="dropdown dropdown-top">
        <div tabindex="0">
          <div class="avatar">
            <div class="mask mask-squircle bg-base-content/10 h-24 w-24 p-px">
              <img
                :src="$userInfo.avatar"
                width="94"
                height="94"
                :alt="$userInfo.name"
                class="mask mask-squircle"
              />
            </div>
          </div>
        </div>
        <div tabindex="0" class="dropdown-content py-2">
          <div
            class="card compact rounded-box bg-neutral text-neutral-content shadow-xl md:w-72"
          >
            <div class="card-body">
              <div class="card-title text-base font-extrabold capitalize">
                ID - {{ $userInfo.id }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full text-center">
        <div class="text-lg font-extrabold">{{ $userInfo.name }}</div>
        <div
          class="text-base-content/70 my-3 text-sm"
          :class="{ 'text-warning': !$userInfo.emailVerified }"
        >
          {{ $userInfo.email }}
        </div>
      </div>
      <div
        class="my-6 flex flex-col items-center justify-center space-y-1 sm:my-0"
      >
        <div class="badge badge-ghost cursor-default">
          Iscrizione: {{ formatDate($userInfo.createdAt) }}
        </div>
        <div class="badge badge-ghost cursor-default">
          Ultima Modifica: {{ formatDate($userInfo.updatedAt) }}
        </div>
      </div>
      <div
        class="badge badge-accent badge-sm mt-2 cursor-default py-4 font-bold tracking-wide"
      >
        {{ $userInfo.isAdmin ? "ADMIN" : "UTENTE" }}
      </div>
    </div>
    <div class="card w-full sm:w-1/2 md:w-2/3">
      <div class="card-body">
        <TabsWrapper header-class="card-title">
          <TabItem title="Info">
            <UserInfo />
          </TabItem>
          <TabItem title="Modifica">
            <UserUpdate
              :default-name="$userInfo.name"
              :default-email="$userInfo.email"
              @user-updated="handleUpdate"
            />
          </TabItem>
        </TabsWrapper>
      </div>
    </div>
  </div>
  <div v-else class="grid place-items-center">
    <a class="link" @click="handleLogin">Sei disconnesso. Vai al Login.</a>
  </div>
</template>

<script setup>
import TabsWrapper from "@components/vue/common/TabsWrapper.vue";
import TabItem from "@components/vue/common/TabItem.vue";
import UserUpdate from "@components/vue/UserUpdate.vue";
import UserInfo from "@components/vue/UserInfo.vue";
import { useStore } from "@nanostores/vue";
import { isLogged, userInfo, loadUser } from "@lib/authStore";
import { formatDate } from "@lib/utils";
import { onMounted } from "vue";

const $isLogged = useStore(isLogged);
const $userInfo = useStore(userInfo);

const handleLogin = () => {
  document.dispatchEvent(new CustomEvent("requestLogin"));
};
const handleUpdate = async () => {
  await loadUser();
};

onMounted(() => {
  document.addEventListener("loggedIn", handleUpdate);
});
</script>
