<template>
    <div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box" ref="toggle"
        @click="close"
    >
        <div class="collapse-title text-xl font-medium">
            Mostra classifica
        </div>
        <div class="collapse-content">
            <div class="overflow-x-auto">
                <div class="flex justify-center h-32 items-center"
                  v-if="!players"
                > 
                  <progress class="progress progress-primary w-56"></progress>
                </div>
                <table class="table w-full"
                  v-else-if="players.length"
                >
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nome</th>
                            <th>Record</th>
                            <th>Attuale</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(player,index) in players" class="bg-primary">
                            <th>{{ index + 1 }}</th>
                            <td>{{ player.name }}</td>
                            <td>{{ player.streak_record }}</td>
                            <td>{{ player.cur_streak }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="my-4" v-else>
                  <p>Ancora nessun giocatore. Sii il primo!</p>
                </div>

                <div class="mt-4 flex justify-end text-warning text-xs">
                  <div class="">Per classificarti devi essere loggato</div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

let players = ref(null);
const toggle = ref(null);

function fetchRanks() {
  fetch(
    "/.netlify/functions/player-ranking"
  ).then((response) => {
    if(response.ok){
      response.json().then((data) => {
        if (data.ranking) {
          players.value = data?.ranking;
        }
      });
    }
  });
}

onMounted(() => {
    fetchRanks();
});

</script>