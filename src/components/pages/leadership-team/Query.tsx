/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import { motion, useScroll, useTransform, type MotionValue, type Variants } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

import {
  defaultDataLeadershipTeam,
  defaultLayout,
  LeadershipTeamPayload,
  LeadershipTeamProps,
  TeamMember,
} from "./data";

const normalizeData = (value: unknown): LeadershipTeamPayload => {
  if (!value || typeof value !== "object") return { ...defaultDataLeadershipTeam, ...defaultLayout };
  const data = value as Partial<LeadershipTeamPayload>;
  if (!data.ceo || !Array.isArray(data.rows)) return { ...defaultDataLeadershipTeam, ...defaultLayout };

  return {
    ...defaultDataLeadershipTeam,
    ...defaultLayout,
    ...data,
    eyebrow: data.eyebrow || defaultDataLeadershipTeam.eyebrow,
    title: data.title || defaultDataLeadershipTeam.title,
    description: data.description || defaultDataLeadershipTeam.description,
    ceo: {
      ...defaultDataLeadershipTeam.ceo,
      ...data.ceo,
      bio: data.ceo.bio || defaultDataLeadershipTeam.ceo.bio,
    },
    rows: data.rows.map((row, rowIndex) => ({
      id: row.id || `row-${rowIndex + 1}`,
      label: row.label || `Team Group ${rowIndex + 1}`,
      members: Array.isArray(row.members)
        ? row.members.map((member, memberIndex) => ({
            id: member.id || `member-${rowIndex + 1}-${memberIndex + 1}`,
            name: member.name || "Team Member",
            title: member.title || "",
            bio: member.bio || "",
            image: member.image || "",
          }))
        : [],
    })),
  };
};

const parseData = (data: LeadershipTeamProps["data"]): LeadershipTeamPayload => {
  if (!data) return { ...defaultDataLeadershipTeam, ...defaultLayout };
  if (typeof data !== "string") return normalizeData(data);

  try {
    return normalizeData(JSON.parse(data));
  } catch {
    return { ...defaultDataLeadershipTeam, ...defaultLayout };
  }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const MemberPhoto = ({
  member,
  priority = false,
  size,
}: {
  member: TeamMember;
  priority?: boolean;
  size: "founder" | "member";
}) => {
  const sizeClass = size === "founder" ? "h-40 w-40" : "h-24 w-24";
  return (
    <div
      className={`relative mx-auto overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-orange-100 ${sizeClass} ${
        size === "founder" ? "ring-2 ring-amber-700/20 ring-offset-4 ring-offset-[#fbf7ef]" : "ring-1 ring-stone-300"
      } transition-transform duration-500 group-hover:scale-105`}
    >
      {member.image ? (
        <Image
          alt={member.name}
          className="h-full w-full object-cover"
          fill
          priority={priority}
          sizes={size === "founder" ? "160px" : "96px"}
          src={member.image}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-stone-600">
          {member.name.charAt(0) || "?"}
        </span>
      )}
    </div>
  );
};

const CeoCard = ({ member, founderLabel }: { member: TeamMember; founderLabel: string }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.4 }}
    variants={fadeUp}
    className="relative mx-auto w-full max-w-sm"
  >
    <div className="group relative overflow-hidden rounded-sm border border-stone-200 bg-[#fffdf8] p-8 text-center shadow-[0_18px_60px_rgba(87,69,48,0.08)] transition-colors duration-500 hover:border-amber-700/25">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-24 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: "radial-gradient(circle at center, rgba(217,119,6,0.12), transparent 60%)" }}
      />
      <div className="mb-6">
        <MemberPhoto member={member} priority size="founder" />
      </div>
      <span className="mb-2 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium uppercase tracking-widest text-amber-800">
        {founderLabel}
      </span>
      <h2 className="text-2xl font-semibold text-stone-900">{member.name}</h2>
      <p className="mt-1 text-sm font-medium text-amber-700">{member.title}</p>
      <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-stone-600">{member.bio}</p>
    </div>
  </motion.div>
);

const MemberCard = ({ member, delay, side }: { member: TeamMember; delay: number; side: "left" | "right" }) => (
  <motion.div
    initial={{ opacity: 0, x: side === "left" ? -90 : 90, y: 36, scale: 0.92, rotate: side === "left" ? -2 : 2 }}
    whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ type: "spring", stiffness: 75, damping: 16, delay }}
    className="group relative overflow-hidden rounded-sm border border-stone-200 bg-[#fffdf8] p-7 text-center shadow-[0_14px_45px_rgba(87,69,48,0.07)] transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-2 hover:border-amber-700/30 hover:shadow-[0_24px_70px_rgba(146,92,28,0.16)] lg:p-8"
  >
    <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-amber-200/0 blur-3xl transition-colors duration-700 group-hover:bg-amber-200/45" />
    <div className="mb-5">
      <MemberPhoto member={member} size="member" />
    </div>
    <h3 className="text-lg font-semibold text-stone-900">{member.name}</h3>
    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-amber-700">{member.title}</p>
    <p className="mx-auto mt-3 max-w-[15rem] text-sm leading-relaxed text-stone-600">{member.bio}</p>
  </motion.div>
);

