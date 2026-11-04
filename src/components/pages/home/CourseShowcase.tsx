/*
|-----------------------------------------
| setting up CourseShowcase.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/

"use client";

import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { FaFacebookF, FaWhatsapp, FaYoutube } from "react-icons/fa";

import AnimatedText from "./AnimatedText";
import styles from "./course-showcase.module.css";
import { contentText, type ContentNode, type HomeSection } from "./data";

const whatsapp = "https://wa.me/8801786558855";
const courseLooks = [
  { image: "classroom", alt: "Bangladeshi children learning English through picture-card games", theme: "kids" },
  {
    image: "ielts",
    alt: "Bangladeshi university students practising English conversation together",
    theme: "speaking",
  },
  {
    image: "writing",
    alt: "Bangladeshi university students practising English writing with a tutor",
    theme: "writing",
  },
] as const;

function readCourse(node: ContentNode | string) {
  const [title, ...parts] = contentText(node)
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
  const price = parts.find((part) => /^[\d,]+\s*(?:BDT|TK|৳)$/i.test(part));
  const duration = parts.find((part) => /\bmonths?\b/i.test(part));
  const cadence = parts.find((part) => /^\d.*\b(?:lectures|classes)\b/i.test(part));
  const schedule = parts.find((part) => /\b(?:AM|PM)\b/i.test(part));
  const action = parts.find((part) => /join a free class|ফ্রি ক্লাসে যোগ দিন/i.test(part));
  const actionLabel = action?.split(/\s*•\s*/).find((part) => /[\u0980-\u09ff]/u.test(part)) ?? action;
  const [length, ...extras] = duration?.split(/\s*\+\s*/) ?? [];
  const features = [
    ...extras,
    ...parts.filter(
      (part) => ![price, duration, cadence, schedule, action].includes(part) && !/^whatsapp\b/i.test(part),
    ),
  ];

  return {
    title,
    price: price?.replace(/\s*(?:BDT|TK|৳)$/i, ""),
    duration: length,
    cadence,
    schedule,
    features,
    action: actionLabel ?? "Enquire on WhatsApp",
    freeClass: Boolean(action),
  };
}

