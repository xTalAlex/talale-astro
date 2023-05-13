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
import { isLogged, userInfo, loginUser, logoutUser, isTawktoIdentified } from "@lib/authStore";

let loaded = ref(false);
const $isLogged = useStore(isLogged);
const $userInfo = useStore(userInfo);
const $isTawktoIdentified = useStore(isTawktoIdentified);

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
            isTawktoIdentified.set(true);
            console.log('tawkto identity loaded');
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
            }
        });
        netlifyIdentity.on('login', user => {
            if(user)
            {
                loginUser(user);
                netlifyIdentity.close();
            }
        });
        netlifyIdentity.on('logout', () => {
            logoutUser();
            netlifyIdentity.close();
        });
        netlifyIdentity.init({
            locale: 'it'
        });
        loaded.value = true;
        console.log('netlify identity loaded');
        setTawktoIdentity();
    }
}

function setTawktoIdentity(){
    if(isTawktoIdentified.value){
        console.log('tawkto identity already loaded');
    }
    if(window.Tawk_API && window.Tawk_API.setAttributes){
        console.log('tawkto identity loading');
        setTawktoAttributes();
    }
    else{
        document.addEventListener("tawktoLoaded", (e) => {
            console.log('tawkto identity loading through event');
            setTawktoAttributes();
        });
    }
}

onMounted(() => {
    if(window.netlifyIdentity){
        console.log('netlify identity loading');
        loadIdentity();
    }
    else {
        console.log('netlify identity loading through event');
        document.addEventListener("identityLoaded", (e) => {
            loadIdentity();
        });
    }
});
</script>