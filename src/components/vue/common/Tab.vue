<template>
    <div v-show="title == selectedTabTitle">
        <slot></slot>
    </div>
</template>

<script setup>
import { inject } from 'vue';

const props = defineProps([ 'title' ]);

const selectedTabTitle = inject('selectedTabTitle');

</script>