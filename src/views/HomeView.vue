<script setup lang="ts">
import Nav from "../components/Nav.vue";

import { computed, onMounted, ref, type Directive } from "vue";

import { activeSection } from "../composable/active.ts";

import { RouterLink } from "vue-router";

import { localizedProjects as projects } from "../composable/useProjects.ts";

import { t } from "../composable/i18n.ts";

import { onBeforeUnmount } from "vue";

import { unref } from "vue";

const workIndex = ref(0);

let wheelLock = 0;

const stage = ref<0 | 1>(0);

const openGroup = ref<number | null>(null);

const preview = ref<{ title: string; src: string } | null>(null);

const observers = new WeakMap<HTMLElement, IntersectionObserver>();

const vReveal: Directive<HTMLElement, number | undefined> = {
  beforeMount(el, binding) {
    el.classList.add("reveal");

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

function splitLabel(label: string) {
  const [num, ...rest] = label.split(" / ");

  return { num, rest: rest.join(" / ") };
}

const labels = computed(() => ({
  work: splitLabel(t.value.work.label),

  experience: splitLabel(t.value.experience.label),

  stack: splitLabel(t.value.stack.label),

  contact: splitLabel(t.value.contact.label),
}));

function openPreview(title: string, src: string) {
  preview.value = { title, src };
}

function closePreview() {
  preview.value = null;
}

function onKey(e: KeyboardEvent) {
  if (e.key === "Escape") closePreview();
}

function toggleGroup(i: number) {
  openGroup.value = openGroup.value === i ? null : i;
}

const publications = [
  {
    waktu: "2025",

    title:
      "Implementation of Steganography Encryption and Decryption Methods on Digital Images in Web-Based Applications · Jurnal Processor",

    desc: "Reyhan Mochamad Fabian, Yosua Adriel Tamba, Muhammad Rifki Lathif, Muhamad Rafi Pasya Martadisastra, dkk.",
  },

  {
    waktu: "2024",

    title:
      "Pengembangan Model Pohon Keputusan untuk Menentukan Jurusan Pada SMA Menggunakan Bahasa C++ · JTEKSIS",

    desc: "Rangga Ali Mustofa, Muhamad Rafi Pasya Martadisastra, dkk",
  },
];

const groups = computed(() => [
  {
    title: "Internships and Organization Experience",

    items: t.value.experiences.map((e) => ({
      waktu: e.waktu,

      title: `${e.pos} · ${e.company}`,

      desc: e.desc,
    })),
  },

  {
    title: "Certifications",

    items: t.value.certificates.map((c) => ({
      waktu: `${c.DateStart} - ${c.DateEnd}`,

      title: `${c.Title}`,

      desc: `${c.Issuer}`,
    })),
  },

  { title: "Publications", items: publications },
]);

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
  {
    icon: "fa-solid fa-envelope",

    label: "rafipas101@gmail.com",

    href: "mailto:rafipas101@gmail.com",
  },

  {
    icon: "fa-brands fa-linkedin",

    label: "LinkedIn",

    href: "https://www.linkedin.com/in/muhamadrafipasya",
  },

  { icon: "fa-brands fa-github", label: "GitHub", href: "https://github.com/rafipasya22/" },

  {
    icon: "fa-solid fa-file-pdf",

    label: t.value.contact.resume,

    href: "/cv.pdf",

    preview: "/cv.pdf",
  },
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

  stage.value = el.scrollTop > 100 ? 1 : 0;
}

function stepWork(dir: 1 | -1) {
  workIndex.value += dir;

  wheelLock = Date.now() + 700;
}

function handleWork(e: WheelEvent, el: HTMLElement): boolean {
  // Mobile projects are displayed as a vertical list, not a horizontal carousel.
  if (window.matchMedia("(max-width: 767px)").matches) return false;

  const work = document.getElementById("work");

  if (!work) return false;

  const total = unref(projects).length;

  const down = e.deltaY > 0;

  const top = work.getBoundingClientRect().top - el.getBoundingClientRect().top;

  const h = el.clientHeight;

  if (Date.now() < wheelLock && Math.abs(top) < h) return true;

  if (Math.abs(top) < 6) {
    if (down && workIndex.value < total - 1) return (stepWork(1), true);

    if (!down && workIndex.value > 0) return (stepWork(-1), true);

    return false;
  }

  if (down && top > 6 && top < h * 0.6) {
    workIndex.value = 0;

    wheelLock = Date.now() + 800;

    el.scrollTo({ top: el.scrollTop + top, behavior: "smooth" });

    return true;
  }

  if (!down && top < -6 && top > -h * 0.6) {
    workIndex.value = total - 1;

    wheelLock = Date.now() + 800;

    el.scrollTo({ top: el.scrollTop + top, behavior: "smooth" });

    return true;
  }

  return false;
}

function onWheel(e: WheelEvent) {
  const el = scroller.value;

  if (!el) return;

  if (handleWork(e, el)) e.preventDefault();
}

onMounted(() => {
  updateActive();

  toggleGroup(0);

  window.addEventListener("keydown", onKey);

  scroller.value!.addEventListener("wheel", onWheel, { passive: false });
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);

  scroller.value?.removeEventListener("wheel", onWheel);
});
</script>

