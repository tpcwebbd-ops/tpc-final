/*
|-----------------------------------------
| Video tutorial library for the dashboard
|-----------------------------------------
*/

"use client";

import { useEffect, useState } from "react";

import tutorialFile from "../../../../import-data-page.json";

type TutorialItem = {
  tag: string;
  sidebar_url?: string;
  yt_url: string;
  children?: TutorialItem[];
};

type TutorialFile = { tutorialData?: TutorialItem[] };

type TutorialTopic = {
  id: string;
  tag: string;
  path?: string;
  videoUrl: string;
  parentTag?: string;
  depth: 0 | 1;
};

const tutorialData = (tutorialFile as TutorialFile).tutorialData ?? [];

const topics = tutorialData.flatMap((item, parentIndex) => {
  const parent: TutorialTopic = {
    id: `tutorial-${parentIndex}`,
    tag: item.tag,
    path: item.sidebar_url,
    videoUrl: item.yt_url,
    depth: 0,
  };
  const children = (item.children ?? []).map((child, childIndex): TutorialTopic => ({
    id: `tutorial-${parentIndex}-${childIndex}`,
    tag: child.tag,
    path: child.sidebar_url,
    videoUrl: child.yt_url,
    parentTag: item.tag,
    depth: 1,
  }));
  return [parent, ...children];
});

