/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

import { iconMap } from "@/components/all-icons/all-icons";
import { Button } from "@/components/ui/button";

import {
  defaultDataCookiePolicy,
  defaultLayout,
  type ICookiePolicyData,
  type CookiePolicyPayload,
  type CookiePolicyProps,
} from "./data";

const parseData = (data?: ICookiePolicyData | CookiePolicyPayload | string): CookiePolicyPayload => {
  try {
    const incoming = typeof data === "string" ? (JSON.parse(data) as Partial<CookiePolicyPayload>) : data;
    return {
      ...defaultDataCookiePolicy,
      ...defaultLayout,
      ...incoming,
      pageUid: "cookie-policy-uid",
      pageName: "Cookie Policy",
      sections: Array.isArray(incoming?.sections) ? incoming.sections : defaultDataCookiePolicy.sections,
    };
  } catch {
    return { ...defaultDataCookiePolicy, ...defaultLayout };
  }
};
const CookiePolicyQuery = ({ data }: CookiePolicyProps) => {
  const pageData = parseData(data);
  return (
    <main
      className="bg-white text-stone-800"
      style={{
        paddingInline: `${Math.max(0, Number(pageData.paddingX) || 0)}px`,
        paddingBlock: `${Math.max(0, Number(pageData.paddingY) || 0)}px`,
      }}
    >
      <section className="custom-parent-border">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-20">
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-[0.16em] text-amber-700 uppercase">{pageData.pageName}</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">{pageData.title}</h1>
            <p className="mt-4 text-sm text-stone-600">{pageData.lastUpdatedLabel}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                className="inline-flex items-center gap-1 rounded-sm bg-lime-200 px-2.5 py-1.5 text-[0.8rem] font-medium text-lime-950 transition duration-700 hover:bg-lime-300"
                href={`mailto:${pageData.supportEmail}`}
              >
                {iconMap.Mail} Contact us
              </a>
              <Button
                className="cursor-pointer bg-amber-100 text-amber-950 transition duration-700 hover:bg-amber-200"
                size="sm"
                type="button"
                variant="outline"
              >
                {iconMap.FileText} Cookie choices
              </Button>
            </div>
          </div>
          <aside className="grid content-start gap-3 rounded-sm border border-[#eadfca] bg-amber-50/50 p-4">
            <span className="text-amber-700">{iconMap.ShieldCheck}</span>
            <p className="text-xl font-semibold text-stone-900">
              Clear information about cookies and the choices available to visitors.
            </p>
            <p className="text-sm leading-6 text-stone-600">{pageData.sections[0]?.description}</p>
          </aside>
        </div>
      </section>
      <section className="border-x border-[#eadfca] border-t">
        <div className="mx-auto grid max-w-7xl gap-px bg-[#eadfca] sm:grid-cols-2 lg:grid-cols-3">
          {pageData.sections.map((section, index) => (
            <article className="min-w-0 bg-white p-4 sm:p-5" key={`${section.title}-${index}`}>
              <div className="flex items-start gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-sm bg-amber-100 text-sm font-semibold text-amber-900">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="min-w-0 truncate text-lg font-semibold text-stone-900" title={section.title}>
                  {section.title}
                </h2>
              </div>
              {section.description && (
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600" title={section.description}>
                  {section.description}
                </p>
              )}
              {section.items && (
                <ul className="mt-4 grid gap-2">
                  {section.items.slice(0, 3).map((item, itemIndex) => (
                    <li
                      className="flex min-w-0 items-center gap-2 text-sm text-stone-700"
                      key={`${item}-${itemIndex}`}
                      title={item}
                    >
                      <span className="shrink-0 text-lime-700">{iconMap.Check}</span>
                      <span className="truncate">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>
      <section className="border-x border-[#eadfca] border-t">
        <div className="mx-auto max-w-7xl p-4">
          <p className="text-xs font-semibold tracking-[0.14em] text-amber-800 uppercase">Cookie support</p>
          <h2 className="mt-1 text-xl font-semibold text-stone-900">{pageData.contactTitle}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">{pageData.contactDescription}</p>
          <a
            className="mt-3 inline-block break-all text-sm font-medium text-amber-800 underline"
            href={`mailto:${pageData.supportEmail}`}
          >
            {pageData.supportEmail}
          </a>
        </div>
      </section>
    </main>
  );
};
export default CookiePolicyQuery;
