/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

import { defaultDataSection34, getYouTubeEmbedUrl, Section34Data, Section34Payload, Section34Props } from "./data";

const QuerySection34 = ({ data }: Section34Props) => {
  let settings: Section34Data = { ...defaultDataSection34 };
  let paddingX = 0;
  let paddingY = 0;
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as Partial<Section34Payload>;
      settings = { ...defaultDataSection34, ...parsed, videos: parsed.videos ?? defaultDataSection34.videos };
      paddingX = Math.max(0, Number(parsed.paddingX) || 0);
      paddingY = Math.max(0, Number(parsed.paddingY) || 0);
    } catch (error) {
      console.error("Error parsing section-34 data:", error);
    }
  } else if (data) {
    settings = {
      ...defaultDataSection34,
      ...data,
      videos: data.videos ?? defaultDataSection34.videos,
    } as Section34Data;
    paddingX = Math.max(0, Number((data as Partial<Section34Payload>).paddingX) || 0);
    paddingY = Math.max(0, Number((data as Partial<Section34Payload>).paddingY) || 0);
  }

  return (
    <main
      className="mx-auto w-full max-w-7xl custom-parent-border bg-white"
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
    >
      <section className="relative overflow-hidden bg-[#fffaf0] px-4 py-14 sm:px-6 sm:py-20">
        <div
          className="pointer-events-none absolute -left-20 top-12 h-56 w-56 rounded-full bg-[#f5d9bc]/65 blur-3xl"
          style={{ animation: "soft-pulse 6s ease-in-out infinite" }}
        />
        <div
          className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#e6d8f5]/65 blur-3xl"
          style={{ animation: "soft-pulse 7s ease-in-out 900ms infinite" }}
        />
        <div
          className="pointer-events-none absolute left-1/2 top-20 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full border border-[#e8d8bd]/70"
          style={{ animation: "orbit 22s linear infinite" }}
        />
        <div className="relative mx-auto max-w-6xl">
          <div
            className="relative mb-10 text-center sm:mb-14"
            style={{ animation: "modal-enter 620ms cubic-bezier(0.22, 1, 0.36, 1) both" }}
          >
            <div className="mx-auto mb-4 h-px w-20 bg-gradient-to-r from-transparent via-[#c48b4d] to-transparent" />
            <p className="relative mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#9a5b39]">
              {settings.badgeText}
            </p>
            <h2 className="relative mb-3 text-3xl font-black tracking-tight text-[#49352b] sm:text-5xl">
              {settings.title}
            </h2>
            <p className="relative mx-auto max-w-2xl text-sm leading-6 text-[#765f50] sm:text-base">
              {settings.subtitle}
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {settings.videos.map((video, index) => (
              <article
                key={video.id}
                className="group relative overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffdf8] shadow-[0_14px_35px_rgba(104,67,42,0.10)] transition-all duration-700 hover:-translate-y-2 hover:border-[#d39a66] hover:shadow-[0_24px_46px_rgba(142,85,53,0.20)]"
                style={{ animation: `modal-enter 620ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 130 + 120}ms both` }}
              >
                <div
                  className="relative aspect-video overflow-hidden border-b border-[#eadfca]"
                  style={{ backgroundColor: video.backgroundColor }}
                >
                  {getYouTubeEmbedUrl(video.link) ? (
                    <iframe
                      className="h-full w-full"
                      src={getYouTubeEmbedUrl(video.link)!}
                      title={video.label}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#684231] via-[#9a5b39] to-[#c48b4d] text-sm font-semibold text-white/90">
                      YouTube video coming soon
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#3f281e]/45 to-transparent opacity-0 transition duration-700 group-hover:opacity-100" />
                </div>
                <div className="relative bg-gradient-to-br from-[#fffdf8] to-[#fff4e4] p-5">
                  <div className="mb-3 h-0.5 w-12 bg-gradient-to-r from-[#a5603b] to-[#d3ab72] transition-all duration-700 group-hover:w-24" />
                  <h3 className="text-lg font-bold text-[#49352b] transition-colors duration-700 group-hover:text-[#9a5b39]">
                    {video.label}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#765f50]">{video.sub}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default QuerySection34;
