<template>
    <div class="card card-compact">
        <div class="card-body h-96">
            <div class="mockup-code space-y-2 h-64 min-w-fit">
                <pre data-prefix="$"><code>Modifica <select class="bg-neutral text-neutral-content"
                v-model="choice"    
            >
                <option>Nome</option>
                <option>Email</option>
                <option>Password</option>
            </select></code></pre>
                <pre data-prefix=">"
                    v-if="choice == 'Nome'"><code><input class="bg-transparent" type="text" placeholder="Nuovo Nome" :value="$userInfo.name"/></code></pre>
                <pre data-prefix=">"
                    v-if="choice == 'Email'"><code><input class="bg-transparent" type="email" placeholder="Nuova Email" :value="$userInfo.email"/></code></pre>
                <pre data-prefix=">"
                    v-if="choice == 'Password'"><code><input class="bg-transparent" type="password" placeholder="Nuova password"/></code></pre>
                <pre data-prefix=">"
                    v-if="choice == 'Password'"><code><input class="bg-transparent" type="password" placeholder="Conferma password"/></code></pre>
            </div>
            <div class="card-actions justify-end">
                <button class="btn btn-secondary">Salva</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from '@nanostores/vue';
import { isLogged, userInfo } from "@lib/authStore";

const $userInfo = useStore(userInfo);

const choice = ref("Nome");
</script>