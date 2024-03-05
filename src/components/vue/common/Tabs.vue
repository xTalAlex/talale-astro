<template>
    <div>
        <div class="tabs tabs-boxed bg-transparent"
            :class="headerClass"
        >
            <div class="tab" 
                :class="{ 'tab-active' : tabTitle == selectedTabTitle }"
                v-for="(tabTitle,index) in tabTitles"
                v-bind:key="index"
                @click="selectedTabTitle = tabTitle"
            >{{ tabTitle }}</div>
        </div>
        <slot />
    </div>
</template>

<script setup>
import { ref, provide, useSlots } from "vue";

defineProps(["headerClass"]);

const slots = useSlots();
const tabTitles = ref(slots.default().map(tab => tab.props.title));
const selectedTabTitle = ref(tabTitles.value[0]);

provide("selectedTabTitle",selectedTabTitle);

</script>