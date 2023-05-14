<template>
    <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-9 rounded-full"  
                v-if="$userInfo.avatar"
            >
                <img :src="$userInfo.avatar" />
            </div>
            <div class="w-6 h-6"
                v-else
            >                
                <slot />
            </div>
        </label>
        <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-300 rounded-box w-52">
            <li v-if="$isLogged"><a href="/account">Account</a></li>
            <li v-if="$isLogged && $userInfo.isAdmin"><a href="/admin">Admin</a></li>
            <li data-netlify-identity-button></li>
        </ul>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from '@nanostores/vue';
import { isLogged, userInfo, loginUser, logoutUser } from "@lib/authStore";
import { useStorage } from "@lib/useStorage";

let loaded = ref(false);
const $isLogged = useStore(isLogged);
const $userInfo = useStore(userInfo);
const isTawktoIdentified = useStorage('isTawktoIdentified', false);

async function getTawktoHash(email) {
    const data = await fetch('/.netlify/functions/tawkto-hash', {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },body: JSON.stringify({
            email : email
        }),
    }).then( response => response.json());
    return data;
}

function setTawktoAttributes(){
    getTawktoHash($userInfo.value.email).then(
        data => {
            window.Tawk_API.setAttributes({
                name : $userInfo.value.name,
                email: $userInfo.value.email,
                hash: data.hash
            });
            isTawktoIdentified.value = true;
        }
    );
}

function loadIdentity() {
    if(!loaded.value){
        netlifyIdentity.on('init', async user => {
            if(user)
            {
                await user.jwt();
                loginUser(user);
                setTawktoIdentity();
            }
            else{
                isTawktoIdentified.value = false;
            }
        });
        netlifyIdentity.on('login', user => {
            if(user)
            {
                loginUser(user);
                netlifyIdentity.close();
                setTawktoIdentity();
            }
            else{
                isTawktoIdentified.value = false;
            }
        });
        netlifyIdentity.on('logout', () => {
            logoutUser();
            netlifyIdentity.close();
            isTawktoIdentified.value = false;
        });
        netlifyIdentity.init({
            locale: 'it'
        });
        loaded.value = true;
    }
}

function setTawktoIdentity(){
    if(isTawktoIdentified.value){
        return
    }
    if(window.Tawk_API && window.Tawk_API.setAttributes){
        setTawktoAttributes();
    }
    else{
        document.addEventListener("tawktoLoaded", (e) => {
            setTawktoAttributes();
        });
    }
}

onMounted(() => {
    if(window.netlifyIdentity){
        loadIdentity();
    }
    else {
        document.addEventListener("identityLoaded", (e) => {
            loadIdentity();
        });
    }
});
</script>