<template>
  <div class="w-full h-screen bg-[#242424] flex flex-col items-center justify-start relative">
    <Nav :stage="stage" />

    <div
      ref="scroller"
      @scroll.passive="updateActive"
      class="w-full flex-1 min-h-0 scroll-smooth scrollbar-custom z-10 overflow-y-auto"
    >
      <section
        id="home"
        class="relative min-h-[100svh] md:h-screen w-full overflow-hidden"
        style="
          background: #242424;
          background:
            linear-gradient(
              to bottom,
              rgba(36, 36, 36, 0) 65%,
              rgba(36, 36, 36, 0.65) 85%,
              #242424 100%
            ),
            linear-gradient(
              134deg,
              rgba(36, 36, 36, 1) 11%,
              rgba(36, 36, 36, 1) 28%,
              rgba(102, 16, 16, 1) 51%,
              rgba(36, 36, 36, 1) 84%,
              rgba(36, 36, 36, 1) 95%
            );
        "
      >
        <div class="hidden md:flex absolute inset-0 flex-col justify-center items-start gap-3 px-5">
          <div
            v-reveal="0"
            class="flex flex-row flex-wrap justify-start items-center gap-x-2 gap-y-1"
          >
            <template v-for="(tag, i) in t.tags" :key="tag">
              <span v-if="i" class="text-xs text-gray-500"> · </span>

              <span
                v-if="i === t.tags.length - 1"
                class="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-400"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                {{ tag }}
              </span>

              <span v-else class="text-xs text-red-500 space-grotesk-text">
                {{ tag }}
              </span>
            </template>
          </div>

          <div
            v-reveal="100"
            class="w-full md:w-3/4 text-3xl sm:text-4xl text-white font-bold space-grotesk-text leading-tight"
          >
            {{ t.hero.title }}
          </div>

          <div
            v-reveal="200"
            class="w-full md:w-1/2 max-w-2xl text-base sm:text-lg md:text-sm text-gray-300 space-grotesk-text leading-relaxed"
          >
            {{ t.hero.subtitle }}
          </div>

          <div v-reveal="300" class="flex flex-row justify-start items-center gap-4">
            <a
              href="#work"
              class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300 space-grotesk-text cursor-pointer"
            >
              {{ t.hero.viewWork }}
            </a>

            <a
              href="/cv.pdf"
              @click.prevent="openPreview(t.hero.resume, '/cv.pdf')"
              class="bg-gray-700 text-red-500 py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-300 space-grotesk-text cursor-pointer"
            >
              {{ t.hero.resume }}
            </a>
          </div>
        </div>

        <div class="md:hidden relative min-h-[100svh] flex items-center overflow-hidden">
          <div
            class="absolute top-0 right-0 w-[75vw] h-[75vw] max-w-[600px] max-h-[600px] rounded-full bg-red-900/10 blur-[100px] pointer-events-none"
          ></div>

          <div
            class="relative z-10 w-full flex flex-col justify-center items-start px-6 pt-28 pb-20"
          >
            <div v-reveal="0" class="flex flex-wrap items-center gap-x-2 gap-y-2 mb-6">
              <template v-for="(tag, i) in t.tags" :key="tag">
                <span v-if="i" class="text-red-500 text-xs">·</span>
                <span class="text-red-500 text-xs space-grotesk-text">{{ tag }}</span>
              </template>
            </div>

            <h1
              v-reveal="100"
              class="w-full text-[clamp(2.5rem,10vw,5rem)] text-white font-bold leading-[1.08] tracking-tight space-grotesk-text"
            >
              {{ t.hero.title }}
            </h1>

            <p
              v-reveal="200"
              class="w-full max-w-xl mt-6 text-base sm:text-lg text-gray-300 leading-relaxed space-grotesk-text"
            >
              {{ t.hero.subtitle }}
            </p>

            <div v-reveal="300" class="w-full flex flex-wrap items-center gap-3 mt-8">
              <a
                href="#work"
                class="inline-flex items-center justify-center bg-red-500 text-white py-3 px-5 rounded-lg hover:bg-red-600 transition-colors duration-300 space-grotesk-text"
              >
                {{ t.hero.viewWork }}
              </a>

              <a
                href="/cv.pdf"
                @click.prevent="openPreview(t.hero.resume, '/cv.pdf')"
                class="inline-flex items-center justify-center bg-white/5 border border-white/10 text-gray-200 py-3 px-5 rounded-lg hover:bg-white/10 transition-colors duration-300 space-grotesk-text"
              >
                {{ t.hero.resume }}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section
        id="work"
        class="w-full min-h-screen h-fit md:h-screen flex flex-col gap-8 pt-20 pb-16 px-5 sm:px-8 md:px-10"
      >
        <div v-reveal class="flex flex-row items-end justify-between">
          <div class="flex flex-col gap-2">
            <div class="text-sm text-gray-400 space-grotesk-text">
              <span class="text-red-500">{{ labels.work.num }}</span>
              / {{ labels.work.rest }}
            </div>

            <h2 class="text-2xl md:text-2xl text-white font-bold space-grotesk-text">
              {{ t.work.title }}
            </h2>
          </div>

          <div class="hidden md:block text-sm text-gray-400 space-grotesk-text">
            {{ workIndex + 1 }} / {{ projects.length }}
          </div>
        </div>

        <div class="md:hidden flex flex-col gap-8">
          <article
            v-for="(p, i) in projects"
            :key="`mobile-${p.title}`"
            v-reveal="i * 100"
            class="w-full overflow-hidden rounded-xl border border-white/10 bg-[#2b2b2b]"
          >
            <div
              class="relative w-full min-h-[220px] bg-[#1e1e1e] flex items-center justify-center overflow-hidden p-5"
            >
              <div v-if="p.images?.length" class="w-full flex justify-center items-center gap-3">
                <img
                  v-for="(img, index) in p.images"
                  :key="index"
                  :src="img"
                  :alt="`${p.title} screenshot ${index + 1}`"
                  class="w-1/2 max-w-[180px] max-h-[300px] aspect-[9/19.5] object-contain rounded-lg shadow-xl"
                />
              </div>

              <img
                v-else-if="p.image"
                :src="p.image"
                :alt="p.title"
                class="w-full h-auto max-h-[350px] object-contain rounded-lg"
              />

              <div
                v-else
                class="w-full min-h-[200px] rounded-lg bg-red-950/50 border border-red-900/50 flex items-center justify-center text-sm text-red-200 text-center px-4"
              >
                {{ p.imageLabel }}
              </div>
            </div>

            <div class="w-full flex flex-col items-start gap-4 p-5">
              <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                <template v-for="(tag, ti) in p.tags" :key="tag">
                  <span v-if="ti" class="text-xs text-red-500 space-grotesk-text">·</span>

                  <span class="text-xs text-red-500 space-grotesk-text">
                    {{ tag }}
                  </span>
                </template>
              </div>

              <h3
                class="w-full text-xl sm:text-2xl text-white font-bold leading-snug break-words space-grotesk-text"
              >
                {{ p.title }}
              </h3>

              <p
                class="w-full text-sm sm:text-base text-gray-300 leading-relaxed space-grotesk-text"
              >
                {{ p.overview }}
              </p>

              <RouterLink
                class="group inline-flex items-center text-red-500 gap-2 space-grotesk-text hover:text-red-500 transition-colors duration-300 mt-1"
                :to="{ name: 'project', params: { slug: p.slug } }"
              >
                {{ t.work.open }}

                <span
                  class="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1"
                >
                  arrow_right_alt
                </span>
              </RouterLink>
            </div>
          </article>
        </div>

        <div class="hidden md:flex md:flex-1 md:min-h-0 md:flex-col md:overflow-hidden">
          <div class="flex-1 min-h-0 overflow-hidden">
            <div
              class="flex h-full transition-transform duration-700 ease-in-out"
              :style="{ transform: `translateX(-${workIndex * 100}%)` }"
            >
              <div
                v-for="(p, i) in projects"
                :key="p.title"
                class="w-full h-full shrink-0 flex items-center gap-5 transition-opacity duration-700 ease-in-out"
                :class="[
                  i % 2 === 0 ? 'flex-row' : 'flex-row-reverse',
                  workIndex === i ? 'opacity-100' : 'opacity-20',
                ]"
              >
                <div
                  class="w-full md:w-1/2 h-full max-h-[60vh] min-h-0 flex items-center justify-center overflow-hidden"
                >
                  <div
                    v-if="p.images?.length"
                    class="w-full flex justify-center items-center gap-4"
                  >
                    <img
                      v-for="(img, index) in p.images"
                      :key="index"
                      :src="img"
                      :alt="`${p.title} screenshot ${index + 1}`"
                      class="w-1/2 max-w-[220px] aspect-[9/19.5] object-cover rounded-lg transition-transform duration-300 hover:-translate-y-2"
                    />
                  </div>

                  <img
                    v-else-if="p.image"
                    :src="p.image"
                    :alt="p.title"
                    class="w-full h-full object-contain rounded-lg"
                  />

                  <div
                    v-else
                    class="w-full h-full min-h-[240px] rounded-lg bg-red-800 border border-red-500 flex items-center justify-center text-sm text-red-100 text-center px-4"
                  >
                    {{ p.imageLabel }}
                  </div>
                </div>

                <div class="w-full md:w-1/2 flex flex-col justify-center items-start gap-3 px-5">
                  <div class="flex flex-row flex-wrap items-center gap-2">
                    <template v-for="(tag, ti) in p.tags" :key="tag">
                      <span v-if="ti" class="text-xs text-red-500 space-grotesk-text">·</span>

                      <span class="text-xs text-red-500 space-grotesk-text">
                        {{ tag }}
                      </span>
                    </template>
                  </div>

                  <div class="text-3xl text-white w-5/6 font-bold space-grotesk-text">
                    {{ p.title }}
                  </div>

                  <div class="text-base text-gray-300 w-full space-grotesk-text">
                    {{ p.overview }}
                  </div>

                  <RouterLink
                    class="group flex flex-row items-center text-red-500 gap-2 space-grotesk-text hover:text-red-500 transition-all duration-300"
                    :to="{ name: 'project', params: { slug: p.slug } }"
                  >
                    {{ t.work.open }}

                    <span
                      class="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1"
                    >
                      arrow_right_alt
                    </span>
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-row justify-center gap-2 pt-4">
            <button
              v-for="(p, i) in projects"
              :key="p.title"
              type="button"
              @click="workIndex = i"
              :aria-label="`Show project ${i + 1}: ${p.title}`"
              class="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
              :class="workIndex === i ? 'w-6 bg-red-500' : 'w-1.5 bg-gray-600'"
            ></button>
          </div>
        </div>
      </section>

      <section
        id="experience"
        class="w-full h-fit flex flex-col md:flex-row justify-start items-start gap-8 md:gap-12 py-16 px-5 md:px-10"
      >
        <div v-reveal class="w-full md:w-[30%] flex flex-col gap-2">
          <div class="text-sm text-gray-400 space-grotesk-text">
            <span class="text-red-500">{{ labels.experience.num }}</span> /

            {{ labels.experience.rest }}
          </div>

          <h2 class="text-3xl text-white font-bold space-grotesk-text">{{ t.experience.title }}</h2>
        </div>

        <div class="w-full md:w-[70%] flex flex-col gap-3">
          <div v-for="(g, gi) in groups" :key="g.title" v-reveal="gi * 120" class="group/item">
            <button
              type="button"
              @click="toggleGroup(gi)"
              :aria-expanded="openGroup === gi"
              class="relative w-full flex flex-row items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer group"
            >
              <h3
                class="text-xl font-bold space-grotesk-text group-hover:text-red-500 transition-colors duration-300"
                :class="openGroup === gi ? 'text-red-500' : 'text-white'"
              >
                {{ g.title }}
              </h3>

              <span
                class="material-symbols-outlined text-red-500 transition-transform duration-300"
                :class="openGroup === gi ? 'rotate-180' : ''"
              >
                keyboard_arrow_down
              </span>

              <span
                class="absolute bottom-0 left-0 h-px w-full bg-red-500 origin-left transition-transform duration-500 ease-in-out group-hover:scale-x-100"
                :class="openGroup === gi ? 'scale-x-100' : 'scale-x-0'"
              ></span>
            </button>

            <div
              class="grid transition-[grid-template-rows] duration-300 ease-in-out"
              :class="openGroup === gi ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
            >
              <div class="overflow-hidden">
                <div
                  v-for="item in g.items"
                  :key="item.title"
                  class="flex flex-col gap-1 py-6 px-5"
                >
                  <span class="text-sm text-gray-400 space-grotesk-text">{{ item.waktu }}</span>

                  <h4 class="text-lg text-white font-bold space-grotesk-text">{{ item.title }}</h4>

                  <div
                    v-if="
                      g.title == 'Certifications' ||
                      g.title == 'Internships and Organization Experience'
                    "
                    class="flex flex-col justify-start w-full items-start gap-2"
                  >
                    <p class="text-base text-gray-300 space-grotesk-text">{{ item.desc }}</p>

                    <a
                      :href="`/sertif/${item.title}.pdf`"
                      @click.prevent="openPreview(item.title, `/sertif/${item.title}.pdf`)"
                      class="bg-gray-700 text-red-500 py-2 px-4 rounded hover:bg-gray-800 space-grotesk-text cursor-pointer flex flex-row justify-start items-center gap-2"
                    >
                      <i class="fa-regular fa-file-lines"></i>

                      {{ t.cert.label }}
                    </a>
                  </div>

                  <p v-else class="text-base text-gray-300 space-grotesk-text">{{ item.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="stack"
        class="w-full h-fit flex flex-col md:flex-row justify-start items-start gap-8 md:gap-12 py-16 px-5 md:px-10"
      >
        <div v-reveal class="w-full md:w-[30%] flex flex-col gap-2">
          <div class="text-sm text-gray-400 space-grotesk-text">
            <span class="text-red-500">{{ labels.stack.num }}</span> / {{ labels.stack.rest }}
          </div>

          <h2 class="text-3xl text-white font-bold space-grotesk-text">{{ t.stack.title }}</h2>
        </div>

        <div class="w-full md:w-[70%] flex flex-col gap-6">
          <div
            v-for="(g, gi) in skill"
            :key="g.group"
            v-reveal="gi * 120"
            class="flex flex-col sm:flex-row sm:items-center gap-3"
          >
            <span class="w-44 shrink-0 text-sm text-gray-400 space-grotesk-text">{{
              g.group
            }}</span>

            <div class="flex flex-row flex-wrap gap-2">
              <span
                v-for="item in g.items"
                :key="item"
                class="text-sm text-red-500 border border-gray-500 rounded px-3 py-1 space-grotesk-text transition-colors duration-300 hover:border-red-500 cursor-default"
              >
                {{ item }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" class="w-full h-fit flex flex-col gap-6 py-5 px-5 md:px-10">
        <div v-reveal class="text-sm text-gray-400 space-grotesk-text">
          <span class="text-red-500">{{ labels.contact.num }}</span> / {{ labels.contact.rest }}
        </div>

        <h2
          v-reveal="100"
          class="text-3xl md:text-5xl text-white font-bold w-full md:w-3/4 leading-tight space-grotesk-text"
        >
          {{ t.contact.title }}
        </h2>

        <div class="flex flex-row flex-wrap gap-6 text-base">
          <div v-for="(c, ci) in contacts" :key="c.label" v-reveal="200 + ci * 100">
            <a
              :href="c.href"
              @click="c.preview && ($event.preventDefault(), openPreview(c.label, c.preview))"
              class="text-red-500 underline underline-offset-4 hover:text-red-800 space-grotesk-text flex flex-row justify-start items-center gap-2"
            >
              <i :class="c.icon"></i>

              {{ c.label }}
            </a>
          </div>
        </div>

        <div v-reveal="600" class="text-sm text-gray-400 mt-8 space-grotesk-text">
          © 2026 Rafi Pasya
        </div>
      </section>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="preview"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        role="dialog"
        aria-modal="true"
        @click.self="closePreview"
      >
        <div
          class="w-full max-w-4xl h-[85vh] bg-[#242424] border border-red-900 rounded-lg flex flex-col overflow-hidden"
        >
          <div
            class="flex flex-row items-center justify-between gap-4 px-5 py-3 border-b border-gray-700"
          >
            <h3 class="text-base text-white font-bold truncate space-grotesk-text">
              {{ preview.title }}
            </h3>

            <div class="flex flex-row items-center gap-3 shrink-0">
              <a
                :href="preview.src"
                :download="`${preview.title}.pdf`"
                class="bg-red-500 text-white py-1.5 px-3 rounded hover:bg-red-600 space-grotesk-text flex flex-row items-center gap-2 text-sm"
              >
                <i class="fa-solid fa-download"></i>

                Download
              </a>

              <button
                type="button"
                @click="closePreview"
                aria-label="Close"
                class="text-gray-300 hover:text-red-500 cursor-pointer flex"
              >
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
          </div>

          <iframe :src="preview.src" :title="preview.title" class="flex-1 w-full bg-white"></iframe>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.reveal {
  opacity: 0;

  transform: translateY(24px);

  transition:
    opacity 0.7s ease,
    transform 0.7s ease;
}

.reveal-in {
  opacity: 1;

  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;

    transform: none;

    transition: none;
  }
}
</style>
