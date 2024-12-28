<template>
  <div v-show="title == selectedTabTitle">
    <slot></slot>
  </div>
</template>

<script setup>
import { inject } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: "",
  },
});

const selectedTabTitle = inject("selectedTabTitle");
</script>
