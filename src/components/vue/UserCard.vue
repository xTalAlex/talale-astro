<template>
  <div v-if="$isLogged" class="card w-full bg-base-200 shadow-xl sm:flex-row">
    <div class="grid w-full place-items-center p-4 py-8 sm:w-1/2 md:w-1/3">
      <div class="dropdown dropdown-top">
        <div tabindex="0">
          <div
            class="avatar"
            :class="{ online: $isLogged, offline: !$isLogged }"
          >
            <div
              class="mask mask-squircle h-24 w-24 bg-base-content bg-opacity-10 p-px"
            >
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
          class="my-3 text-sm text-base-content/70"
          :class="{ 'text-warning': !$userInfo.confirmed_at }"
        >
          {{ $userInfo.email }}
        </div>
      </div>
      <div
        class="my-6 flex flex-col items-center justify-center space-y-1 sm:my-0"
      >
        <div class="badge badge-ghost cursor-default">
          Iscrizione: {{ formatDate($userInfo.created_at) }}
        </div>
        <div class="badge badge-ghost cursor-default">
          Ultima Modifica: {{ formatDate($userInfo.updated_at) }}
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
              @user-updated="loadUser"
            />
          </TabItem>
        </TabsWrapper>
      </div>
    </div>
  </div>
  <div v-else class="grid place-items-center">
    <a class="link" @click="login">Sei disconnesso. Vai al Login.</a>
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

const $isLogged = useStore(isLogged);
const $userInfo = useStore(userInfo);

function login() {
  window.netlifyIdentity.open();
}
</script>
