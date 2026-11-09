import { computed } from "vue";
import { lang } from "./lang.ts";

const en = {
  nav: { work: "Work", experience: "Activities", stack: "Stack", contact: "Contact" },
  tags: ["Computer Engineering", "Bandung", "Open To Work"],
  hero: {
    title: "Fullstack developer with a machine learning and embedded background.",
    subtitle:
      "Computer Engineering fresh graduate with experience in IoT, fullstack web development and machine learning. Built a web app with a deep learning model that detects AI-generated music at 95.6% accuracy. Comfortable with Python, FastAPI, Vue.js and Docker, building and deploying apps end to end.",
    viewWork: "View My Work",
    resume: "Download Resume",
  },
  hero2: {
  title: "From sensors to servers to models.",
  subtitle:
    "I like building things end to end: reading data from hardware, training models on it, and shipping it as a web app people can actually use.",
  stats: [
    { value: "95.6%", label: "AI-music detection accuracy" },
    { value: "48", label: "robotics & Python modules designed" },
    { value: "2", label: "internships, end to end builds" },
  ],
},
  work: {
    label: "01 / Recent Works",
    title: "Recent Projects I've Worked On",
    open: "Open Project",
  },
  cert: { label: "See Certificate" },
  experience: { label: "02 / Activities", title: "What I've been up to" },
  stack: { label: "03 / Stack", title: "What I use" },
  contact: {
    label: "04 / Contact",
    title: "Looking for an AI or software engineering role. Let's talk.",
    resume: "Resume (PDF)",
  },
  experiences: [
    {
      company: "Afterschola",
      pos: "Robotics Team Intern",
      waktu: "Sep 2025 - Dec 2025",
      desc: "Designed 48 robotics and Python curriculum modules for elementary and middle school, and trained 6-8 internal staff in IoT basics.",
    },
    {
      company: "Winnicode Garuda Teknologi (Remote)",
      pos: "Fullstack Developer Intern",
      waktu: "Feb 2025 - Jun 2025",
      desc: "Built a news portal end to end with Vue.js and FastAPI, including a parallel asyncio home endpoint and spaCy-based personalized recommendations.",
    },
    {
      company: "Himpunan Mahasiswa Teknik Komputer",
      pos: "Student Advocacy and Welfare Staff",
      waktu: "Feb 2024 - Jan 2025",
      desc: "As a staff member of the Student Advocacy and Welfare division, I was responsible for processing tuition deferrals for active students and reductions for incoming freshmen.",
    },
  ],
  certificates: [
    {
      Title: "Belajar Machine Learning untuk Pemula",
      Issuer: "Dicoding Indonesia",
      DateStart: "29th June 2025",
      DateEnd: "29th June 2028",
    },
    {
      Title: "Belajar Dasar Structured Query Language (SQL)",
      Issuer: "Dicoding Indonesia",
      DateStart: "15th August 2024",
      DateEnd: "15th August 2027",
    },
    {
      Title: "Belajar Dasar Pemrograman Web",
      Issuer: "Dicoding Indonesia",
      DateStart: "27th May 2024",
      DateEnd: "27th May 2027",
    },
    {
      Title: "Memulai Pemrograman dengan Python",
      Issuer: "Dicoding Indonesia",
      DateStart: "27th May 2025",
      DateEnd: "27th May 2028",
    },
    {
      Title: "Belajar Dasar AI",
      Issuer: "Dicoding Indonesia",
      DateStart: "4th July 2024",
      DateEnd: "4th July 2027",
    },
    {
      Title: "Belajar Dasar Visualisasi Data",
      Issuer: "Dicoding Indonesia",
      DateStart: "18th July 2024",
      DateEnd: "18th July 2027",
    },
  ],
  project: {
    back: "Back to Home",
    details: "Project Details",
    demo: "Live Demo",
    github: "Github",
    timeline: "Timeline",
    stack: "Tech Stack",
    problem: "Problem",
    architecture: "Architecture",
    next: "What Would I Do Next",
    warning:
      "The backend for this project is currently not hosted, so the live demo is unavailable. The frontend is still viewable.",
  },
};

