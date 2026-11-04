interface ProjectText {
  overview: string;
  description: string;
  problem: string;
  timeline: { start: string; end: string };
  improvements: string[];
  architecture: { description: string };
}

export const projectsId: Record<string, ProjectText> = {
  etch: {
    overview:
      "Tulis program Arduino dan ESP32 dengan blok atau kode, lalu flash langsung dari browser, supaya pemula bisa fokus ke logika algoritma, bukan syntax. API compile-nya dibangun dengan FastAPI dan arduino-cli, dengan clangd lewat WebSocket untuk fitur editor.",
    description:
      "Tulis program Arduino dan ESP32 dengan blok atau kode, lalu flash langsung dari browser, supaya pemula bisa fokus ke logika algoritma, bukan syntax. API compile-nya dibangun dengan FastAPI dan arduino-cli, dengan clangd lewat WebSocket untuk fitur editor. Mendukung core AVR dan ESP32, layanan compile berjalan di Docker, dan frontend Vue di-host di Vercel.",
    problem:
      "Waktu menyusun kurikulum robotika untuk siswa SD dan SMP di Afterschola, saya melihat pemula lebih dulu pusing dengan syntax sebelum sempat memikirkan logikanya: kurang satu tanda kurung atau titik koma saja, programnya sudah error. IDE biasa seperti Arduino IDE hanya berbasis teks dan tidak punya fitur blok, jadi siswa akhirnya sibuk memperbaiki tanda baca, bukan belajar cara kerja algoritma. Etch saya buat untuk mengatasi itu: editor berbasis blok yang bisa langsung meng-upload program ke mikrokontroler dari browser, supaya siswa bisa fokus ke logika algoritma, bukan syntax.",
    timeline: { start: "September 2026", end: "Oktober 2026" },
    improvements: [
      "Pindahkan backend compile dari komputer pribadi ke hosting terkelola, supaya demo online-nya selalu tersedia.",
      "Dukung lebih banyak board dan core selain AVR dan ESP32.",
    ],
    architecture: {
      description:
        "Editor berbasis Vue 3 + TypeScript berjalan di Vercel. Sketch dikirim ke service FastAPI yang meng-compile-nya dengan arduino-cli (core AVR dan ESP32) di dalam Docker. Language server clangd berjalan lewat WebSocket untuk memberi diagnostik dan autocompletion di editor. Firmware hasil compile dikirim balik ke browser, lalu browser mem-flash board lewat serial.",
    },
  },
  orphic: {
    overview:
      "CRNN pada Mel-spectrogram untuk mengklasifikasikan musik buatan AI atau manusia. Akurasi 95.6% in-domain dan 82.5% out-of-domain, dengan aplikasi web yang menampilkan prediksi dan skor kepercayaan.",
    description:
      "CRNN pada Mel-spectrogram untuk mengklasifikasikan musik buatan AI atau manusia. Akurasi 95.6% in-domain dan 82.5% out-of-domain. Backend FastAPI menangani preprocessing audio dan inferensi, sedangkan aplikasi web Vue menampilkan prediksi, skor kepercayaan, dan spektrogram, sekaligus menyorot segmen audio yang informatif.",
    problem:
      "Generator musik AI sekarang menghasilkan lagu yang sulit dibedakan dari rekaman manusia, dan belum ada cara sederhana bagi pendengar, musisi, atau platform untuk memeriksa asal sebuah lagu. Detektor juga biasanya hanya bagus untuk generator yang dipakai saat training, jadi cepat usang begitu muncul generator baru. Orphic dibuat dengan masalah kedua itu sebagai fokus: model diuji pada generator yang tidak ada di data training (akurasi out-of-domain 82.5%, dibanding 95.6% in-domain) untuk melihat seberapa baik pendekatannya bertahan.",
    timeline: { start: "Februari 2026", end: "Juli 2026" },
    improvements: [
      "Perkecil selisih akurasi in-domain (95.6%) dan out-of-domain (82.5%) dengan melatih model pada lebih banyak generator musik AI dan rekaman manusia yang lebih beragam.",
      "Kalibrasi skor kepercayaan dan tambahkan rentang 'tidak yakin' untuk mengurangi false positive.",
      "Kenali generator yang membuat sebuah lagu, bukan sekadar apakah lagu itu buatan AI.",
    ],
    architecture: {
      description:
        "Audio yang diunggah dinormalisasi, dipotong, lalu diubah jadi Mel-spectrogram oleh backend FastAPI. CRNN kemudian mengklasifikasikannya: lapisan konvolusi menangkap pola spektral lokal, sedangkan lapisan rekuren memodelkan perubahannya dari waktu ke waktu. Hasilnya berupa prediksi AI atau manusia beserta skor kepercayaan. Frontend Vue 3 + TypeScript menampilkan hasilnya, dan Supabase mengurus akun, penyimpanan, dan riwayat prediksi.",
    },
  },
  tsumari: {
    overview:
      "Aplikasi mobile yang mengubah rekaman jadi transkrip dan ringkasan per bab. Pipeline job asinkron dengan faster-whisper, pembagian bab berbasis embedding, dan ringkasan dari LLM.",
    description:
      "Aplikasi mobile yang mengubah rekaman jadi transkrip dan ringkasan per bab. Audio dipotong dengan ffmpeg dan ditranskripsi dengan faster-whisper, bab dibentuk dengan embedding, dan LLM (Groq) menulis judul serta ringkasan tiap bab. Aplikasi mengecek API job asinkron untuk status, progres, dan transkrip.",
    problem:
      "Kuliah dan podcast itu panjang, dan untuk mencari satu bagian tertentu kita harus menggeser-geser audio berjam-jam. Transkrip mentah juga belum cukup membantu: isinya cuma tembok teks tanpa struktur. Tsumari mengubah rekaman jadi bab-bab dengan judul dan ringkasan singkat, jadi kita bisa langsung tahu isi rekaman dan menemukan bagian yang dicari.",
    timeline: { start: "September 2026", end: "Oktober 2026" },
    improvements: [
      "Tambahkan autentikasi per pengguna dan rate limiting pada API job.",
      "Ukur kualitas bab dan ringkasan dibandingkan dengan referensi tulisan manusia.",
      "Ekspor ringkasan sebagai Markdown atau PDF.",
    ],
    architecture: {
      description:
        "Aplikasi React Native (Expo) mengunggah rekaman ke endpoint FastAPI, yang langsung mengembalikan job ID. Worker polling mengambil job dari antrean asinkron, memotong audio dengan ffmpeg, mentranskripsikannya dengan faster-whisper, mengelompokkan transkrip jadi bab lewat embedding, lalu meminta LLM (Groq) membuat judul dan ringkasan tiap bab. Aplikasi memantau status dan progres job, lalu mengambil transkrip dan ringkasannya.",
    },
  },
};
