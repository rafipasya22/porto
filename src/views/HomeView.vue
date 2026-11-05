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
const heroTranslate = ref(false);
let touchY = 0;
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

function unlock() {
  heroTranslate.value = true;
  stage.value = 1;
}

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
}

function stepWork(dir: 1 | -1) {
  workIndex.value += dir;
  wheelLock = Date.now() + 700;
}

function handleWork(e: WheelEvent, el: HTMLElement): boolean {
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

function goSecond() {
  if (heroTranslate.value) return;
  heroTranslate.value = true;
  setTimeout(() => (stage.value = 1), 700);
}

function backToFirst() {
  stage.value = 0;
  heroTranslate.value = false;
  scroller.value?.scrollTo({ top: 0, behavior: "smooth" });
}

function onWheel(e: WheelEvent) {
  const el = scroller.value;
  if (!el) return;

  if (stage.value === 0) {
    e.preventDefault();
    if (e.deltaY > 0) goSecond();
    return;
  }

  if (handleWork(e, el)) {
    e.preventDefault();
    return;
  }

  if (e.deltaY < 0 && el.scrollTop <= 10) {
    e.preventDefault();
    backToFirst();
  }
}
function onTouchStart(e: TouchEvent) {
  touchY = e.touches[0]!.clientY;
}

function onTouchMove(e: TouchEvent) {
  const el = scroller.value;
  if (!el) return;
  const dy = touchY - e.touches[0]!.clientY;
  if (stage.value === 0) {
    e.preventDefault();
    if (dy > 30) goSecond();
  } else if (dy < -30 && el.scrollTop <= 10) {
    e.preventDefault();
    backToFirst();
  }
}

onMounted(() => {
  updateActive();
  window.addEventListener("keydown", onKey);
  const el = scroller.value!;
  el.addEventListener("wheel", onWheel, { passive: false });
  el.addEventListener("touchstart", onTouchStart, { passive: true });
  el.addEventListener("touchmove", onTouchMove, { passive: false });
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKey);
  const el = scroller.value;
  if (!el) return;
  el.removeEventListener("wheel", onWheel);
  el.removeEventListener("touchstart", onTouchStart);
  el.removeEventListener("touchmove", onTouchMove);
});
</script>