const id: typeof en = {
  nav: { work: "Proyek", experience: "Aktivitas", stack: "Teknologi", contact: "Kontak" },
  tags: ["Teknik Komputer", "Bandung", "Siap Bekerja"],
  hero: {
    title:
      "Fullstack developer dengan latar belakang di bidang machine learning dan sistem tertanam.",
    subtitle:
      "Fresh graduate Teknik Komputer dengan pengalaman di bidang IoT, fullstack web development, dan machine learning. Pernah membangun aplikasi web dengan model deep learning untuk mendeteksi musik buatan AI dengan akurasi 95.6%. Terbiasa memakai Python, FastAPI, Vue.js, dan Docker untuk membangun dan men-deploy aplikasi secara end-to-end.",
    viewWork: "Lihat Proyek Saya",
    resume: "Unduh CV",
  },hero2: {
  title: "Dari sensor, ke server, sampai model.",
  subtitle:
    "Saya suka membangun sesuatu secara end-to-end: membaca data dari hardware, melatih model dengannya, lalu merilisnya sebagai aplikasi web yang benar-benar bisa dipakai.",
  stats: [
    { value: "95.6%", label: "akurasi deteksi musik AI" },
    { value: "48", label: "modul robotika & Python dirancang" },
    { value: "2", label: "magang, membangun end-to-end" },
  ],
},
  work: {
    label: "01 / Proyek Terbaru",
    title: "Proyek yang Baru Saya Kerjakan",
    open: "Lihat Proyek",
  },
  experience: {
    label: "02 / Aktivitas",
    title: "Apa saja yang sudah saya kerjakan",
  },
  stack: { label: "03 / Teknologi", title: "Yang saya pakai" },
  contact: {
    label: "04 / Kontak",
    title: "Sedang mencari posisi di bidang AI atau software engineering. Yuk, ngobrol!",
    resume: "CV (PDF)",
  },
  cert: { label: "Lihat Sertifikat" },
  experiences: [
    {
      company: "Afterschola",
      pos: "Robotics Team Intern",
      waktu: "September 2025 - Desember 2025",
      desc: "Merancang 48 modul kurikulum robotika dan Python untuk siswa SD dan SMP, serta melatih 6-8 staf internal dalam dasar-dasar IoT.",
    },
    {
      company: "Winnicode Garuda Teknologi (Remote)",
      pos: "Fullstack Developer Intern",
      waktu: "Feb 2025 - Jun 2025",
      desc: "Membangun portal berita end-to-end dengan Vue.js dan FastAPI, termasuk endpoint beranda paralel berbasis asyncio dan rekomendasi berita personal dengan spaCy.",
    },
    {
      company: "Himpunan Mahasiswa Teknik Komputer",
      pos: "Student Advocacy and Welfare Staff",
      waktu: "Feb 2024 - Jan 2025",
      desc: "Sebagai staf divisi Advokasi dan Kesejahteraan Mahasiswa, saya bertanggung jawab memproses penundaan pembayaran UKT bagi mahasiswa aktif serta keringanan UKT bagi mahasiswa baru.",
    },
  ],
  certificates: [
    {
      Title: "Belajar Machine Learning untuk Pemula",
      Issuer: "Dicoding Indonesia",
      DateStart: "29 Juni 2025",
      DateEnd: "29 Juni 2028",
    },
    {
      Title: "Belajar Dasar Structured Query Language (SQL)",
      Issuer: "Dicoding Indonesia",
      DateStart: "15 Agustus 2024",
      DateEnd: "15 Agustus 2027",
    },
    {
      Title: "Belajar Dasar Pemrograman Web",
      Issuer: "Dicoding Indonesia",
      DateStart: "27 Mei 2024",
      DateEnd: "27 Mei 2027",
    },
    {
      Title: "Memulai Pemrograman dengan Python",
      Issuer: "Dicoding Indonesia",
      DateStart: "27 Mei 2025",
      DateEnd: "27 Mei 2028",
    },
    {
      Title: "Belajar Dasar AI",
      Issuer: "Dicoding Indonesia",
      DateStart: "4 Juli 2024",
      DateEnd: "4 Juli 2027",
    },
    {
      Title: "Belajar Dasar Visualisasi Data",
      Issuer: "Dicoding Indonesia",
      DateStart: "18 Juli 2024",
      DateEnd: "18 Juli 2027",
    },
  ],
  project: {
    back: "Kembali ke Beranda",
    details: "Detail Proyek",
    demo: "Live Demo",
    github: "Github",
    timeline: "Waktu Pengerjaan",
    stack: "Teknologi",
    problem: "Masalah",
    architecture: "Arsitektur",
    next: "Rencana Selanjutnya",
    warning:
      "Backend untuk proyek ini saat ini tidak dihosting, sehingga demo langsung tidak tersedia. Frontend masih dapat dilihat.",
  },
};

const messages = { en, id };

export const t = computed(() => messages[lang.value]);
