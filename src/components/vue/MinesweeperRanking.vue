<template>
  <div
    ref="toggle"
    tabindex="0"
    class="collapse collapse-arrow h-max cursor-pointer rounded-box border border-base-300 bg-base-100"
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
        <table v-else-if="players.length" class="table table-zebra w-full">
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
              <td>{{ player.streak_record }}</td>
              <td>
                <div
                  class="tooltip tooltip-left"
                  :data-tip="lastUpdateLabel(player.updated_at)"
                >
                  {{ player.cur_streak }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="my-4">
          <p>Ancora nessun giocatore. Sii il primo!</p>
        </div>
      </div>

      <div v-if="!$isLogged" class="mt-4 flex justify-start text-warning">
        <a class="link" @click="login">Per classificarti devi essere loggato</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "@nanostores/vue";
import { isLogged } from "@lib/authStore";
import { formatDate } from "@lib/utils";

let players = ref(null);
let open = ref(false);
const toggle = ref(null);

const $isLogged = useStore(isLogged);

function collapse() {
  if (!open.value) fetchRanks();
  open.value = !open.value;
}

function login() {
  window.netlifyIdentity.open();
}

function lastUpdateLabel(date) {
  return "Ultimo aggiornamento: " + formatDate(date);
}

function fetchRanks() {
  // /.netlify/functions/players-ranking
  fetch("/api/users/ranking").then((response) => {
    if (response.ok) {
      response.json().then((data) => {
        players.value = data;
        // if (data.ranking) {
        //   players.value = data?.ranking;
        // }
      });
    }
  });
}

function refreshRanking() {
  if (open.value) fetchRanks();
}

onMounted(() => {
  window.addEventListener("refreshRanking", () => {
    refreshRanking();
  });
  window.dispatchEvent(new CustomEvent("refreshRanking"));
});
</script>
