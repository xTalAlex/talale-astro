<template>
  <div
    ref="toggle"
    tabindex="0"
    class="collapse-arrow rounded-box border-base-300 bg-base-100 collapse h-max cursor-pointer border"
    :class="{ 'collapse-open': open, 'collapse-close': !open }"
  >
    <div class="collapse-title text-xl font-medium" @click="collapse">
      Mostra classifica
    </div>
    <div class="collapse-content">
      <div class="overflow-x-auto">
        <div v-if="!players" class="flex h-32 items-center justify-center">
          <progress class="progress progress-primary w-56"></progress>
        </div>
        <table v-else-if="players.length" class="table-zebra table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Nome</th>
              <th>Record Win Streak</th>
              <th>Attuale</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(player, index) in players"
              :key="index"
              :class="{ 'font-bold': index < 3 }"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ player.name }}</td>
              <td>{{ player.streakRecord }}</td>
              <td>
                <div
                  class="tooltip tooltip-left"
                  :data-tip="lastUpdateLabel(player.updatedAt)"
                >
                  {{ player.curStreak }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="my-4">
          <p>Ancora nessun giocatore. Sii il primo!</p>
        </div>
      </div>

      <div v-if="!$isLogged" class="text-warning mt-4 flex justify-start">
        <a class="link" @click="handleLogin"
          >Per classificarti devi essere loggato</a
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "@nanostores/vue";
import { isLogged } from "@lib/authStore";
import { formatDate } from "@lib/utils";
import { getRankings } from "@lib/database";

let players = ref(null);
let open = ref(false);
const toggle = ref(null);

const $isLogged = useStore(isLogged);

function collapse() {
  if (!open.value) fetchRanks();
  open.value = !open.value;
}

function handleLogin() {
  document.dispatchEvent(new CustomEvent("requestLogin"));
}

function lastUpdateLabel(date) {
  return "Ultimo aggiornamento: " + formatDate(date);
}

function fetchRanks() {
  getRankings().then((data) => {
    players.value = data;
  });
}

function refreshRanking() {
  if (open.value) fetchRanks();
}

onMounted(() => {
  document.addEventListener("refreshRanking", () => {
    refreshRanking();
  });
});
</script>
