<script setup lang="ts">
import { computed, ref, watch, type Directive } from "vue";
import { useRoute } from "vue-router";
import { localizedProjects } from "../composable/useProjects.ts";
import { t } from "../composable/i18n.ts";
import LangSwitch from "../components/langswitch.vue";

const route = useRoute();
const scroller = ref<HTMLElement | null>(null);

const slug = computed(() => route.params.slug as string);
const idx = computed(() => localizedProjects.value.findIndex((p) => p.slug === slug.value));
const project = computed(() => localizedProjects.value[idx.value]);
const prev = computed(() => localizedProjects.value[idx.value - 1]);
const next = computed(() => localizedProjects.value[idx.value + 1]);

watch(slug, () => scroller.value?.scrollTo({ top: 0 }));

const observers = new WeakMap<HTMLElement, IntersectionObserver>();

const vReveal: Directive<HTMLElement, number | undefined> = {
  beforeMount(el, binding) {
    el.classList.add(binding.modifiers.line ? "reveal-line" : "reveal");
    el.style.transitionDelay = `${binding.value ?? 0}ms`;
  },
  mounted(el) {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.classList.add("reveal-in");
        io.disconnect();
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    observers.set(el, io);
  },
  unmounted(el) {
    observers.get(el)?.disconnect();
    observers.delete(el);
  },
};
</script>

