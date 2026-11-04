<script setup lang="ts">
import { lang, setLang, type Lang } from "../composable/lang.ts";

const options: { value: Lang; label: string; name: string }[] = [
  { value: "en", label: "EN", name: "English" },
  { value: "id", label: "ID", name: "Bahasa Indonesia" },
];
</script>

<template>
  <div
    role="group"
    aria-label="Language"
    class="flex flex-row items-center rounded border border-gray-600 overflow-hidden space-grotesk-text"
  >
    <button
      v-for="o in options"
      :key="o.value"
      type="button"
      :aria-pressed="lang === o.value"
      :aria-label="o.name"
      :title="o.name"
      class="px-2 py-1 text-xs cursor-pointer transition-colors"
      :class="lang === o.value ? 'bg-red-700 text-white' : 'text-gray-300 hover:text-red-500'"
      @click="setLang(o.value)"
    >
      {{ o.label }}
    </button>
  </div>
</template>