const ThreadDivider = ({ label }: { label: string }) => (
  <motion.div
    initial={{ opacity: 0, scaleX: 0.3 }}
    whileInView={{ opacity: 1, scaleX: 1 }}
    viewport={{ once: true, amount: 0.6 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className="mx-auto flex max-w-xl items-center gap-4 py-2"
  >
    <span className="h-px flex-1 bg-stone-300" />
    <span className="whitespace-nowrap text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-stone-500">
      {label}
    </span>
    <span className="h-px flex-1 bg-stone-300" />
  </motion.div>
);

const ScrollConnector = ({ progress }: { progress: MotionValue<number> }) => {
  const glowPosition = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-0 hidden w-px -translate-x-1/2 bg-stone-300 md:block"
    >
      <motion.div
        style={{ scaleY: progress }}
        className="absolute inset-0 origin-top bg-gradient-to-b from-amber-500 via-orange-500 to-red-500 shadow-[0_0_14px_rgba(217,119,6,0.75)]"
      />
      <motion.span
        style={{ top: glowPosition }}
        className="absolute left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-amber-500 shadow-[0_0_0_6px_rgba(245,158,11,0.15),0_0_24px_rgba(217,119,6,0.85)]"
      />
    </div>
  );
};

const BranchArrows = ({ rowIndex }: { rowIndex: number }) => {
  const markerId = `leadership-team-arrow-${rowIndex}`;
  const gradientId = `leadership-team-branch-${rowIndex}`;

  return (
    <svg
      aria-hidden
      viewBox="0 0 800 130"
      preserveAspectRatio="none"
      className="relative z-[1] mx-auto mt-4 hidden h-28 w-full max-w-5xl sm:block lg:mt-8 lg:h-36"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <marker
          id={markerId}
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L8,4 L0,8 Z" fill="#92400e" />
        </marker>
      </defs>
      <motion.path
        d="M400 0 C400 52 245 42 200 118"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        markerEnd={`url(#${markerId})`}
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.65 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.path
        d="M400 0 C400 52 555 42 600 118"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        strokeLinecap="round"
        markerEnd={`url(#${markerId})`}
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.65 }}
        transition={{ duration: 1, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.circle
        cx="400"
        cy="3"
        r="6"
        fill="#f59e0b"
        stroke="#fffdf8"
        strokeWidth="3"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", delay: 0.15 }}
      />
    </svg>
  );
};

const QueryLeadershipTeam = ({ data }: LeadershipTeamProps) => {
  const pageData = parseData(data);
  const containerRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const { scrollYProgress: teamLineProgress } = useScroll({ target: teamRef, offset: ["start 72%", "end 72%"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0.85]);
  const heroY = useTransform(scrollYProgress, [0, 0.08], [0, -20]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-[#fbf7ef] pb-24 lg:pb-36 custom-parent-border"
      style={{
        paddingInline: `${Math.max(0, Number(pageData.paddingX) || 0)}px`,
        paddingBlock: `${Math.max(0, Number(pageData.paddingY) || 0)}px`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 20% 0%, rgba(251,191,36,0.10), transparent 38%), radial-gradient(circle at 80% 10%, rgba(180,83,9,0.07), transparent 40%)",
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
          className="mb-4 inline-block rounded-full border border-stone-300 bg-white/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-800"
        >
          {pageData.eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl font-bold text-stone-900 sm:text-5xl"
        >
          {pageData.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-4 max-w-lg text-stone-600"
        >
          {pageData.description}
        </motion.p>
      </motion.header>

      <section ref={teamRef} className="relative mx-auto max-w-7xl px-6">
        <ScrollConnector progress={teamLineProgress} />
        <div className="relative z-10">
          <CeoCard member={pageData.ceo} founderLabel={pageData.founderLabel} />
        </div>

        {pageData.rows.map((row, rowIndex) => (
          <div key={row.id} className="relative mt-20 lg:mt-36">
            <ThreadDivider label={row.label} />
            <BranchArrows rowIndex={rowIndex} />
            <div className="relative z-10 mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-10 sm:mt-0 sm:grid-cols-2 lg:gap-24">
              {row.members.map((member, index) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  delay={index * 0.16}
                  side={index % 2 === 0 ? "left" : "right"}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default QueryLeadershipTeam;