<template>
  <div
    ref="scroller"
    class="w-full h-screen bg-[#242424] flex flex-col items-center justify-start relative px-10 gap-10 md:px-10 scroll-smooth overflow-y-auto scrollbar-custom pb-16"
  >
    <div class="flex justify-between items-center px-5 w-full h-16 py-3 shrink-0">
      <div class="flex flex-row justify-start gap-2">
        <RouterLink
          class="flex flex-row justify-start items-center text-sm text-red-700 gap-2 space-grotesk-text hover:text-red-500 transition-all duration-300 group"
          :to="{ name: 'home' }"
        >
          <span
            class="material-symbols-outlined transition-transform duration-300 group-hover:-translate-x-1"
          >
            arrow_back
          </span>
          {{ t.project.back }}</RouterLink
        >
      </div>
      <div class="flex flex-row justify-end items-center gap-4">
        <p class="text-gray-600 space-grotesk-text text-sm">{{ t.project.details }}</p>
        <LangSwitch />
      </div>
    </div>

    <div :key="slug" class="contents">
      <template v-if="project">
        <section
          class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-5 md:px-0"
        >
          <div class="order-2 md:order-1 flex flex-col justify-start items-start gap-4">
            <div v-reveal="0" class="flex flex-row flex-wrap justify-start items-center gap-2">
              <template v-for="(tag, i) in project.tags" :key="tag">
                <span v-if="i" class="text-xs text-red-700 space-grotesk-text">·</span>
                <span class="text-xs text-red-700 space-grotesk-text">{{ tag }}</span>
              </template>
            </div>
            <h1 v-reveal="100" class="text-3xl md:text-5xl text-white w-full font-bold leading-tight space-grotesk-text">
              {{ project.title }}
            </h1>
            <p v-reveal="200" class="text-base text-gray-300 w-full max-w-prose space-grotesk-text">
              {{ project.description }}
            </p>
            <div
              v-if="project.links.demo"
              v-reveal="300"
              class="text-xs text-gray-500 max-w-prose space-grotesk-text"
            >
              {{ t.project.warning }}
            </div>
            <div v-reveal="400" class="flex flex-row justify-start items-center gap-3">
              <a
                v-if="project.links.demo"
                :href="project.links.demo"
                target="_blank"
                rel="noopener noreferrer"
                class="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300 space-grotesk-text text-sm flex flex-row items-center gap-2"
                ><i class="fa-solid fa-globe"></i>{{ t.project.demo }}</a
              >
              <a
                v-if="project.links.github"
                :href="project.links.github"
                target="_blank"
                rel="noopener noreferrer"
                class="bg-gray-700 text-red-500 py-2 px-4 rounded hover:bg-gray-800 transition-colors duration-300 space-grotesk-text text-sm flex flex-row items-center gap-2"
                ><i class="fa-brands fa-github"></i>{{ t.project.github }}</a
              >
            </div>
          </div>

          <div class="order-1 md:order-2 w-full flex items-center justify-center">
            <div
              v-if="project.images?.length"
              class="w-full flex justify-center items-start gap-4 md:gap-6"
            >
              <div
                v-for="(img, index) in project.images.slice(0, 2)"
                :key="index"
                v-reveal="index * 150"
                class="w-[45%] max-w-[240px] flex-none"
              >
                <img
                  :src="img"
                  :alt="`${project.title} screenshot ${index + 1}`"
                  class="w-full h-auto aspect-[9/19.5] object-contain rounded-lg transition-transform duration-300 hover:-translate-y-2"
                />
              </div>
            </div>
            <div v-else-if="project.image" v-reveal class="w-full">
              <img
                :src="project.image"
                :alt="project.title"
                class="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <div
              v-else
              v-reveal
              class="w-full min-h-[300px] rounded-lg bg-red-800 border border-red-400 flex items-center justify-center text-sm text-red-100 text-center px-4"
            >
              {{ project.imageLabel }}
            </div>
          </div>
        </section>

        <hr v-reveal.line class="w-full max-w-6xl border-t border-gray-700" />

        <section class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 lg:gap-16 px-5 md:px-0">
          <div class="flex flex-col gap-12 min-w-0">
            <div class="flex flex-col gap-3">
              <div v-reveal class="flex flex-row items-baseline gap-3">
                <span class="text-sm text-red-700 space-grotesk-text">01</span>
                <h2 class="text-2xl md:text-3xl text-white font-bold space-grotesk-text">
                  {{ t.project.problem }}
                </h2>
              </div>
              <p v-reveal="100" class="text-base text-gray-400 max-w-prose space-grotesk-text">
                {{ project.problem }}
              </p>
            </div>

            <div class="flex flex-col gap-3">
              <div v-reveal class="flex flex-row items-baseline gap-3">
                <span class="text-sm text-red-700 space-grotesk-text">02</span>
                <h2 class="text-2xl md:text-3xl text-white font-bold space-grotesk-text">
                  {{ t.project.architecture }}
                </h2>
              </div>
              <p v-reveal="100" class="text-base text-gray-400 max-w-prose space-grotesk-text">
                {{ project.architecture?.description }}
              </p>
            </div>
          </div>

          <aside
            v-reveal="150"
            class="order-first lg:order-none flex flex-col gap-6 lg:sticky lg:top-6 self-start border border-gray-700 rounded-lg p-5"
          >
            <div class="flex flex-col gap-2">
              <div class="text-sm text-gray-600 space-grotesk-text">{{ t.project.timeline }}</div>
              <div class="text-base text-red-700 font-bold space-grotesk-text">
                {{ project.timeline.start }} - {{ project.timeline.end }}
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="text-sm text-gray-600 space-grotesk-text">{{ t.project.stack }}</div>
              <div class="flex flex-row flex-wrap gap-2">
                <span
                  v-for="s in project.stack"
                  :key="s"
                  class="text-xs text-red-700 border border-gray-600 rounded px-3 py-1 space-grotesk-text transition-colors duration-300 hover:border-red-700"
                >
                  {{ s }}
                </span>
              </div>
            </div>
          </aside>
        </section>

        <section class="w-full max-w-6xl px-5 md:px-0">
          <div v-reveal class="w-full min-h-[240px] flex items-center justify-center">
            <img
              v-if="project.architecture?.diagram"
              :src="project.architecture.diagram"
              :alt="project.title"
              class="w-full h-auto object-contain bg-black/20 p-3 rounded-lg"
            />
            <div
              v-else
              class="w-full min-h-[240px] rounded-lg bg-red-800 border border-red-400 flex items-center justify-center text-sm text-red-100 text-center px-4"
            >
              {{ project.imageLabel }}
            </div>
          </div>
        </section>

        <section class="w-full max-w-6xl flex flex-col gap-5 px-5 md:px-0">
          <div v-reveal class="flex flex-row items-baseline gap-3">
            <span class="text-sm text-red-700 space-grotesk-text">03</span>
            <h2 class="text-2xl md:text-3xl text-white font-bold space-grotesk-text">
              {{ t.project.next }}
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="(item, i) in project.improvements" :key="i" v-reveal="i * 100">
              <div
                class="h-full border border-gray-700 rounded-lg p-5 flex flex-col gap-2 transition-colors duration-300 hover:border-red-700"
              >
                <span class="text-sm text-red-700 space-grotesk-text">
                  {{ String(i + 1).padStart(2, "0") }}
                </span>
                <p class="text-sm text-gray-300 space-grotesk-text">{{ item }}</p>
              </div>
            </div>
          </div>
        </section>

      </template>

      <div v-else class="w-full max-w-6xl px-5 text-gray-400 space-grotesk-text">
        Project not found.
      </div>
    </div>
  </div>
</template>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.7s ease,
    transform 0.7s ease;
}
.reveal-line {
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.9s ease;
}
.reveal-in {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .reveal,
  .reveal-line {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>