function CourseCard({ node, index }: { node: ContentNode | string; index: number }) {
  const course = readCourse(node);
  const look = courseLooks[index % courseLooks.length];
  const href = `${whatsapp}?text=${encodeURIComponent(`Hi TestPrep Center! I'd like to learn more about ${course.title}${course.freeClass ? " and join a free class" : ""}.`)}`;

  return (
    <li
      className={styles.courseItem}
      data-aos={["fade-right", "zoom-in", "fade-left"][index % 3]}
      data-aos-delay={(index % 3) * 100}
    >
      <article className={styles.courseCard} data-theme={look.theme}>
        <div className={styles.cardArt}>
          <Image
            className={styles.coursePhoto}
            src={`/images/home/bangladesh/${look.image}.webp`}
            alt={look.alt}
            fill
            sizes="(max-width: 760px) 90vw, 380px"
          />
        </div>

        <div className={styles.cardContent}>
          <h3 className={styles.courseTitle}>{course.title}</h3>
          <div className={styles.courseMeta}>
            {course.duration && (
              <span>
                <Clock3 aria-hidden="true" size={15} />
                {course.duration}
              </span>
            )}
            {course.cadence && (
              <span>
                <BookOpen aria-hidden="true" size={15} />
                {course.cadence}
              </span>
            )}
          </div>

          {course.features[0] && (
            <p className={styles.courseHighlight}>
              <Check aria-hidden="true" size={15} />
              {course.features[0]}
            </p>
          )}
          {course.schedule && (
            <p className={styles.courseSchedule}>
              <CalendarDays aria-hidden="true" size={15} />
              {course.schedule}
            </p>
          )}

          {(course.features.length > 0 || course.schedule) && (
            <details className={styles.courseDetails}>
              <summary>
                <span>
                  Course details<span className={styles.srOnly}> for {course.title}</span>
                </span>
                <ChevronDown aria-hidden="true" size={15} />
              </summary>
              <div className={styles.detailsContent}>
                <ul>
                  {course.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>
                      <Check aria-hidden="true" size={14} />
                      {feature}
                    </li>
                  ))}
                </ul>
                {course.schedule && (
                  <p>
                    <CalendarDays aria-hidden="true" size={14} />
                    {course.schedule}
                  </p>
                )}
              </div>
            </details>
          )}

          <div className={styles.courseFooter}>
            <div className={styles.priceRow}>
              <p className={styles.coursePrice}>
                {course.price ? (
                  <>
                    <span>৳</span>
                    {course.price}
                  </>
                ) : (
                  "Let’s talk"
                )}
              </p>
              <span className={styles.feeLabel}>{course.price ? "Full course fee" : "Ask about this course"}</span>
            </div>
            <a
              className={styles.courseAction}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${course.action} — ${course.title} on WhatsApp (opens in a new tab)`}
            >
              <span lang={/[\u0980-\u09ff]/u.test(course.action) ? "bn" : "en"}>{course.action}</span>
              <ArrowUpRight aria-hidden="true" size={21} />
            </a>
          </div>
        </div>
      </article>
    </li>
  );
}

export default function CourseShowcase({ section }: { section: HomeSection }) {
  const offers = section.content.find((node) => node.tag === "ul");
  const nav = section.content.find((node) => node.tag === "nav");
  const links = nav?.children ?? [];
  const contact = links.find((node) => /whatsapp/i.test(contentText(node)));

  return (
    <section className={styles.showcase} id={section.id} aria-labelledby={`${section.id}-title`}>
      <span id="AnnouncementBar" className={styles.legacyAnchor} aria-hidden="true" />
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.showcaseInner}>
        <header className={styles.showcaseHeader}>
          <h2 id={`${section.id}-title`}>
            <AnimatedText text={contentText(section.content.find((node) => node.tag === "h2") ?? "All courses")} />
          </h2>
          <span className={styles.headerLine} aria-hidden="true" />
        </header>

        <span id="AnnouncementBar-courses" className={styles.legacyAnchor} aria-hidden="true" />
        <ul className={styles.courseGrid} id={`${section.id}-courses`} aria-label="Available courses">
          {offers?.children.map((node, index) => (
            <CourseCard key={index} node={node} index={index} />
          ))}
        </ul>

        <div className={styles.contactPanel} data-aos="zoom-in">
          <div className={styles.contactIntro}>
            <span className={styles.contactIcon} aria-hidden="true">
              <MessageCircle size={24} strokeWidth={1.6} />
              <span />
            </span>
            <div>
              <h3>A little guidance goes a long way.</h3>
              <p>Need help choosing? Let’s find your fit.</p>
            </div>
          </div>
          <a
            className={styles.whatsappAction}
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with TestPrep Center on WhatsApp (opens in a new tab)"
          >
            <FaWhatsapp aria-hidden="true" size={21} />
            <span>
              Chat with us<small>{contact ? contentText(contact).replace(/^whatsapp\s*/i, "") : "01786558855"}</small>
            </span>
            <ArrowUpRight aria-hidden="true" size={20} />
          </a>
        </div>

        <div className={styles.communityRow} data-aos="fade-left">
          <p>
            <span aria-hidden="true" />
            Keep learning. Stay connected.
          </p>
          <nav className={styles.communityLinks} aria-label="TestPrep Center communities">
            {links
              .filter((node) => !/whatsapp/i.test(contentText(node)))
              .map((node, index) => {
                const label = contentText(node);
                const youtube = /youtube/i.test(label);
                const kids = /kids/i.test(label);
                const Icon = youtube ? FaYoutube : FaFacebookF;
                const href = youtube
                  ? "https://www.youtube.com/results?search_query=TestPrep+Center"
                  : kids
                    ? "https://www.facebook.com/groups/tpckids"
                    : "https://www.facebook.com/TestPrepCenter.BD/";
                return (
                  <a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in a new tab)`}
                  >
                    <Icon aria-hidden="true" size={14} />
                    <span>{label}</span>
                    <ArrowRight aria-hidden="true" size={13} />
                  </a>
                );
              })}
          </nav>
        </div>
      </div>
    </section>
  );
}
