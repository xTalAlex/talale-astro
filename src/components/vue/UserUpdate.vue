<template>
    <div class="card card-compact">
        <div class="card-body h-96">
            <div class="mockup-code space-y-2 h-64 min-w-fit">
                <pre data-prefix="$"><code>Modifica <select class="bg-neutral text-neutral-content"
                v-model="choice"
                @change="resetInput(); resetErrorBag(); resetSuccessMessage();" 
            >
                <option value="name">Nome</option>
                <option value="email">Email</option>
                <option value="password">Password</option>
            </select></code></pre>
                <pre data-prefix=">" :class="{ 
                    'bg-warning text-warning-content' : formData.name != props.defaultName,
                    'bg-error text-error-content' : errorBag.name
                    }"
                    v-if="choice == 'name'"><code><input class="bg-transparent" type="text" 
                        placeholder="Nuovo Nome" v-model="formData.name"
                        @input="resetErrorBag"
                        /></code></pre>
                <pre data-prefix=">" :class="{ 
                    'bg-warning text-warning-content' : formData.email != defaultEmail,
                    'bg-error text-error-content' : errorBag.email
                    }"
                    v-if="choice == 'email'"><code><input class="bg-transparent" type="email" 
                        placeholder="Nuova Email" v-model="formData.email"
                        @input="resetErrorBag"
                        /></code></pre>
                <pre data-prefix=">" :class="{ 'bg-error text-error-content' : errorBag.password }"
                    v-if="choice == 'password'"><code><input class="bg-transparent" type="password" 
                        placeholder="Nuova password" v-model="formData.password"
                        @input="resetErrorBag"
                        /></code></pre>
                <pre data-prefix=">" :class="{ 'bg-error text-error-content' : errorBag.password }"
                    v-if="choice == 'password'"><code><input class="bg-transparent" type="password" 
                        placeholder="Conferma password" v-model="formData.passwordConfirm"
                        @input="resetErrorBag"
                        /></code></pre>
                <pre data-prefix="$" class="text-error"
                    v-show="errorBag[choice]"
                ><code v-text="errorBag[choice]"></code></pre>
                <pre data-prefix="$" class="text-success"
                    v-show="successMessage"
                ><code v-text="successMessage"></code></pre>
            </div>
            <div class="card-actions justify-end">
                <button class="btn uppercase" 
                    :class="btnColor, {
                        'btn-disabled' : (!isValueChanged || successMessage), 'loading': loading 
                    }" 
                    :disable="(!isValueChanged || successMessage)"
                    @click="updateUser"
                >Salva</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps(['defaultName','defaultEmail']);

const emit = defineEmits(['userUpdated']);

const successMessages = {
    name: "Nome aggiornato!",
    email: "Email di conferma inviata al nuovo indirizzo!",
    password: "Password aggiornata!"
}

const choice = ref("name");
const loading = ref(false);
const formData = ref({
    name : props.defaultName,
    email: props.defaultEmail,
    password: null,
    passwordConfirm: null
});
const errorBag = ref({
    name: null,
    email: null,
    password: null,
});
const successMessage = ref(null);

const isValueChanged = computed(() => {
    let changed = false;
    switch(choice.value){
        case("password"): 
            changed = formData.value.password && formData.value.passwordConfirm;
            break;
        case("name"): 
            changed = formData.value[choice.value] != props.defaultName;
            break;
        case("email"): 
            changed = formData.value[choice.value] != props.defaultEmail;
            break;
    }
    return changed;
});

const btnColor = computed(() => {
    let color = 'btn-secondary';
    //if(successMessage.value) color = 'btn-success';
    if(errorBag[choice.value]) color = 'btn-error';
    return color;
});

function resetInput() {
    formData.value.name = props.defaultName;
    formData.value.email = props.defaultEmail;
    formData.value.password = null;
    formData.value.passwordConfirm = null;
}

function resetErrorBag() {
    errorBag.value = {
        name: null,
        email: null,
        password: null
    }
}

function resetSuccessMessage() {
    successMessage.value = null;
}

function validate() {
    let isValid = true;
    if(choice.value == "password"){
        if(formData.value.password != formData.value.passwordConfirm){
            errorBag.value.password = "Le password non coincidono";
            isValid = false;
        }
    }
    return isValid;
}

function updateUser() {
    if(!loading.value && !successMessage.value && isValueChanged.value){
        successMessage.value = null;
        loading.value = true;
        var data = null;
        if(validate()){
            switch(choice.value){
                case("name"): data = { data : { full_name : formData.value.name } };
                    break;
                case("email"): data = { email : formData.value.email };
                    break;
                case("password"): data = { password : formData.value.password }; 
                    break;
                default: break;
            }
            netlifyIdentity.currentUser().update(data)
                .then((user) =>{
                    successMessage.value = successMessages[choice.value];
                    loading.value = false;
                    emit('userUpdated');
                })
                .catch((error) => {
                    loading.value = false;
                    errorBag.value[choice.value] = error;
                });
        } else loading.value = false;
    }
}
</script>