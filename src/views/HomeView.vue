<script setup lang="ts">
import Nav from "../components/Nav.vue";
import { computed, onMounted, ref } from "vue";
import { activeSection } from "../composable/active.ts";
import { RouterLink } from "vue-router";
import { localizedProjects as projects } from "../composable/useProjects.ts";
import { t } from "../composable/i18n.ts";

const scroller = ref<HTMLElement | null>(null);
const sectionIds = ["home", "work", "experience", "stack", "contact"];

const skill = [
  { group: "Frontend / Mobile", items: ["HTML & CSS", "Vue.js", "React Native", "TypeScript"] },
  { group: "Backend & Data", items: ["Python", "FastAPI", "SQL", "PostgreSQL", "Supabase"] },
  {
    group: "AI, Embedded & Tools",
    items: ["TensorFlow/Keras", "C++", "Arduino/ESP32", "Docker", "Git"],
  },
];

const contacts = computed(() => [
  { label: "rafipas101@gmail.com", href: "mailto:rafipas101@gmail.com" },
  { label: "LinkedIn", href: "https://linkedin.com/in/muhammadrafipasya" },
  { label: "GitHub", href: "https://github.com/rafipasya22/" },
  { label: t.value.contact.resume, href: "/cv.pdf" },
]);

function updateActive() {
  const el = scroller.value;
  if (!el) return;
  const line = el.getBoundingClientRect().top + el.clientHeight * 0.4;
  let current = sectionIds[0]!;
  for (const id of sectionIds) {
    const s = document.getElementById(id);
    if (s && s.getBoundingClientRect().top <= line) current = id;
  }
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) current = sectionIds.at(-1)!;
  activeSection.value = current;
}

onMounted(updateActive);
</script>

