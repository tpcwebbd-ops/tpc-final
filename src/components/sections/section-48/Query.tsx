/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

/*
|-----------------------------------------
| NexaMart creamy global study hero
|-----------------------------------------
*/

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Noto_Sans_Bengali } from "next/font/google";
import { useMemo, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";
import { toast } from "@/components/ui/global-toast";

import {
  defaultDataSection48,
  defaultLayout,
  type Section48Data,
  type Section48Payload,
  type Section48Props,
} from "./data";
import Globe3D from "./Globe3d";

const MapPin = iconMap.MapPin;
const Phone = iconMap.Phone;
const Send = iconMap.Send;
const UserRound = iconMap.User;

const SECTION_BACKGROUND = "#fff8e8";
const bengaliFont = Noto_Sans_Bengali({ subsets: ["bengali"], weight: ["500", "600", "700", "800"] });

const INITIAL_BACKGROUND_SCENE = {
  id: 0,
  duration: 5,
  lines: [
    {
      id: 0,
      route: "M-120 260 C 240 70, 520 470, 850 230 S 1310 110, 1720 350",
      strokeWidth: 1.3,
      opacity: 0.24,
      dash: "10 18",
    },
    {
      id: 1,
      route: "M-120 280 C 240 90, 520 490, 850 250 S 1310 130, 1720 370",
      strokeWidth: 2.2,
      opacity: 0.34,
      dash: "22 20",
    },
    {
      id: 2,
      route: "M-120 300 C 240 110, 520 510, 850 270 S 1310 150, 1720 390",
      strokeWidth: 1.1,
      opacity: 0.2,
      dash: "6 16",
    },
  ],
};

const randomBetween = (minimum: number, maximum: number) => Math.round(minimum + Math.random() * (maximum - minimum));

const createBackgroundScene = () => {
  const lineCount = randomBetween(3, 5);
  const gap = randomBetween(14, 24);
  const startY = randomBetween(130, 650);
  const firstControlY = randomBetween(70, 720);
  const secondControlY = randomBetween(100, 760);
  const middleY = randomBetween(100, 700);
  const finalControlY = randomBetween(60, 740);
  const endY = randomBetween(120, 680);

  return {
    id: Date.now(),
    duration: 5,
    lines: Array.from({ length: lineCount }, (_, index) => {
      const offset = Math.round((index - (lineCount - 1) / 2) * gap);

      return {
        id: index,
        route: `M-120 ${startY + offset} C ${randomBetween(140, 360)} ${firstControlY + offset}, ${randomBetween(470, 720)} ${
          secondControlY + offset
        }, ${randomBetween(760, 980)} ${middleY + offset} S ${randomBetween(1160, 1430)} ${finalControlY + offset}, 1720 ${endY + offset}`,
        strokeWidth: index === Math.floor(lineCount / 2) ? 2.4 : randomBetween(10, 17) / 10,
        opacity: index === Math.floor(lineCount / 2) ? 0.38 : randomBetween(18, 28) / 100,
        dash: index % 2 === 0 ? "10 18" : "24 20",
      };
    }),
  };
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export interface TextDemoHeroProps {
  banglaFirstLine?: string;
  banglaSecondLine?: string;
  stampValue?: string;
  stampText?: string;
  paddingX?: number;
  paddingY?: number;
}

export function TextDemoHero({
  banglaFirstLine = "স্বপ্ন আপনার,",
  banglaSecondLine = "সঠিক পথ দেখানোর দায়িত্ব আমাদের।",
  stampValue = "16",
  stampText = "YEARS OF TRUST • YEARS OF TRUST •",
  paddingX = 0,
  paddingY = 0,
}: TextDemoHeroProps = {}) {
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [backgroundScene, setBackgroundScene] = useState(INITIAL_BACKGROUND_SCENE);
  const [consultationForm, setConsultationForm] = useState({
    fullName: "",
    mobileWhatsApp: "",
    studyDestination: "",
  });
  const [showDemoModal, setShowDemoModal] = useState(false);
  const reduceMotion = useReducedMotion();

  const submitConsultation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowDemoModal(true);
    toast.info("Demo modal opened. Consultation submission will be connected later.");
  };

  return (
    <section
      className="relative mx-auto -mt-12 mb-12 min-h-screen w-full max-w-7xl isolate overflow-hidden border custom-parent-border text-slate-950 md:mb-0 md:min-h-[88vh]"
      style={{
        backgroundColor: SECTION_BACKGROUND,
        paddingInline: `${Math.max(0, Number(paddingX) || 0)}px`,
        paddingBlock: `${Math.max(0, Number(paddingY) || 0)}px`,
      }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1600 900" preserveAspectRatio="none">
          <defs>
            <linearGradient id="background-route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cf0a2c" stopOpacity="0" />
              <stop offset="22%" stopColor="#cf0a2c" />
              <stop offset="58%" stopColor="#f59e0b" />
              <stop offset="82%" stopColor="#cf0a2c" />
              <stop offset="100%" stopColor="#cf0a2c" stopOpacity="0" />
            </linearGradient>
          </defs>

          {backgroundScene.lines.map((line, index) => (
            <motion.path
              key={`route-${backgroundScene.id}-${line.id}`}
              d={line.route}
              fill="none"
              stroke="url(#background-route-gradient)"
              strokeWidth={line.strokeWidth}
              strokeDasharray={line.dash}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ filter: "drop-shadow(0 0 7px rgba(207, 10, 44, 0.28))" }}
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0, strokeDashoffset: 80 }}
              animate={
                reduceMotion
                  ? { pathLength: 1, opacity: line.opacity, strokeDashoffset: 0 }
                  : {
                      pathLength: [0, 1, 1],
                      opacity: [0, line.opacity, line.opacity, 0],
                      strokeDashoffset: [80, -180],
                    }
              }
              transition={{
                pathLength: {
                  duration: reduceMotion ? 0 : 3.1,
                  delay: reduceMotion ? 0 : index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                },
                opacity: {
                  duration: reduceMotion ? 0 : backgroundScene.duration,
                  times: [0, 0.18, 0.78, 1],
                  ease: "easeInOut",
                },
                strokeDashoffset: { duration: reduceMotion ? 0 : backgroundScene.duration, ease: "linear" },
              }}
              onAnimationComplete={
                index === 0
                  ? () => {
                      if (!reduceMotion) setBackgroundScene(createBackgroundScene());
                    }
                  : undefined
              }
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 mx-auto grid min-h-[78vh] w-full max-w-7xl grid-cols-1 items-center gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-4 lg:px-10 lg:py-6 xl:px-14">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -48, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto flex aspect-square w-full max-w-[620px] items-center justify-center"
        >
          <Globe3D
            activeCountry={activeCountry}
            onSelectCountry={setActiveCountry}
            backgroundColor={SECTION_BACKGROUND}
            gridColor="transparent"
            accentColor="transparent"
            singleBackground
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          className="relative mx-auto flex w-full max-w-2xl flex-col items-start lg:pl-8 xl:pl-14 -mt-12"
        >
          <div className="relative w-full -mt-6 lg:mt-32 -pt-32 lg:pt-36">
            <motion.div
              variants={itemVariants}
              aria-label={`${stampValue} ${stampText.replaceAll("•", "").trim()}`}
              className="absolute right-3 -top-18 lg:top-4 grid h-24 w-24 place-items-center rounded-full text-[#cf0a2c] sm:top-0 sm:h-28 sm:w-28 lg:-right-2 lg:h-32 lg:w-32 xl:-right-4 xl:h-36 xl:w-36 "
              initial={reduceMotion ? false : { opacity: 0, scale: 0.45, rotate: -25 }}
              animate={{ opacity: 1, scale: 1.3, rotate: 0 }}
              transition={{ type: "spring", stiffness: 150, damping: 14, delay: reduceMotion ? 0 : 0.25 }}
              whileHover={reduceMotion ? undefined : { scale: 1.08, rotate: 3 }}
            >
              <motion.svg
                aria-hidden="true"
                viewBox="0 0 140 140"
                className="absolute inset-0 h-full w-full"
                animate={reduceMotion ? undefined : { rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              >
                <defs>
                  <path id="trust-stamp-path" d="M70,70 m-52,0 a52,52 0 1,1 104,0 a52,52 0 1,1 -104,0" />
                </defs>
                <circle cx="70" cy="70" r="65" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle
                  cx="70"
                  cy="70"
                  r="48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                  opacity="0.45"
                />
                <text fill="currentColor" fontSize="10" fontWeight="800" letterSpacing="2.1">
                  <textPath href="#trust-stamp-path" startOffset="3%">
                    {stampText}
                  </textPath>
                </text>
              </motion.svg>

              <motion.span
                aria-hidden="true"
                className="absolute inset-[22%] rounded-full border border-[#cf0a2c]/20"
                animate={reduceMotion ? undefined : { scale: [1, 1.14, 1], opacity: [0.25, 0.7, 0.25] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative flex flex-col items-center justify-center leading-none">
                <motion.span
                  className="text-4xl font-black tracking-[-0.08em] sm:text-5xl"
                  animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
                >
                  {stampValue}
                </motion.span>
                <ShieldCheck className="mt-1 h-5 w-5" strokeWidth={1.8} />
              </div>
            </motion.div>

            <h2
              className={`${bengaliFont.className} w-full text-[clamp(0.875rem,4vw,1.5rem)] font-bold leading-[1.2] tracking-[-0.035em] text-slate-950 sm:text-[clamp(1.4rem,2.3vw,2rem)]`}
            >
              <span className="block whitespace-nowrap text-4xl lg:text-[44px]">{banglaFirstLine}</span>
              <span className="relative mt-1 inline-block whitespace-nowrap text-2xl text-[#cf0a2c] lg:text-[34px]">
                {banglaSecondLine}
                <span aria-hidden="true" className="absolute -bottom-1 left-0 h-0.5 w-full bg-[#cf0a2c]/45" />
              </span>
            </h2>
          </div>

          <motion.div variants={itemVariants} className="mt-8 lg:hidden">
            <motion.div
              className="relative inline-flex"
              whileHover={reduceMotion ? undefined : { y: -5, scale: 1.035 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-1 rounded-full border border-[#cf0a2c]/40"
                animate={reduceMotion ? undefined : { scale: [1, 1.12, 1], opacity: [0.65, 0, 0.65] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-2 rounded-full border border-[#cf0a2c]/25"
                animate={reduceMotion ? undefined : { scale: [0.96, 1.18, 0.96], opacity: [0, 0.5, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: 0.65, ease: "easeOut" }}
              />
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute -top-3 left-8 h-2 w-2 rounded-full bg-[#cf0a2c]"
                animate={reduceMotion ? undefined : { x: [0, 42, 88], y: [0, -8, 1], opacity: [0, 1, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-2 right-10 h-1.5 w-1.5 rounded-full bg-amber-500"
                animate={reduceMotion ? undefined : { x: [0, -38, -76], y: [0, 7, -2], opacity: [0, 0.9, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, delay: 0.4, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="md:mt-7 -mt-12 w-full">
            <form
              onSubmit={submitConsultation}
              className="rounded-sm border border-[#cf0a2c]/15 bg-white/80 p-4 shadow-[0_20px_50px_-32px_rgba(207,10,44,0.65)] backdrop-blur-md"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-slate-950">Free Consultation</p>
                  <p className="mt-0.5 text-xs text-slate-500">Tell us where you want to study.</p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#cf0a2c]/10 text-[#cf0a2c]">
                  <Send className="h-4 w-4" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <label className="relative">
                  <span className="sr-only">Name</span>
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    type="text"
                    autoComplete="name"
                    placeholder="Name"
                    value={consultationForm.fullName}
                    onChange={(event) =>
                      setConsultationForm((current) => ({ ...current, fullName: event.target.value }))
                    }
                    className="h-12 w-full rounded-sm border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#cf0a2c] focus:ring-2 focus:ring-[#cf0a2c]/10"
                  />
                </label>

                <label className="relative">
                  <span className="sr-only">Mobile Number</span>
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    type="tel"
                    autoComplete="tel"
                    placeholder="Mobile Number"
                    value={consultationForm.mobileWhatsApp}
                    onChange={(event) =>
                      setConsultationForm((current) => ({ ...current, mobileWhatsApp: event.target.value }))
                    }
                    className="h-12 w-full rounded-sm border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#cf0a2c] focus:ring-2 focus:ring-[#cf0a2c]/10"
                  />
                </label>

                <label className="relative">
                  <span className="sr-only">Study destination</span>
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    required
                    type="text"
                    placeholder="Study destination"
                    value={consultationForm.studyDestination}
                    onChange={(event) =>
                      setConsultationForm((current) => ({ ...current, studyDestination: event.target.value }))
                    }
                    className="h-12 w-full rounded-sm border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#cf0a2c] focus:ring-2 focus:ring-[#cf0a2c]/10"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-[#cf0a2c] px-5 text-sm font-black text-white shadow-[0_15px_30px_-15px_rgba(207,10,44,0.8)] transition hover:-translate-y-0.5 hover:bg-[#b30927] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                Submit Consultation
              </button>
            </form>
            {showDemoModal && (
              <div
                className="fixed inset-0 z-[110] grid place-items-center bg-slate-950/45 p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="consultation-demo-title"
              >
                <div className="w-full max-w-md rounded-sm border border-[#eadfca] bg-white p-6 text-slate-950 shadow-2xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p id="consultation-demo-title" className="text-lg font-black">
                        Consultation demo modal
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        The consultation API is disconnected for now. This placeholder can be replaced with the final
                        workflow later.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDemoModal(false)}
                      className="rounded-sm px-2 py-1 text-xl leading-none text-slate-500 transition hover:bg-slate-100"
                      aria-label="Close demo modal"
                    >
                      ×
                    </button>
                  </div>
                  <div className="mt-5 rounded-sm bg-amber-50 p-3 text-xs text-amber-900">
                    {consultationForm.fullName || "Name"} · {consultationForm.mobileWhatsApp || "Mobile number"} ·{" "}
                    {consultationForm.studyDestination || "Study destination"}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDemoModal(false)}
                    className="mt-5 inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-sm bg-[#cf0a2c] px-4 text-sm font-bold text-white transition duration-700 hover:bg-[#b30927]"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const getSectionData = (data?: Section48Data | Section48Payload | string): Section48Payload => {
  if (!data) return { ...defaultDataSection48, ...defaultLayout };

  try {
    const parsed = typeof data === "string" ? (JSON.parse(data) as Partial<Section48Payload>) : data;
    return {
      ...defaultDataSection48,
      ...defaultLayout,
      ...parsed,
    };
  } catch {
    return { ...defaultDataSection48, ...defaultLayout };
  }
};

export default function QuerySection48({ data }: Section48Props) {
  const sectionData = useMemo(() => getSectionData(data), [data]);

  return (
    <TextDemoHero
      banglaFirstLine={sectionData.banglaFirstLine}
      banglaSecondLine={sectionData.banglaSecondLine}
      stampValue={sectionData.stampValue}
      stampText={sectionData.stampText}
      paddingX={sectionData.paddingX}
      paddingY={sectionData.paddingY}
    />
  );
}
