<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { localizedProjects } from "../composable/useProjects.ts";
import { t } from "../composable/i18n.ts";
import LangSwitch from "../components/langswitch.vue";

const route = useRoute();
const slug = route.params.slug as string;

const project = computed(() => localizedProjects.value.find((p) => p.slug === slug));
</script>

<template>
  <div
    class="w-full h-screen bg-[#242424] flex flex-col items-center justify-start relative px-5 gap-5 md:px-10 scroll-smooth overflow-y-auto scrollbar-custom pb-10"
  >
    <div class="flex justify-between items-center px-5 w-full h-16 py-3">
      <div class="flex flex-row justify-start gap-2">
        <RouterLink
          class="flex flex-row justify-start items-center text-sm text-red-700 gap-2 space-grotesk-text hover:text-red-500 transition-all duration-300"
          :to="{ name: 'home' }"
        >
          <span class="material-symbols-outlined"> arrow_back </span>
          {{ t.project.back }}</RouterLink
        >
      </div>
      <div class="flex flex-row justify-end items-center gap-4">
        <p class="text-gray-600 space-grotesk-text text-sm">{{ t.project.details }}</p>
        <LangSwitch />
      </div>
    </div>
    <div class="w-full flex flex-col justify-start items-start gap-3 px-10 md:w-3/4">
      <div class="flex flex-row justify-start items-center gap-2">
        <template v-for="(tag, i) in project?.tags" :key="tag">
          <span v-if="i" class="text-xs text-red-700 space-grotesk-text">·</span>
          <span class="text-xs text-red-700 space-grotesk-text">{{ tag }}</span>
        </template>
      </div>
      <div class="text-3xl text-white w-full font-bold space-grotesk-text">
        {{ project?.title }}
      </div>
      <div class="text-base text-gray-300 w-full space-grotesk-text">
        {{ project?.description }}
      </div>

      <div class="flex flex-row justify-start items-start gap-2">
        <a
          v-if="project?.links.demo"
          :href="project.links.demo"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs text-red-700 space-grotesk-text flex justify-start items-center flex-row gap-1 hover:text-red-500 transition-all duration-300"
          ><span class="material-symbols-outlined !text-gray-600"> language </span
          >{{ t.project.demo }}</a
        >
        <a
          v-if="project?.links.github"
          :href="project.links.github"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs text-red-700 space-grotesk-text flex justify-start items-center flex-row gap-1 hover:text-red-500 transition-all duration-300"
          ><span class="material-symbols-outlined !text-gray-600"> code </span>
          {{ t.project.github }}</a
        >
      </div>
    </div>

    <div class="w-full md:w-3/4 flex-none flex items-center justify-center py-5">
      <div
        v-if="project?.images?.length"
        class="w-full flex justify-center items-start gap-4 md:gap-6"
      >
        <img
          v-for="(img, index) in project.images.slice(0, 2)"
          :key="index"
          :src="img"
          :alt="`${project.title} screenshot ${index + 1}`"
          class="w-[45%] max-w-[260px] h-auto aspect-[9/19.5] object-contain rounded-lg flex-none"
        />
      </div>

      <img
        v-else-if="project?.image"
        :src="project.image"
        :alt="project.title"
        class="w-full h-auto object-cover rounded-lg"
      />

      <div
        v-else
        class="w-full min-h-[360px] rounded-lg bg-red-800 border border-red-400 flex items-center justify-center text-sm text-red-100 text-center px-4"
      >
        {{ project?.imageLabel }}
      </div>
    </div>

    <div class="w-full flex flex-col justify-start items-start gap-3 px-10 md:w-3/4">
      <div class="w-full flex-row flex justify-between gap-3 items-center">
        <div class="timeline flex flex-col justify-start items-start gap-2">
          <div class="text-sm text-gray-600 space-grotesk-text">{{ t.project.timeline }}</div>
          <h2 class="text-base md:text-lg text-red-700 font-bold space-grotesk-text">
            {{ project?.timeline.start }} - {{ project?.timeline.end }}
          </h2>
        </div>
        <div class="stack flex flex-col justify-start items-end gap-2">
          <div class="text-sm text-gray-600 space-grotesk-text">{{ t.project.stack }}</div>

          <div class="flex flex-row justify-end items-center gap-3">
            <a
              v-for="s in project?.stack"
              :key="s"
              class="text-xs text-red-700 border border-gray-600 rounded px-3 py-1 space-grotesk-text"
            >
              {{ s }}
            </a>
          </div>
        </div>
      </div>
      <hr class="w-full border-t border-gray-600 mx-3" />
      <div class="w-full flex flex-col gap-2 py-3">
        <h2 class="text-3xl text-white font-bold space-grotesk-text">{{ t.project.problem }}</h2>
        <div class="text-sm text-gray-600 space-grotesk-text">
          {{ project?.problem }}
        </div>
      </div>
      <div class="w-full flex flex-col gap-5 py-3">
        <h2 class="text-3xl text-white font-bold space-grotesk-text">
          {{ t.project.architecture }}
        </h2>
        <div class="w-full min-h-[240px] flex items-center justify-center">
          <img
            v-if="project?.architecture?.diagram"
            :src="project?.architecture?.diagram"
            :alt="project?.title"
            class="w-full h-full object-cover rounded-lg"
          />
          <div
            v-else
            class="w-full h-full min-h-[240px] rounded-lg bg-red-800 border border-red-400 flex items-center justify-center text-sm text-red-100 text-center px-4"
          >
            {{ project?.imageLabel }}
          </div>
        </div>
        <div class="text-sm text-gray-600 space-grotesk-text">
          {{ project?.architecture?.description }}
        </div>
      </div>
      <div class="w-full flex flex-col gap-2 py-3">
        <h2 class="text-3xl text-white font-bold space-grotesk-text">{{ t.project.next }}</h2>
        <ul class="flex flex-col justify-start items-start gap-2 px-5">
          <li
            v-for="(item, i) in project?.improvements"
            :key="i"
            class="text-sm flex flex-row justify-start items-center text-gray-600 gap-2 space-grotesk-text"
          >
            <span class="text-3xl text-red-700 space-grotesk-text">·</span>
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