<template>
  <div class="w-full h-screen bg-[#242424] flex flex-col items-center justify-start relative px-5">
    <Nav />
    <div
      ref="scroller"
      @scroll.passive="updateActive"
      class="w-full flex-1 min-h-0 scroll-smooth overflow-y-auto scrollbar-custom"
    >
      <section id="home" class="h-screen flex flex-col justify-center items-start gap-3 px-5">
        <div class="flex flex-row justify-start items-center gap-2">
          <template v-for="(tag, i) in t.tags" :key="tag">
            <span v-if="i" class="text-xs text-red-700 space-grotesk-text">·</span>
            <span class="text-xs text-red-700 space-grotesk-text">{{ tag }}</span>
          </template>
        </div>

        <div class="text-6xl text-white w-3/4 font-bold space-grotesk-text">
          {{ t.hero.title }}
        </div>
        <div class="text-lg text-gray-300 w-1/2 space-grotesk-text">
          {{ t.hero.subtitle }}
        </div>
        <div class="flex flex-row justify-start items-center gap-4">
          <a
            href="#work"
            class="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-600 space-grotesk-text cursor-pointer"
          >
            {{ t.hero.viewWork }}
          </a>
          <a
            href="/cv.pdf"
            class="bg-gray-700 text-red-500 py-2 px-4 rounded hover:bg-gray-800 space-grotesk-text cursor-pointer"
          >
            {{ t.hero.resume }}
          </a>
        </div>
      </section>

      <section
        id="work"
        class="w-full h-fit flex flex-col justify-center items-start gap-10 py-16 px-5 md:px-10"
      >
        <div class="flex flex-col gap-2">
          <div class="text-sm text-gray-600 space-grotesk-text">{{ t.work.label }}</div>
          <h2 class="text-xl md:text-2xl text-white font-bold space-grotesk-text">
            {{ t.work.title }}
          </h2>
        </div>
        <div
          v-for="(p, i) in projects"
          :key="p.title"
          class="w-full flex items-center gap-5 mb-15"
          :class="i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'"
        >
          <div class="w-full md:w-1/2 min-h-[240px]">
            <div v-if="p.images?.length" class="w-full flex justify-center items-center gap-4">
              <img
                v-for="(img, index) in p.images"
                :key="index"
                :src="img"
                :alt="`${p.title} screenshot ${index + 1}`"
                class="w-1/2 max-w-[220px] aspect-[9/19.5] object-cover rounded-lg"
              />
            </div>

            <img
              v-else-if="p.image"
              :src="p.image"
              :alt="p.title"
              class="w-full h-full object-cover rounded-lg"
            />

            <div
              v-else
              class="w-full h-full min-h-[240px] rounded-lg bg-red-800 border border-red-400 flex items-center justify-center text-sm text-red-100 text-center px-4"
            >
              {{ p.imageLabel }}
            </div>
          </div>
          <div class="w-full md:w-1/2 flex flex-col justify-start items-center">
            <div class="w-full h-fit flex flex-col justify-center items-start gap-3 px-5">
              <div class="flex flex-row justify-start items-center gap-2">
                <template v-for="(tag, i) in p.tags" :key="tag">
                  <span v-if="i" class="text-xs text-red-700 space-grotesk-text">·</span>
                  <span class="text-xs text-red-700 space-grotesk-text">{{ tag }}</span>
                </template>
              </div>

              <div class="text-3xl text-white w-5/6 font-bold space-grotesk-text">
                {{ p.title }}
              </div>
              <div class="text-base text-gray-300 w-full space-grotesk-text">
                {{ p.overview }}
              </div>
              <div class="flex flex-row justify-start items-center gap-2">
                <a
                  v-for="t in p.tags"
                  :key="t"
                  class="text-xs text-red-700 border border-gray-600 rounded px-3 py-1 space-grotesk-text"
                >
                  {{ t }}
                </a>
              </div>

              <RouterLink
                class="flex flex-row justify-start items-center text-red-700 gap-2 space-grotesk-text hover:text-red-500 transition-all duration-300"
                :to="{ name: 'project', params: { slug: p.slug } }"
                >{{ t.work.open }}
                <span class="material-symbols-outlined"> arrow_right_alt </span></RouterLink
              >
            </div>
          </div>
        </div>
      </section>
      <section
        id="experience"
        class="w-full h-fit flex flex-col md:flex-row justify-start items-start gap-8 md:gap-12 py-16 px-5 md:px-10"
      >
        <div class="w-full md:w-[30%] flex flex-col gap-2">
          <div class="text-sm text-gray-600 space-grotesk-text">{{ t.experience.label }}</div>
          <h2 class="text-3xl text-white font-bold space-grotesk-text">{{ t.experience.title }}</h2>
        </div>
        <div class="w-full md:w-[70%] flex flex-col">
          <div
            v-for="(e, i) in t.experiences"
            :key="e.company"
            class="flex flex-col gap-1 py-6"
            :class="i ? 'border-t border-gray-300' : ''"
          >
            <span class="text-sm text-gray-600 space-grotesk-text">{{ e.waktu }}</span>
            <h3 class="text-xl text-white font-bold space-grotesk-text">
              {{ e.pos }} · {{ e.company }}
            </h3>
            <p class="text-base text-white space-grotesk-text">{{ e.desc }}</p>
          </div>
        </div>
      </section>
      <section
        id="stack"
        class="w-full h-fit flex flex-col md:flex-row justify-start items-start gap-8 md:gap-12 py-16 px-5 md:px-10"
      >
        <div class="w-full md:w-[30%] flex flex-col gap-2">
          <div class="text-sm text-gray-600 space-grotesk-text">{{ t.stack.label }}</div>
          <h2 class="text-3xl text-white font-bold space-grotesk-text">{{ t.stack.title }}</h2>
        </div>
        <div class="w-full md:w-[70%] flex flex-col gap-6">
          <div
            v-for="g in skill"
            :key="g.group"
            class="flex flex-col sm:flex-row sm:items-center gap-3"
          >
            <span class="w-44 shrink-0 text-sm text-gray-600 space-grotesk-text">{{
              g.group
            }}</span>
            <div class="flex flex-row flex-wrap gap-2">
              <span
                v-for="item in g.items"
                :key="item"
                class="text-sm text-red-700 border border-gray-300 rounded px-3 py-1 space-grotesk-text"
              >
                {{ item }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" class="w-full h-fit flex flex-col gap-6 py-5 px-5 md:px-10">
        <div class="text-sm text-gray-600 space-grotesk-text">{{ t.contact.label }}</div>
        <h2
          class="text-3xl md:text-5xl text-white font-bold w-full md:w-3/4 leading-tight space-grotesk-text"
        >
          {{ t.contact.title }}
        </h2>
        <div class="flex flex-row flex-wrap gap-6 text-base">
          <a
            v-for="c in contacts"
            :key="c.label"
            :href="c.href"
            class="text-red-700 underline underline-offset-4 hover:text-red-800 space-grotesk-text"
          >
            {{ c.label }}
          </a>
        </div>
        <span class="text-sm text-gray-600 mt-8 space-grotesk-text">© 2026 Rafi Pasya</span>
      </section>
    </div>
  </div>
</template>
