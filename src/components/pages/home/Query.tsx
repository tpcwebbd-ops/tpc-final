/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/

"use client";

import { ArrowDown, ArrowUpRight, BookOpen, Check, MessageCircle, Sparkles } from "lucide-react";
import Image from "next/image";
import { createElement, type ReactNode } from "react";

import AnimatedText from "./AnimatedText";
import CourseShowcase from "./CourseShowcase";
import { contentText, homePadding, homeSections, type ContentNode, type HomeData, type HomeSection } from "./data";
import styles from "./home.module.css";
import ScrollAnimations from "./ScrollAnimations";

const whatsapp = "https://wa.me/8801786558855";
type EntranceAnimation = "fade-left" | "fade-right" | "zoom-in";

function actionHref(text: string): string {
  if (/facebook/i.test(text))
    return /kids/i.test(text)
      ? "https://www.facebook.com/groups/tpckids"
      : "https://www.facebook.com/TestPrepCenter.BD/";
  if (/youtube/i.test(text)) return "https://www.youtube.com/results?search_query=TestPrep+Center";
  if (/whatsapp|enroll|ভর্তি|reserve/i.test(text)) return whatsapp;
  if (/view course|all courses|কোর্সটি দেখুন|সব কোর্স/i.test(text)) return "#all-course";
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
  hero = false,
  animation,
}: {
  section: HomeSection;
  hero?: boolean;
  animation: EntranceAnimation;
}) {
  return (
    <div className={`${styles.visual} ${hero ? styles.heroVisual : ""}`} data-aos={animation} data-aos-delay="150">
      <div className={styles.imageBackdrop} aria-hidden="true" />
      <div className={styles.photoFrame}>
        <Image
          alt={section.imageAlt}
          className={styles.photo}
          fill
          loading={section.id === "KidsHero" ? "eager" : "lazy"}
          fetchPriority={section.id === "KidsHero" ? "high" : undefined}
          sizes="(max-width: 760px) 92vw, (max-width: 1280px) 45vw, 540px"
          src={section.imageUrl}
          unoptimized={section.imageUrl.startsWith("https://")}
          onError={(event) => {
            const image = event.currentTarget;
            const fallback =
              section.id === "KidsHero"
                ? "/images/home/bangladesh/playground.webp"
                : "/images/home/bangladesh/classroom.webp";
            if (image.getAttribute("data-fallback") !== "true") {
              image.setAttribute("data-fallback", "true");
              image.srcset = "";
              image.src = fallback;
            }
          }}
        />
        {section.id === "CameraSpeakingSection" && <span className={styles.recordingFrame} aria-hidden="true" />}
      </div>
      {section.id === "KidsHero" && (
        <>
          <div className={styles.insetPhoto}>
            <Image
              alt="Bangladeshi children enjoying an English reading activity together"
              fill
              sizes="(max-width: 760px) 35vw, 200px"
              src="/images/home/bangladesh/reading.webp"
            />
          </div>
          <span className={styles.playIcon} aria-hidden="true">
            <BookOpen size={28} strokeWidth={1.5} />
          </span>
          <span className={styles.talkIcon} aria-hidden="true">
            <MessageCircle size={26} strokeWidth={1.5} />
          </span>
          <svg className={styles.learningTrail} viewBox="0 0 540 110" fill="none" aria-hidden="true">
            <path d="M8 80C80 135 170 20 246 50S400 130 512 18" />
            <path d="m492 20 22-7-3 24" />
          </svg>
        </>
      )}
      <span className={styles.star} aria-hidden="true">
        <Sparkles size={48} strokeWidth={1.3} />
      </span>
    </div>
  );
}

function Actions({ nodes }: { nodes: ContentNode[] }) {
  if (!nodes.length) return null;
  return (
    <div className={styles.actions} data-aos="zoom-in" data-aos-delay="150">
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
  const body = section.content.filter((node) => !["h1", "h2", "span", "a"].includes(node.tag));
  const actions = section.content.filter((node) => node.tag === "a");
  const kidsHero = section.id === "KidsHero";
  const ieltsHero = section.id === "SecondaryIeltsHero";
  const demo = section.id === "DemoClassSection";
  const results = section.id === "CourseResultsSection";
  const hero = kidsHero || ieltsHero;
  const Heading = kidsHero ? "h1" : "h2";
  const dark = ieltsHero || demo;
  const reversed = index % 2 === 0 && !hero;
  // Follow the column positions, with a scale entrance every third section.
  const copyFrom = index % 3 === 2 ? "scale" : reversed ? "right" : "left";
  const copyAnimation = copyFrom === "scale" ? "zoom-in" : reversed ? "fade-left" : "fade-right";
  const imageAnimation = index % 3 === 0 ? "zoom-in" : reversed ? "fade-right" : "fade-left";
  const className = [
    styles.learningSection,
    hero ? styles.hero : "",
    kidsHero ? styles.kidsHero : "",
    dark ? styles.darkSection : "",
    results ? styles.resultsSection : "",
    demo ? styles.demoSection : "",
    reversed ? styles.reversed : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <section aria-labelledby={`${section.id}-title`} className={className} data-section={section.id} id={section.id}>
      <div className={styles.sectionInner}>
        <div className={styles.copy}>
          <Heading className={styles.heading} id={`${section.id}-title`}>
            {heading &&
              contentText(heading)
                .split(" | ")
                .map((part, index) => (
                  <span
                    className={index ? styles.headingTranslation : styles.headingEnglish}
                    key={index}
                    lang={/[\u0980-\u09ff]/u.test(part) ? "bn" : "en"}
                  >
                    <AnimatedText text={part} from={copyFrom} />
                  </span>
                ))}
          </Heading>
          <div
            className={`${styles.sectionBody} ${hero ? styles.heroBody : ""}`}
            data-aos={copyAnimation}
            data-aos-delay="100"
          >
            {body.map((node, index) => (
              <RichContent key={index} node={node} />
            ))}
          </div>
          <Actions nodes={actions} />
        </div>
        <SectionImage hero={hero} section={section} animation={imageAnimation} />
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
      <ScrollAnimations />
      {sections.map((section, index) =>
        section.id === "all-course" ? (
          <CourseShowcase key={section.id} section={section} />
        ) : (
          <LearningSection index={index} key={section.id} section={section} />
        ),
      )}
    </div>
  );
}
