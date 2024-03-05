<template>
    <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn uppercase btn-ghost btn-circle avatar">
            <div class="w-8 h-8 rounded-full"  
                v-if="$userInfo.avatar"
            >
                <img :src="$userInfo.avatar" :alt="$userInfo.name" />
            </div>
            <div class="w-6 h-6"
                v-else
            >                
                <slot />
            </div>
        </label>
        <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-300 rounded-box w-52">
            <li v-if="$isLogged"><a href="/profile">Profilo</a></li>
            <li v-if="$isLogged && $userInfo.isAdmin"><a href="/admin">Admin</a></li>
            <li data-netlify-identity-button></li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "@nanostores/vue";
import { isLogged, userInfo, loginUser, logoutUser } from "@lib/authStore";
import { useStorage } from "@lib/useStorage";

let loaded = ref(false);
const $isLogged = useStore(isLogged);
const $userInfo = useStore(userInfo);
const isTawktoIdentified = useStorage("isTawktoIdentified", false);

async function getTawktoHash(email) {
	const data = await fetch("/.netlify/functions/tawkto-hash", {
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
		window.netlifyIdentity.on("init", async user => {
			if(user){
				await window.netlifyIdentity.refresh(true);
				loginUser(await user.update({}));
			}
			else{
				logoutUser();
				isTawktoIdentified.value = false;
				document.dispatchEvent(new Event("notLogged"));
			}
            
		});
		window.netlifyIdentity.on("login", user => {
			if(user)
			{
				loginUser(user);
				window.netlifyIdentity.close();
				setTawktoIdentity();
				document.dispatchEvent(new Event("userLoaded"));
			}
			else{
				isTawktoIdentified.value = false;
			}
		});
		window.netlifyIdentity.on("logout", () => {
			logoutUser();
			window.netlifyIdentity.close();
			isTawktoIdentified.value = false;
		});
		window.netlifyIdentity.init({
			locale: "it"
		});
		loaded.value = true;
	}
}

function setTawktoIdentity(){
	if(isTawktoIdentified.value){
		return;
	}
	if(window.Tawk_API && window.Tawk_API.setAttributes){
		setTawktoAttributes();
	}
	else{
		document.addEventListener("tawktoLoaded", () => {
			setTawktoAttributes();
		});
	}
}

onMounted(() => {
	if(window.window.netlifyIdentity){
		loadIdentity();
	}
	else {
		document.addEventListener("identityLoaded", () => {
			loadIdentity();
		});
	}
});
</script>