<script setup lang="ts">
import { computed, ref, watch, type Directive } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { localizedProjects } from "../composable/useProjects.ts";
import { t } from "../composable/i18n.ts";
import LangSwitch from "../components/langswitch.vue";

const route = useRoute();
const scroller = ref<HTMLElement | null>(null);

const slug = computed(() => route.params.slug as string);

const idx = computed(() => localizedProjects.value.findIndex((p) => p.slug === slug.value));

const project = computed(() => localizedProjects.value[idx.value]);

watch(slug, () => {
  scroller.value?.scrollTo({ top: 0, behavior: "instant" });
});

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
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      },
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
    class="w-full h-screen overflow-y-auto scroll-smooth scrollbar-custom bg-[#242424] flex flex-col items-center px-4 sm:px-6 lg:px-10 pb-10"
  >
    <header
      class="sticky top-0 z-30 w-full max-w-6xl min-h-16 shrink-0 flex items-center justify-between gap-3 px-1 sm:px-5 bg-[#242424]/90 backdrop-blur-md border-b border-white/5"
    >
      <RouterLink
        :to="{ name: 'home' }"
        class="flex items-center gap-2 text-sm text-red-500 hover:text-red-500 transition-colors duration-300 space-grotesk-text group"
      >
        <span
          class="material-symbols-outlined transition-transform duration-300 group-hover:-translate-x-1"
        >
          arrow_back
        </span>

        {{ t.project.back }}
      </RouterLink>

      <div class="flex items-center gap-3 sm:gap-5 shrink-0">
        <p class="hidden sm:block text-gray-500 text-sm space-grotesk-text">
          {{ t.project.details }}
        </p>

        <LangSwitch />
      </div>
    </header>

    <div :key="slug" class="w-full max-w-6xl flex flex-col gap-12 sm:gap-16 pt-8 sm:pt-12 pb-12">
      <template v-if="project">
        <section
          class="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-16 items-center"
        >
          <div class="order-1 min-w-0 flex flex-col items-start gap-4 sm:gap-5">
            <div v-reveal="0" class="flex flex-wrap items-center gap-x-2 gap-y-1">
              <template v-for="(tag, i) in project.tags" :key="tag">
                <span v-if="i" class="text-xs text-red-500 space-grotesk-text"> · </span>

                <span class="text-xs text-red-500 space-grotesk-text">
                  {{ tag }}
                </span>
              </template>
            </div>

            <h1
              v-reveal="100"
              class="w-full text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-tight break-words space-grotesk-text"
            >
              {{ project.title }}
            </h1>

            <p
              v-reveal="200"
              class="w-full max-w-prose text-sm sm:text-base leading-relaxed text-gray-300 space-grotesk-text"
            >
              {{ project.description }}
            </p>

            <div
              v-if="project.links.demo"
              v-reveal="300"
              class="max-w-prose text-xs leading-relaxed text-gray-500 space-grotesk-text"
            >
              {{ t.project.warning }}
            </div>

            <div v-reveal="400" class="flex flex-wrap items-center gap-3 pt-1">
              <a
                v-if="project.links.demo"
                :href="project.links.demo"
                target="_blank"
                rel="noopener noreferrer"
                class="bg-red-500 text-white py-2.5 px-4 rounded hover:bg-red-600 transition-colors duration-300 space-grotesk-text text-sm flex items-center gap-2"
              >
                <i class="fa-solid fa-globe"></i>
                {{ t.project.demo }}
              </a>

              <a
                v-if="project.links.github"
                :href="project.links.github"
                target="_blank"
                rel="noopener noreferrer"
                class="bg-gray-700 text-red-500 py-2.5 px-4 rounded hover:bg-gray-800 transition-colors duration-300 space-grotesk-text text-sm flex items-center gap-2"
              >
                <i class="fa-brands fa-github"></i>
                {{ t.project.github }}
              </a>
            </div>
          </div>
          <div class="order-2 w-full min-w-0 flex items-center justify-center">
            <div
              v-if="project.video?"
              class="w-full grid grid-cols-2 gap-3 sm:gap-5 items-start justify-items-center"
            >
              <video
                :src="project.video"
                autoplay
                loop
                muted
                playsinline
                preload="metadata"
                :aria-label="project.title"
                class="block w-full h-auto max-h-[65vh] object-contain rounded-lg mx-auto"
              ></video>
            </div>

            <div v-else-if="project.video" v-reveal class="w-full">
              <video
                :src="project.video"
                autoplay
                loop
                muted
                playsinline
                preload="metadata"
                :aria-label="project.title"
                class="block w-full h-auto max-h-[65vh] object-contain rounded-lg"
              ></video>
            </div>

            <div
              v-else
              v-reveal
              class="w-full min-h-[240px] sm:min-h-[300px] rounded-lg bg-red-800 border border-red-400 flex items-center justify-center text-sm text-red-100 text-center px-4"
            >
              {{ project.imageLabel }}
            </div>
          </div>
        </section>

        <hr v-reveal.line class="w-full border-t border-gray-700" />

        <section
          class="w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-10 lg:gap-16 items-start"
        >
          <div class="min-w-0 flex flex-col gap-10 sm:gap-12">
            <div class="flex flex-col gap-3">
              <div v-reveal class="flex items-baseline gap-3">
                <span class="text-sm text-red-500 space-grotesk-text"> 01 </span>

                <h2 class="text-xl sm:text-2xl lg:text-3xl text-white font-bold space-grotesk-text">
                  {{ t.project.problem }}
                </h2>
              </div>

              <p
                v-reveal="100"
                class="max-w-prose text-sm sm:text-base leading-relaxed text-gray-400 space-grotesk-text"
              >
                {{ project.problem }}
              </p>
            </div>

            <div class="flex flex-col gap-3">
              <div v-reveal class="flex items-baseline gap-3">
                <span class="text-sm text-red-500 space-grotesk-text"> 02 </span>

                <h2 class="text-xl sm:text-2xl lg:text-3xl text-white font-bold space-grotesk-text">
                  {{ t.project.architecture }}
                </h2>
              </div>

              <p
                v-reveal="100"
                class="max-w-prose text-sm sm:text-base leading-relaxed text-gray-400 space-grotesk-text"
              >
                {{ project.architecture?.description }}
              </p>
            </div>
          </div>

          <aside
            v-reveal="150"
            class="w-full min-w-0 order-first lg:order-none flex flex-col gap-6 lg:sticky lg:top-20 self-start border border-gray-700 rounded-lg p-4 sm:p-5"
          >
            <div class="flex flex-col gap-2">
              <div class="text-sm text-gray-500 space-grotesk-text">
                {{ t.project.timeline }}
              </div>

              <div class="text-base sm:text-lg text-red-500 font-bold space-grotesk-text">
                {{ project.timeline.start }} - {{ project.timeline.end }}
              </div>
            </div>

            <div class="border-t border-gray-700"></div>

            <div class="flex flex-col gap-3">
              <div class="text-sm text-gray-500 space-grotesk-text">
                {{ t.project.stack }}
              </div>

              <div class="flex flex-wrap gap-2">
                <span
                  v-for="s in project.stack"
                  :key="s"
                  class="text-xs text-red-500 border border-gray-600 rounded px-3 py-1.5 space-grotesk-text transition-colors duration-300 hover:border-red-500"
                >
                  {{ s }}
                </span>
              </div>
            </div>
          </aside>
        </section>

        <section class="w-full">
          <div
            v-reveal
            class="w-full min-h-[180px] sm:min-h-[240px] flex items-center justify-center"
          >
            <img
              v-if="project.architecture?.diagram"
              :src="project.architecture.diagram"
              :alt="`${project.title} architecture diagram`"
              class="block w-full h-auto max-h-[75vh] object-contain bg-black/20 p-2 sm:p-4 rounded-lg"
            />

            <div
              v-else
              class="w-full min-h-[180px] sm:min-h-[240px] rounded-lg bg-red-800 border border-red-400 flex items-center justify-center text-sm text-red-100 text-center px-4"
            >
              {{ project.imageLabel }}
            </div>
          </div>
        </section>

        <section class="w-full flex flex-col gap-5">
          <div v-reveal class="flex items-baseline gap-3">
            <span class="text-sm text-red-500 space-grotesk-text"> 03 </span>

            <h2 class="text-xl sm:text-2xl lg:text-3xl text-white font-bold space-grotesk-text">
              {{ t.project.next }}
            </h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div
              v-for="(item, i) in project.improvements"
              :key="i"
              v-reveal="i * 100"
              class="h-full"
            >
              <div
                class="h-full border border-gray-700 rounded-lg p-4 sm:p-5 flex flex-col gap-3 transition-colors duration-300 hover:border-red-500"
              >
                <span class="text-sm text-red-500 space-grotesk-text">
                  {{ String(i + 1).padStart(2, "0") }}
                </span>

                <p class="text-sm leading-relaxed text-gray-300 space-grotesk-text">
                  {{ item }}
                </p>
              </div>
            </div>
          </div>
        </section>
      </template>

      <div v-else class="w-full text-gray-400 text-sm space-grotesk-text">Project not found.</div>
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
