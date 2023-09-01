<template>
    <div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box cursor-pointer" ref="toggle"
      	:class="{ 'collapse-open' : open  , 'collapse-close' : !open }"
    >
        <div class="collapse-title text-xl font-medium"
          @click="collapse"
        >
            Mostra classifica
        </div>
        <div class="collapse-content">
            <div class="overflow-x-auto">
                <div class="flex justify-center h-32 items-center"
                  v-if="!players"
                > 
                  <progress class="progress progress-primary w-56"></progress>
                </div>
                <table class="table table-zebra w-full"
                  v-else-if="players.length"
                >
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nome</th>
                            <th>Record Win Streak</th>
                            <th>Attuale</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(player,index) in players"
                          :class="{ 'font-bold' : index < 3 }"
                        >
                            <td>{{ index + 1 }}</td>
                            <td>{{ player.name }}</td>
                            <td>{{ player.streak_record }}</td>
                            <td>
                              
                              <div class="tooltip tooltip-left" 
                                :data-tip="lastUpdateLabel(player.updated_at)"
                              >
                                {{ player.cur_streak }}
                              </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="my-4" v-else>
                  <p>Ancora nessun giocatore. Sii il primo!</p>
                </div>
            </div>
            
            <div class="mt-4 flex justify-start text-warning"
              v-if="!$isLogged"
            >
              <a class="link" @click="login">Per classificarti devi essere loggato</a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from '@nanostores/vue';
import { isLogged } from "@lib/authStore";
import { formatDate } from "../../utils";

let players = ref(null);
let open = ref(false);
const toggle = ref(null);

const $isLogged = useStore(isLogged);

function collapse(){
  if(!open.value) fetchRanks(); 
  open.value = !open.value;
}

function login(){
  netlifyIdentity.open();
}

function lastUpdateLabel(date){
  return "Ultimo aggiornamento: " + formatDate(date)
}

function fetchRanks() {
  fetch(
    "/.netlify/functions/players-ranking"
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
  document.refreshRanking = function refreshRanking() {
    document.dispatchEvent(
      new CustomEvent("refreshRanking")
    );
  };
  document.addEventListener("refreshRanking", () => {
    if(open.value) fetchRanks();
  });
});

</script>