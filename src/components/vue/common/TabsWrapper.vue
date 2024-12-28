<template>
  <div>
    <div class="tabs-boxed tabs bg-transparent" :class="headerClass">
      <div
        v-for="(tabTitle, index) in tabTitles"
        :key="index"
        class="tab"
        :class="{ 'tab-active': tabTitle == selectedTabTitle }"
        @click="selectedTabTitle = tabTitle"
      >
        {{ tabTitle }}
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup>
import { ref, provide, useSlots } from "vue";

const props = defineProps({
  headerClass: {
    type: String,
    required: false,
    default: "",
  },
});

const slots = useSlots();
const tabTitles = ref(slots.default().map((tab) => tab.props.title));
const selectedTabTitle = ref(tabTitles.value[0]);

provide("selectedTabTitle", selectedTabTitle);
</script>
