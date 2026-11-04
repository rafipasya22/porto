import { computed } from "vue";
import { projects } from "./projects.ts";
import { projectsId } from "./projectsId.ts";
import { lang } from "./lang.ts";

export const localizedProjects = computed(() => {
  if (lang.value !== "id") return projects;
  return projects.map((p) => {
    const tr = projectsId[p.slug];
    if (!tr) return p;
    return {
      ...p,
      ...tr,
      overview: tr.overview,
      timeline: { ...p.timeline, ...tr.timeline },
      architecture: { ...p.architecture, ...tr.architecture },
    };
  });
});