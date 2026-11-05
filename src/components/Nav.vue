<script setup lang="ts">
import { activeSection } from "../composable/active";
import LangSwitch from "./langswitch.vue";

const props = defineProps({
  stage: Number,
});
</script>

<template>
  <div
    class="w-full h-16 flex items-center justify-between px-5 py-2 absolute top-0 z-50 transition-all duration-500"
    :class="stage === 1 ? 'bg-[#242424]' : 'bg-transparent'"
  >
    <div class="text-xl text-white font-bold space-grotesk-text">Rafi Pasya</div>
    <div class="flex justify-start items-center gap-3">
      <LangSwitch />
      <a
        href="#work"
        class="text-gray-300 hover:text-red-700 space-grotesk-text transition-all duration-300"
        :class="activeSection === 'work' ? 'text-red-700' : 'text-white'"
        >Work</a
      >
      <a
        href="#experience"
        class="text-gray-300 hover:text-red-700 space-grotesk-text transition-all duration-300"
        :class="activeSection === 'experience' ? 'text-red-700' : 'text-white'"
        >Experience</a
      >
      <a
        href="#stack"
        class="text-gray-300 hover:text-red-700 space-grotesk-text transition-all duration-300"
        :class="activeSection === 'stack' ? 'text-red-700' : 'text-white'"
        >Stack</a
      >
      <a
        href="#contact"
        class="text-gray-300 hover:text-red-700 space-grotesk-text transition-all duration-300"
        :class="activeSection === 'contact' ? 'text-red-700' : 'text-white'"
        >Contact</a
      >
    </div>
  </div>
</template>