<template>
  <div class="w-full h-screen bg-[#242424] flex flex-col items-center justify-start relative">
    <Nav :stage="stage" />
    <div
      ref="scroller"
      @scroll.passive="updateActive"
      class="w-full flex-1 min-h-0 scroll-smooth scrollbar-custom z-10"
      :class="stage === 0 ? 'overflow-hidden' : 'overflow-y-auto'"
    >
      <section
        id="home"
        class="h-screen relative overflow-hidden"
        style="
          background: #242424;
          background: linear-gradient(
            134deg,
            rgba(36, 36, 36, 1) 11%,
            rgba(36, 36, 36, 1) 28%,
            rgba(102, 16, 16, 1) 51%,
            rgba(36, 36, 36, 1) 84%,
            rgba(36, 36, 36, 1) 95%
          );
        "
      >
        <div
          class="absolute inset-0 flex flex-col justify-center items-start gap-3 px-5 transition-transform duration-700 ease-in-out"
          :class="heroTranslate ? '-translate-y-full' : 'translate-y-0'"
        >
          <div v-reveal="0" class="flex flex-row justify-start items-center gap-2">
            <template v-for="(tag, i) in t.tags" :key="tag">
              <span v-if="i" class="text-xs text-red-700 space-grotesk-text">·</span>
              <span class="text-xs text-red-700 space-grotesk-text">{{ tag }}</span>
            </template>
          </div>
          <div v-reveal="100" class="text-4xl text-white w-3/4 font-bold space-grotesk-text">
            {{ t.hero.title }}
          </div>
          <div v-reveal="200" class="text-sm text-gray-300 w-1/2 space-grotesk-text">
            {{ t.hero.subtitle }}
          </div>
          <div v-reveal="300" class="flex flex-row justify-start items-center gap-4">
            <a
              href="#work"
              @click="unlock"
              class="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300 space-grotesk-text cursor-pointer"
            >
              {{ t.hero.viewWork }}
            </a>
            <a
              href="/cv.pdf"
              @click.prevent="openPreview(t.hero.resume, '/cv.pdf')"
              class="bg-gray-700 text-red-500 py-2 px-4 rounded hover:bg-gray-800 transition-colors duration-300 space-grotesk-text cursor-pointer"
            >
              {{ t.hero.resume }}
            </a>
          </div>
        </div>

        <div
          class="absolute inset-0 flex flex-col justify-center items-start gap-4 px-5 transition-transform duration-700 ease-in-out"
          :class="heroTranslate ? 'translate-y-0' : 'translate-y-full'"
        >
          <h2 v-reveal="200" class="text-4xl text-white font-bold w-3/4 space-grotesk-text">
            {{ t.hero2.title }}
          </h2>
          <p v-reveal="350" class="text-lg text-gray-300 w-1/2 space-grotesk-text">
            {{ t.hero2.subtitle }}
          </p>
          <div class="flex flex-row gap-10 mt-4">
            <div
              v-for="(s, si) in t.hero2.stats"
              :key="s.label"
              v-reveal="500 + si * 150"
              class="flex flex-col gap-1"
            >
              <span class="text-3xl text-red-700 font-bold space-grotesk-text">{{ s.value }}</span>
              <span class="text-sm text-gray-300 space-grotesk-text">{{ s.label }}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="work" class="w-full h-screen flex flex-col gap-6 pt-20 pb-8 px-5 md:px-10">
        <div v-reveal class="flex flex-row items-end justify-between">
          <div class="flex flex-col gap-2">
            <div class="text-sm text-gray-600 space-grotesk-text">
              <span class="text-red-700">{{ labels.work.num }}</span> / {{ labels.work.rest }}
            </div>
            <h2 class="text-xl md:text-2xl text-white font-bold space-grotesk-text">
              {{ t.work.title }}
            </h2>
          </div>
          <div class="text-sm text-gray-600 space-grotesk-text">
            {{ workIndex + 1 }} / {{ projects.length }}
          </div>
        </div>

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
              <div class="w-full md:w-1/2 h-full max-h-[60vh] flex items-center">
                <div v-if="p.images?.length" class="w-full flex justify-center items-center gap-4">
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
                  class="w-full h-full object-cover rounded-lg"
                />
                <div
                  v-else
                  class="w-full h-full min-h-[240px] rounded-lg bg-red-800 border border-red-400 flex items-center justify-center text-sm text-red-100 text-center px-4"
                >
                  {{ p.imageLabel }}
                </div>
              </div>

              <div class="w-full md:w-1/2 flex flex-col justify-center items-start gap-3 px-5">
                <div class="flex flex-row items-center gap-2">
                  <template v-for="(tag, ti) in p.tags" :key="tag">
                    <span v-if="ti" class="text-xs text-red-700 space-grotesk-text">·</span>
                    <span class="text-xs text-red-700 space-grotesk-text">{{ tag }}</span>
                  </template>
                </div>
                <div class="text-3xl text-white w-5/6 font-bold space-grotesk-text">
                  {{ p.title }}
                </div>
                <div class="text-base text-gray-300 w-full space-grotesk-text">
                  {{ p.overview }}
                </div>
                <RouterLink
                  class="group flex flex-row items-center text-red-700 gap-2 space-grotesk-text hover:text-red-500 transition-all duration-300"
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

        <div v-reveal="200" class="flex flex-row justify-center gap-2">
          <button
            v-for="(p, i) in projects"
            :key="p.title"
            type="button"
            @click="workIndex = i"
            class="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
            :class="workIndex === i ? 'w-6 bg-red-700' : 'w-1.5 bg-gray-600'"
          ></button>
        </div>
      </section>
      <section
        id="experience"
        class="w-full h-fit flex flex-col md:flex-row justify-start items-start gap-8 md:gap-12 py-16 px-5 md:px-10"
      >
        <div v-reveal class="w-full md:w-[30%] flex flex-col gap-2">
          <div class="text-sm text-gray-600 space-grotesk-text">
            <span class="text-red-700">{{ labels.experience.num }}</span> /
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
                class="material-symbols-outlined text-red-700 transition-transform duration-300"
                :class="openGroup === gi ? 'rotate-180' : ''"
              >
                keyboard_arrow_down
              </span>

              <span
                class="absolute bottom-0 left-0 h-px w-full bg-red-700 origin-left transition-transform duration-500 ease-in-out group-hover:scale-x-100"
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
                  <span class="text-sm text-gray-600 space-grotesk-text">{{ item.waktu }}</span>
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
          <div class="text-sm text-gray-600 space-grotesk-text">
            <span class="text-red-700">{{ labels.stack.num }}</span> / {{ labels.stack.rest }}
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
            <span class="w-44 shrink-0 text-sm text-gray-600 space-grotesk-text">{{
              g.group
            }}</span>
            <div class="flex flex-row flex-wrap gap-2">
              <span
                v-for="item in g.items"
                :key="item"
                class="text-sm text-red-700 border border-gray-300 rounded px-3 py-1 space-grotesk-text transition-colors duration-300 hover:border-red-700"
              >
                {{ item }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" class="w-full h-fit flex flex-col gap-6 py-5 px-5 md:px-10">
        <div v-reveal class="text-sm text-gray-600 space-grotesk-text">
          <span class="text-red-700">{{ labels.contact.num }}</span> / {{ labels.contact.rest }}
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
              class="text-red-700 underline underline-offset-4 hover:text-red-800 space-grotesk-text flex flex-row justify-start items-center gap-2"
            >
              <i :class="c.icon"></i>
              {{ c.label }}
            </a>
          </div>
        </div>
        <div v-reveal="600" class="text-sm text-gray-600 mt-8 space-grotesk-text">
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
                class="bg-red-700 text-white py-1.5 px-3 rounded hover:bg-red-600 space-grotesk-text flex flex-row items-center gap-2 text-sm"
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