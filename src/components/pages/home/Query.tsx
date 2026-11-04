/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/

"use client";

import { ArrowDown, ArrowUpRight, Check, Sparkles } from "lucide-react";
import Image from "next/image";
import { createElement, type ReactNode } from "react";

import CourseShowcase from "./CourseShowcase";
import { contentText, homePadding, homeSections, type ContentNode, type HomeData, type HomeSection } from "./data";
import styles from "./home.module.css";

const whatsapp = "https://wa.me/8801786558855";

function actionHref(text: string): string {
  if (/facebook/i.test(text))
    return /kids/i.test(text)
      ? "https://www.facebook.com/groups/tpckids"
      : "https://www.facebook.com/TestPrepCenter.BD/";
  if (/youtube/i.test(text)) return "https://www.youtube.com/results?search_query=TestPrep+Center";
  if (/whatsapp|enroll|ভর্তি|reserve/i.test(text)) return whatsapp;
  if (/view course/i.test(text)) return "#PracticalVocabularySection";
  if (/build confidence/i.test(text)) return "#CourseResultsSection";
  if (/start speaking/i.test(text)) return "#WhatsAppActivitiesSection";
  if (/join the course/i.test(text)) return whatsapp;
  return "#DemoClassSection";
}

function RichContent({ node }: { node: ContentNode | string }): ReactNode {
  if (typeof node === "string") return node;
  const children = node.children.map((child, index) => <RichContent key={index} node={child} />);
  if (node.tag === "a") {
    return <a href={actionHref(contentText(node))}>{children}</a>;
  }
  // The schema only permits these semantic tags; saved content never becomes HTML.
  return createElement(node.tag === "h1" ? "h2" : node.tag, undefined, children);
}

function SectionImage({
  section,
  badges = [],
  hero = false,
}: {
  section: HomeSection;
  badges?: ContentNode[];
  hero?: boolean;
}) {
  return (
    <div className={`${styles.visual} ${hero ? styles.heroVisual : ""}`}>
      <div className={styles.imageBackdrop} aria-hidden="true" />
      <div className={styles.photoFrame}>
        <Image
          alt={section.imageAlt}
          className={styles.photo}
          fill
          loading={section.id === "KidsHero" ? "eager" : "lazy"}
          sizes="(max-width: 760px) 92vw, (max-width: 1280px) 45vw, 540px"
          src={section.imageUrl}
          unoptimized={section.imageUrl.startsWith("https://")}
          onError={(event) => {
            const image = event.currentTarget;
            const fallback = `/images/home/${section.id}.webp`;
            if (image.getAttribute("data-fallback") !== "true") {
              image.setAttribute("data-fallback", "true");
              image.srcset = "";
              image.src = fallback;
            }
          }}
        />
        {section.id === "CameraSpeakingSection" && <span className={styles.recordingFrame} aria-hidden="true" />}
      </div>
      {badges.length > 0 && (
        <div className={styles.photoBadges}>
          {badges.map((badge, index) => (
            <span className={styles.photoBadge} key={index}>
              {index === 0 && <Sparkles aria-hidden="true" size={18} strokeWidth={1.7} />}
              <RichContent node={badge} />
            </span>
          ))}
        </div>
      )}
      <span className={styles.star} aria-hidden="true">
        ✳
      </span>
    </div>
  );
}

function Actions({ nodes }: { nodes: ContentNode[] }) {
  if (!nodes.length) return null;
  return (
    <div className={styles.actions}>
      {nodes.map((node, index) => (
        <a
          className={index === 0 ? styles.primaryAction : styles.secondaryAction}
          href={actionHref(contentText(node))}
          key={index}
        >
          <span>
            {node.children.map((child, index) => (
              <RichContent key={index} node={child} />
            ))}
          </span>
          {index === 0 ? <ArrowUpRight aria-hidden="true" size={19} /> : <ArrowDown aria-hidden="true" size={17} />}
        </a>
      ))}
    </div>
  );
}

function LearningSection({ section, index }: { section: HomeSection; index: number }) {
  const headingIndex = section.content.findIndex((node) => node.tag === "h1" || node.tag === "h2");
  const heading = section.content[headingIndex];
  const leadingSpans = section.content.slice(0, headingIndex).filter((node) => node.tag === "span");
  const eyebrow = leadingSpans.at(-1);
  const badges = [
    ...leadingSpans.slice(0, -1),
    ...section.content.slice(headingIndex + 1).filter((node) => node.tag === "span"),
  ];
  const body = section.content.filter((node) => !["h1", "h2", "span", "a"].includes(node.tag));
  const actions = section.content.filter((node) => node.tag === "a");
  const kidsHero = section.id === "KidsHero";
  const ieltsHero = section.id === "SecondaryIeltsHero";
  const demo = section.id === "DemoClassSection";
  const results = section.id === "CourseResultsSection";
  const hero = kidsHero || ieltsHero;
  const Heading = kidsHero ? "h1" : "h2";
  const dark = ieltsHero || demo;
  const className = [
    styles.learningSection,
    hero ? styles.hero : "",
    kidsHero ? styles.kidsHero : "",
    dark ? styles.darkSection : "",
    results ? styles.resultsSection : "",
    demo ? styles.demoSection : "",
    index % 2 === 0 && !hero ? styles.reversed : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <section aria-labelledby={`${section.id}-title`} className={className} data-section={section.id} id={section.id}>
      <div className={styles.sectionInner}>
        <div className={styles.copy}>
          {eyebrow && (
            <p className={styles.eyebrow}>
              <span aria-hidden="true" />
              <RichContent node={eyebrow} />
            </p>
          )}
          <Heading className={styles.heading} id={`${section.id}-title`}>
            {heading &&
              contentText(heading)
                .split(" | ")
                .map((part, index) => (
                  <span className={index ? styles.headingTranslation : undefined} key={index}>
                    {index > 0 && <span className={styles.headingDivider}> | </span>}
                    {part}
                  </span>
                ))}
          </Heading>
          <div className={`${styles.sectionBody} ${hero ? styles.heroBody : ""}`}>
            {body.map((node, index) => (
              <RichContent key={index} node={node} />
            ))}
          </div>
          <Actions nodes={actions} />
        </div>
        <SectionImage badges={badges} hero={hero} section={section} />
      </div>
      {results && <Check aria-hidden="true" className={styles.resultsMark} strokeWidth={1} />}
    </section>
  );
}

export default function Query({ data }: { data?: Partial<HomeData> }) {
  const sections = homeSections(data);
  return (
    <div
      className={styles.home}
      style={{ paddingInline: homePadding(data?.paddingX), paddingBlock: homePadding(data?.paddingY) }}
    >
      {sections.map((section, index) =>
        section.id === "AnnouncementBar" ? (
          <CourseShowcase key={section.id} section={section} />
        ) : (
          <LearningSection index={index} key={section.id} section={section} />
        ),
      )}
    </div>
  );
}
