import demo from "../assets/demo.mp4";
interface Project {
  title: string;
  tags: string[];
  description: string;
  stack: string[];
  image?: string;
  images?: string[];
  imageLabel: string;
  video?: string;
  videos?: string[];
  slug: string;
  problem: string;
  overview: string;
  timeline: {
    start: string;
    end: string;
  };
  links: {
    demo?: string;
    github?: string;
  };
  improvements: string[];
  architecture: {
    diagram?: string;
    description?: string;
  };
}

export const projects: Project[] = [
  {
    title: "Etch: flash firmware from your browser",
    tags: ["Web", "Embedded"],
    overview:
      "Write Arduino and ESP32 programs with blocks or code and flash them straight from the browser, so beginners can focus on algorithm logic instead of syntax. FastAPI compile API on arduino-cli, with clangd over WebSocket for editor features.",
    stack: ["Vue.js", "TypeScript", "FastAPI", "Docker", "Supabase"],
    image: "/EtchBlock.png",
    imageLabel: "/demo.gif",
    slug: "etch",
    videos: ["/demo.mp4"],
    problem:
      "While designing a robotics curriculum for elementary and middle school students at Afterschola, I saw that beginners get stuck on text syntax long before they reach the logic: a missing bracket or semicolon is enough to stop a program. Regular IDEs such as the Arduino IDE are text-only and have no block-based mode, so students end up debugging punctuation instead of learning how algorithms work. I built Etch to fix that: a block-based editor that uploads straight to the microcontroller from the browser, so students can focus on algorithm logic instead of syntax.",
    timeline: {
      start: "September 2026",
      end: "October 2026",
    },
    links: {
      demo: "https://etch-murex.vercel.app",
      github: "https://github.com/rafipasya22/etch",
    },
    improvements: [
      "Move the compile backend off a personal machine to managed hosting, so the live demo stays available.",
      "Support more boards and cores beyond AVR and ESP32.",
    ],
    architecture: {
      diagram: "/Untitled.svg",
      description:
        "A Vue 3 + TypeScript editor runs on Vercel. Sketches are sent to a FastAPI service that compiles them with arduino-cli (AVR and ESP32 cores) inside Docker. A clangd language server runs behind a WebSocket and provides editor diagnostics and completions. The compiled firmware is returned to the browser, which flashes the board over serial.",
    },
    description:
      "Write Arduino and ESP32 programs with blocks or code and flash them straight from the browser, so beginners can focus on algorithm logic instead of syntax. FastAPI compile API on arduino-cli, with clangd over WebSocket for editor features. Supports the AVR and ESP32 cores, runs the compile service in Docker, and serves the Vue frontend from Vercel.",
  },
  {
    title: "Orphic: AI music detector",
    tags: ["Machine Learning", "Web"],
    overview:
      "CRNN on Mel-spectrograms that classifies music as AI-generated or human-made. 95.6% in-domain and 82.5% out-of-domain accuracy, with a web app that shows the prediction and confidence score.",
    stack: ["TensorFlow", "FastAPI", "Vue.js", "Supabase", "Docker"],
    image: "/Orphic.png",
    imageLabel: "/Orphic.png",
    slug: "orphic",
    problem:
      "AI music generators now produce tracks that can be hard to tell apart from human recordings, and there is no simple way for a listener, an artist or a platform to check where a track came from. Detectors also tend to work well only on the generators they were trained on, so they go stale as soon as a new generator appears. Orphic is built around that second issue: it is tested on generators that were not in the training data (82.5% out-of-domain accuracy, against 95.6% in-domain) to show how well the approach holds up.",
    timeline: {
      start: "February 2026",
      end: "July 2026",
    },
    links: {
      demo: "https://orphic-six.vercel.app/",
      github: "https://github.com/rafipasya22/orphic",
    },
    improvements: [
      "Close the gap between in-domain (95.6%) and out-of-domain (82.5%) accuracy by training on more AI music generators and more varied human recordings.",
      "Calibrate the confidence score and add an 'uncertain' range to reduce false positives.",
      "Identify which generator produced a track, not only whether it is AI-made.",
    ],
    architecture: {
      diagram: "/orphic-architecture.svg",
      description:
        "Uploaded audio is normalized, sliced and converted to Mel-spectrograms by a FastAPI backend. A CRNN then classifies it: convolutional layers extract local spectral patterns and recurrent layers model how they evolve over time, producing an AI-or-human prediction with a confidence score. The Vue 3 + TypeScript frontend shows the result, and Supabase handles accounts, storage and prediction history.",
    },
    description:
      "CRNN on Mel-spectrograms that classifies music as AI-generated or human-made. 95.6% in-domain and 82.5% out-of-domain accuracy. The FastAPI backend handles audio preprocessing and inference, and the Vue web app shows the prediction, confidence score and spectrogram, highlighting which audio segments were informative.",
  },
  {
    title: "Tsumari: video & audio summarizer",
    tags: ["Mobile", "AI"],
    overview:
      "Mobile app that turns recordings into transcripts and chaptered summaries. Async job pipeline with faster-whisper, embedding-based chaptering and LLM summaries.",
    stack: ["React Native", "FastAPI", "Supabase", "Docker"],
    images: ["/tsumari.jpeg", "/tsumariHome.jpeg"],
    imageLabel: "tsumari",
    slug: "tsumari",
    problem:
      "Lectures and podcasts are long, and going back to find one specific part means scrubbing through hours of audio. A raw transcript does not fix this on its own: it is a long wall of text with no structure. Tsumari turns a recording into chapters, each with a title and a short summary, so you can see what a recording covers and find the part you need.",
    timeline: {
      start: "September 2026",
      end: "October 2026",
    },
    links: {
      github: "https://github.com/rafipasya22/Tsumari",
    },
    improvements: [
      "Add per-user authentication and rate limiting to the job API.",
      "Measure chapter and summary quality against human-written references.",
      "Export summaries as Markdown or PDF.",
    ],
    architecture: {
      diagram: "/tsumari-architecture.svg",
      description:
        "The React Native (Expo) app uploads a recording to a FastAPI endpoint, which returns a job ID immediately. A polling worker picks up the job from an async queue, splits the audio with ffmpeg, transcribes it with faster-whisper, groups the transcript into chapters using embeddings, and asks an LLM (Groq) for each chapter's title and summary. The app polls the job for status and progress, then fetches the transcript and summaries.",
    },
    description:
      "Mobile app that turns recordings into transcripts and chaptered summaries. Audio is chunked with ffmpeg and transcribed with faster-whisper, chapters are built with embeddings, and an LLM (Groq) writes each chapter's title and summary. The app polls an async job API for status, progress and transcript.",
  },
];