function toYoutubeEmbedUrl(videoUrl: string) {
  try {
    const url = new URL(videoUrl);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    let videoId = "";

    if (host === "youtu.be") videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
    if (["youtube.com", "m.youtube.com"].includes(host)) {
      videoId = url.searchParams.get("v") ?? url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?#]+)/)?.[1] ?? "";
    }

    return /^[\w-]{11}$/.test(videoId)
      ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`
      : null;
  } catch {
    return null;
  }
}

export default function TutorialPage() {
  const [activeId, setActiveId] = useState(topics[0]?.id ?? "");
  const activeTopic = topics.find((topic) => topic.id === activeId) ?? topics[0];

  useEffect(() => {
    if (!topics.length) return;

    let frame = 0;
    const updateActiveTopic = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const anchor = 150;
        let nextActive = topics[0];

        for (const topic of topics) {
          const section = document.getElementById(topic.id);
          if (section && section.getBoundingClientRect().top <= anchor) nextActive = topic;
          else break;
        }
        setActiveId((current) => (current === nextActive.id ? current : nextActive.id));
      });
    };

    updateActiveTopic();
    window.addEventListener("scroll", updateActiveTopic, { passive: true });
    window.addEventListener("resize", updateActiveTopic);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateActiveTopic);
      window.removeEventListener("resize", updateActiveTopic);
    };
  }, []);

  function selectTopic(topic: TutorialTopic) {
    setActiveId(topic.id);
    document.getElementById(topic.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!topics.length) {
    return (
      <main className="grid min-h-[calc(100vh-65px)] place-items-center bg-[#fffaf0] p-4">
        <section className="rounded-sm border border-[#eadfca] bg-white p-8 text-center shadow-[0_20px_60px_-35px_rgba(120,53,15,.32)]">
          <h1 className="text-xl font-semibold text-stone-900">Tutorials are not available yet</h1>
          <p className="mt-2 text-sm text-stone-600">Add entries to the tutorial data file to show them here.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-65px)] bg-[#fffaf0] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="relative isolate overflow-hidden rounded-sm border border-[#eadfca] bg-white px-5 py-7 shadow-[0_20px_60px_-35px_rgba(120,53,15,.35)] sm:px-8 sm:py-9">
          <div
            aria-hidden="true"
            className="absolute -left-12 -top-16 h-44 w-44 animate-[soft-pulse_5s_ease-in-out_infinite] rounded-full bg-amber-200/55 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-20 right-8 h-44 w-44 animate-[soft-pulse_5s_ease-in-out_infinite] rounded-full bg-emerald-100/70 blur-3xl [animation-delay:1.4s]"
          />
          <div className="relative max-w-3xl animate-in fade-in slide-in-from-bottom-3 duration-700">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-800">Dashboard academy</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">Tutorial library</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
              Follow each dashboard workflow with a focused YouTube video. Choose a topic or scroll through the
              guides—the current lesson always stays highlighted.
            </p>
            <p className="mt-5 inline-flex rounded-sm border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-950">
              {topics.length} video tutorials
            </p>
          </div>
        </header>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-4">
            <nav
              aria-label="Tutorial topics"
              className="overflow-hidden rounded-sm border border-[#eadfca] bg-white p-2 shadow-[0_18px_45px_-35px_rgba(120,53,15,.28)]"
            >
              <div className="border-b border-[#eadfca] px-3 py-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">Contents</p>
                <p className="mt-1 text-sm font-semibold text-stone-900">{activeTopic?.tag}</p>
              </div>
              <div className="max-h-[calc(100vh-12rem)] space-y-1 overflow-y-auto p-2 pr-1">
                {topics.map((topic, index) => {
                  const active = topic.id === activeId;
                  return (
                    <button
                      aria-current={active ? "step" : undefined}
                      className={`group flex w-full items-center gap-2 rounded-sm py-2 text-left text-sm transition duration-300 motion-reduce:transition-none ${topic.depth === 1 ? "pl-6 pr-2" : "px-2.5"} ${active ? "bg-amber-100 text-amber-950 shadow-[inset_3px_0_0_rgb(217,119,6)]" : "text-stone-600 hover:bg-[#fffaf0] hover:text-stone-900"}`}
                      key={topic.id}
                      onClick={() => selectTopic(topic)}
                      type="button"
                    >
                      <span
                        className={`w-5 shrink-0 text-[10px] font-bold tabular-nums ${active ? "text-amber-800" : "text-stone-400"}`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1 truncate font-medium">{topic.tag}</span>
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 shrink-0 rounded-full transition ${active ? "scale-100 bg-amber-700" : "scale-0 bg-amber-400 group-hover:scale-100"}`}
                      />
                    </button>
                  );
                })}
              </div>
            </nav>
          </aside>

          <section aria-label="Tutorial videos" className="space-y-5">
            {topics.map((topic, index) => (
              <TutorialCard active={topic.id === activeId} index={index} key={topic.id} topic={topic} />
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}

function TutorialCard({ active, index, topic }: { active: boolean; index: number; topic: TutorialTopic }) {
  const embedUrl = toYoutubeEmbedUrl(topic.videoUrl);
  const title = topic.parentTag ? `${topic.parentTag} / ${topic.tag}` : topic.tag;

  return (
    <article
      aria-labelledby={`${topic.id}-title`}
      className={`scroll-mt-5 overflow-hidden rounded-sm border bg-white p-4 shadow-[0_18px_45px_-35px_rgba(120,53,15,.34)] transition-[border-color,box-shadow,transform] duration-500 motion-reduce:transition-none sm:p-5 ${active ? "border-amber-300 shadow-[0_22px_55px_-34px_rgba(180,83,9,.42)]" : "border-[#eadfca]"}`}
      id={topic.id}
      style={{ animationDelay: `${Math.min(index * 35, 420)}ms` }}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-800">
            Lesson {String(index + 1).padStart(2, "0")}
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl" id={`${topic.id}-title`}>
            {title}
          </h2>
        </div>
        {topic.path && (
          <p className="rounded-sm border border-[#eadfca] bg-[#fffaf0] px-2.5 py-1 text-xs font-medium text-stone-600">
            {topic.path}
          </p>
        )}
      </div>

      <div className="relative mt-4 aspect-video overflow-hidden rounded-sm border border-[#eadfca] bg-stone-950">
        {active && embedUrl ? (
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full animate-in fade-in duration-500"
            referrerPolicy="strict-origin-when-cross-origin"
            src={embedUrl}
            title={`${title} tutorial video`}
          />
        ) : active ? (
          <div className="grid h-full place-items-center bg-stone-900 p-6 text-center text-sm text-stone-200">
            This tutorial needs a valid YouTube video URL.
          </div>
        ) : (
          <div className="relative grid h-full place-items-center overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 p-6 text-center">
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-400/15 blur-2xl"
            />
            <p className="relative text-sm font-medium text-amber-50/85">
              Select or scroll to this lesson to load its video.
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
