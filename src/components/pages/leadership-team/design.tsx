/*
|-----------------------------------------
| setting up design.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
}

interface TeamRow {
  label: string;
  members: TeamMember[];
}

const ceo: TeamMember = {
  id: "ceo",
  name: "Tanvir Ahmed",
  title: "Founder & CEO",
  bio: "Leads NexaMart with a clear vision: making international education guidance personal, reliable, and accessible.",
  image: "https://i.pravatar.cc/600?img=13",
};

const rows: TeamRow[] = [
  {
    label: "Leadership",
    members: [
      {
        id: "creative-director",
        name: "Nusrat Jahan",
        title: "Creative Director",
        bio: "Guides the team and helps every student receive thoughtful support throughout the application journey.",
        image: "https://i.pravatar.cc/500?img=47",
      },
      {
        id: "lead-developer",
        name: "Rakibul Hasan",
        title: "Lead Developer",
        bio: "Builds the fast, reliable web platforms our clients run their business on.",
        image: "https://i.pravatar.cc/500?img=68",
      },
    ],
  },
  {
    label: "Growth",
    members: [
      {
        id: "marketing-lead",
        name: "Farhana Islam",
        title: "Marketing Lead",
        bio: "Turns ad budgets into measurable growth across Meta, Google, and TikTok.",
        image: "https://i.pravatar.cc/500?img=32",
      },
      {
        id: "content-strategist",
        name: "Shahriar Kabir",
        title: "Content Strategist",
        bio: "Writes and plans the content calendars that keep client audiences engaged weekly.",
        image: "https://i.pravatar.cc/500?img=51",
      },
    ],
  },
  {
    label: "Product",
    members: [
      {
        id: "ui-ux-designer",
        name: "Mim Akter",
        title: "UI/UX Designer",
        bio: "Designs interfaces that feel effortless, tested with real users before every launch.",
        image: "https://i.pravatar.cc/500?img=25",
      },
      {
        id: "client-success",
        name: "Imran Chowdhury",
        title: "Client Success Manager",
        bio: "The steady voice clients call first, from onboarding through every project milestone.",
        image: "https://i.pravatar.cc/500?img=60",
      },
    ],
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

function CeoCard({ member }: { member: TeamMember }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={fadeUp}
      className="relative mx-auto w-full max-w-sm"
    >
      <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl transition-colors duration-500 hover:border-fuchsia-400/30">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-24 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background: "radial-gradient(circle at center, rgba(217,70,239,0.25), transparent 60%)",
          }}
        />
        <div className="relative mx-auto mb-6 h-40 w-40 overflow-hidden rounded-full ring-2 ring-fuchsia-400/40 ring-offset-4 ring-offset-[#0a0a0f] transition-transform duration-500 group-hover:scale-105">
          <Image src={member.image} alt={member.name} fill sizes="160px" className="object-cover" priority />
        </div>
        <span className="mb-2 inline-block rounded-full bg-gradient-to-r from-fuchsia-500/20 to-violet-500/20 px-3 py-1 text-xs font-medium uppercase tracking-widest text-fuchsia-300">
          Founder
        </span>
        <h2 className="text-2xl font-semibold text-white">{member.name}</h2>
        <p className="mt-1 text-sm font-medium text-violet-300">{member.title}</p>
        <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-white/60">{member.bio}</p>
      </div>
    </motion.div>
  );
}

function MemberCard({ member, delay }: { member: TeamMember; delay: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      custom={delay}
      variants={fadeUp}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div className="relative mx-auto mb-5 h-24 w-24 overflow-hidden rounded-full ring-1 ring-white/15 transition-transform duration-500 group-hover:scale-105">
        <Image src={member.image} alt={member.name} fill sizes="96px" className="object-cover" />
      </div>
      <h3 className="text-lg font-semibold text-white">{member.name}</h3>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-violet-300/80">{member.title}</p>
      <p className="mx-auto mt-3 max-w-[15rem] text-sm leading-relaxed text-white/55">{member.bio}</p>
    </motion.div>
  );
}

function ThreadDivider({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.3 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex max-w-xl items-center gap-4 py-2"
    >
      <span className="h-px flex-1 border-t border-dashed border-white/15" />
      <span className="whitespace-nowrap text-[0.65rem] font-medium uppercase tracking-[0.2em] text-white/35">
        {label}
      </span>
      <span className="h-px flex-1 border-t border-dashed border-white/15" />
    </motion.div>
  );
}

function ConnectorCurve() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 400"
      preserveAspectRatio="none"
      className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-[100px] -translate-x-1/2 md:block"
    >
      <motion.path
        d="M50,0 C20,80 80,140 50,200 C20,260 80,320 50,400"
        fill="none"
        stroke="url(#threadGradient)"
        strokeWidth="1.5"
        strokeDasharray="4 8"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.8, ease: "easeInOut" }}
      />
      <defs>
        <linearGradient id="threadGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e879f9" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function TeamPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0.85]);
  const heroY = useTransform(scrollYProgress, [0, 0.08], [0, -20]);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden bg-[#0a0a0f] pb-32">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 20% 0%, rgba(139,92,246,0.15), transparent 40%), radial-gradient(circle at 80% 10%, rgba(236,72,153,0.12), transparent 40%)",
        }}
      />

      <motion.header
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative mx-auto max-w-3xl px-6 pb-16 pt-24 text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 inline-block rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white/50"
        >
          NexaMart
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl"
        >
          The people behind the buzz
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-4 max-w-lg text-white/55"
        >
          Seven people, three disciplines, one goal: turning Bangladeshi businesses into brands worth talking about.
        </motion.p>
      </motion.header>

      <section className="relative mx-auto max-w-6xl px-6">
        <ConnectorCurve />

        <CeoCard member={ceo} />

        {rows.map((row) => (
          <div key={row.label}>
            <ThreadDivider label={row.label} />
            <div className="relative z-10 mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
              {row.members.map((member, index) => (
                <MemberCard key={member.id} member={member} delay={index * 0.15} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
