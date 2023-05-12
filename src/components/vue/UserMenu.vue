<template>
    <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full"  
                v-if="avatar"
            >
                <img :src="avatar" />
            </div>
            <div class="w-6 h-6"
                v-else
            >                
                <slot />
            </div>
        </label>
        <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-300 rounded-box w-52">
            <li v-if="$isLogged"><a href="#">Profilo</a></li>
            <li v-if="$isLogged && $userInfo.isAdmin"><a href="/admin">Admin</a></li>
            <li data-netlify-identity-button></li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from '@nanostores/vue';
import { isLogged, userInfo } from "@lib/authStore";

const $isLogged = useStore(isLogged);
const $userInfo = useStore(userInfo);

const avatar = computed(() => {
    return $isLogged.value ? 'https://robohash.org/' + encodeURIComponent($userInfo.value.email) + '.png?bgset=bg1' : null;
})

onMounted(() => {
    netlifyIdentity.on('init', user => {
        if(user)
        {
            isLogged.set(true);
            userInfo.setKey("name", user.user_metadata?.full_name);
            userInfo.setKey("email", user.email);
            userInfo.setKey("isAdmin", user.app_metadata?.roles?.includes('admin'));
        }
    });
    netlifyIdentity.on('login', user => {
        if(user)
        {
            isLogged.set(true);
            userInfo.setKey("name", user.user_metadata?.full_name);
            userInfo.setKey("email", user.email);
            userInfo.setKey("isAdmin", user.app_metadata?.roles?.includes('admin'));
            netlifyIdentity.close();
        }
    });
    netlifyIdentity.on('logout', () => {
        isLogged.set(false);
        userInfo.setKey("name", null);
        userInfo.setKey("email", null);
        userInfo.setKey("isAdmin", false);
        netlifyIdentity.close();
    });
    netlifyIdentity.init({
        locale: 'it'
    })
});

</script>