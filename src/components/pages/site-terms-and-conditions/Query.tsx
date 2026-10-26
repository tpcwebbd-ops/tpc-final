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
  defaultDataSiteTermsAndConditions,
  defaultLayout,
  type ISiteTermsAndConditionsData,
  type SiteTermsAndConditionsPayload,
  type SiteTermsAndConditionsProps,
} from "./data";

const parseData = (
  data?: ISiteTermsAndConditionsData | SiteTermsAndConditionsPayload | string,
): SiteTermsAndConditionsPayload => {
  try {
    const incoming = typeof data === "string" ? (JSON.parse(data) as Partial<SiteTermsAndConditionsPayload>) : data;
    return {
      ...defaultDataSiteTermsAndConditions,
      ...defaultLayout,
      ...incoming,
      pageUid: "site-terms-and-conditions-uid",
      pageName: "Site Terms & Conditions",
      sections: Array.isArray(incoming?.sections) ? incoming.sections : defaultDataSiteTermsAndConditions.sections,
    };
  } catch {
    return { ...defaultDataSiteTermsAndConditions, ...defaultLayout };
  }
};
const QuerySiteTermsAndConditions = ({ data }: SiteTermsAndConditionsProps) => {
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
            <p className="text-sm font-semibold tracking-[0.16em] text-amber-700 uppercase">{pageData.eyebrow}</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              {pageData.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-stone-600 sm:text-lg">{pageData.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                className="cursor-pointer bg-lime-200 text-lime-950 transition duration-700 hover:bg-lime-300"
                size="sm"
                type="button"
              >
                {pageData.primaryAction} {iconMap.ArrowRight}
              </Button>
              <Button
                className="cursor-pointer bg-amber-100 text-amber-950 transition duration-700 hover:bg-amber-200"
                size="sm"
                type="button"
                variant="outline"
              >
                {pageData.secondaryAction}
              </Button>
            </div>
          </div>
          <aside className="grid content-start gap-3 rounded-sm border border-[#eadfca] bg-amber-50/50 p-4">
            <span className="text-amber-700">{iconMap.FileSignature}</span>
            <p className="text-xs font-semibold tracking-[0.14em] text-amber-800 uppercase">{pageData.pageName}</p>
            <p className="text-xl font-semibold text-stone-900">Clear agreements create smoother project delivery.</p>
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
                <div className="min-w-0">
                  <p
                    className="truncate text-xs font-semibold tracking-[0.14em] text-amber-800 uppercase"
                    title={section.eyebrow}
                  >
                    {section.eyebrow}
                  </p>
                  <h2 className="mt-1 truncate text-lg font-semibold text-stone-900" title={section.title}>
                    {section.title}
                  </h2>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-stone-600" title={section.description}>
                {section.description}
              </p>
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
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};
export default QuerySiteTermsAndConditions;
