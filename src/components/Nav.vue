
<script setup lang="ts">
import { activeSection } from "../composable/active";
import LangSwitch from "./langswitch.vue";

defineProps({
  stage: Number,
});
</script>

<template>
  <div
    class="
      fixed bottom-3 left-1/2 -translate-x-1/2
      z-50 flex w-[calc(100vw-1rem)] max-w-[520px]
      items-center justify-center
      transition-all duration-500

      md:absolute md:top-0 md:bottom-auto md:left-0 md:translate-x-0
      md:h-16 md:w-full md:max-w-none
      md:justify-between md:px-5 md:py-2
    "
  >
    <div
      class="
        hidden md:block md:whitespace-nowrap
        text-xl text-white font-bold
        space-grotesk-text
        transition-all duration-500 ease
      "
      :class="stage === 1 ? '-translate-y-100' : 'translate-y-0'"
    >
      Rafi Pasya
    </div>

    <nav
      class="
        flex w-full min-w-0
        items-center justify-between
        rounded-[10px] border border-white/10
        bg-[#A8A8A8]/10 px-4 py-3
        shadow-lg backdrop-blur-xl
        transition-all duration-500 ease

        md:w-auto md:max-w-full md:justify-center
        md:gap-3 md:overflow-visible
      "
      :class="
        stage === 1
          ? 'md:rounded-[10px] md:border-white/10 md:bg-[#A8A8A8]/10 md:backdrop-blur-sm md:shadow-lg md:p-3'
          : 'md:rounded-none md:border-transparent md:bg-transparent md:backdrop-blur-none md:shadow-none md:p-0'
      "
    >
      <div
        class="
          flex min-w-0 flex-1 items-center justify-between
          gap-2 md:order-2 md:flex-none md:justify-center md:gap-3
        "
      >
        <a
          href="#work"
          class="shrink-0 text-xs sm:text-sm md:text-base text-white hover:text-red-500 space-grotesk-text transition-colors duration-300"
          :class="activeSection === 'work' ? 'text-red-500' : ''"
        >
          Work
        </a>

        <a
          href="#experience"
          class="shrink-0 text-xs sm:text-sm md:text-base text-white hover:text-red-500 space-grotesk-text transition-colors duration-300"
          :class="activeSection === 'experience' ? 'text-red-500' : ''"
        >
          Experience
        </a>

        <a
          href="#stack"
          class="shrink-0 text-xs sm:text-sm md:text-base text-white hover:text-red-500 space-grotesk-text transition-colors duration-300"
          :class="activeSection === 'stack' ? 'text-red-500' : ''"
        >
          Stack
        </a>

        <a
          href="#contact"
          class="shrink-0 text-xs sm:text-sm md:text-base text-white hover:text-red-500 space-grotesk-text transition-colors duration-300"
          :class="activeSection === 'contact' ? 'text-red-500' : ''"
        >
          Contact
        </a>
      </div>

      <div
        class="
          shrink-0 ml-5 pl-4 border-l border-white/20
          md:order-1 md:ml-0 md:pl-0 md:border-l-0 md:mr-0
        "
      >
        <LangSwitch />
      </div>
    </nav>
  </div>
</template>
