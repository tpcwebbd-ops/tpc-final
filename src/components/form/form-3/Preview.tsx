/*
|-----------------------------------------
| setting up Preview.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 30 August, 2026
|-----------------------------------------
*/

import { defaultData } from "./data";

export default function Preview({ data = defaultData }: { data?: Record<string, string> }) {
  const value = (key: keyof typeof defaultData) => data[key] ?? defaultData[key];
  return (
    <section className="overflow-hidden custom-parent-border bg-white">
      <div className="bg-stone-950 p-7 text-white sm:p-10">
        <h1 className="text-3xl font-semibold">{value("title")}</h1>
        <p className="mt-3 text-sm text-stone-300">{value("intro")}</p>
      </div>
      <div className="grid gap-0 md:grid-cols-2">
        <div className="grid gap-3 p-6">
          <article>
            <b>{value("emailLabel")}</b>
            <p className="mt-1 text-sm text-stone-600">{value("email")}</p>
          </article>
          <article>
            <b>{value("addressLabel")}</b>
            <p className="mt-1 text-sm text-stone-600">{value("address")}</p>
          </article>
          <article>
            <b>{value("locationLabel")}</b>
            <p className="mt-1 text-sm text-stone-600">{value("location")}</p>
          </article>
          <div className="mt-3 h-32 rounded-sm border bg-stone-50 p-3 text-xs text-stone-500">
            Map preview
            <br />
            {value("mapUrl")}
          </div>
        </div>
        <div className="grid content-start gap-3 border-t border-[#eadfca] p-6 md:border-l md:border-t-0">
          <div>
            <b>{value("nameLabel")}</b>
            <div className="mt-1 rounded-sm border border-stone-200 p-2 text-sm text-stone-400">
              {value("namePlaceholder")}
            </div>
          </div>
          <div>
            <b>{value("emailFieldLabel")}</b>
            <div className="mt-1 rounded-sm border border-stone-200 p-2 text-sm text-stone-400">
              {value("emailPlaceholder")}
            </div>
          </div>
          <div>
            <b>{value("messageLabel")}</b>
            <div className="mt-1 min-h-20 rounded-sm border border-stone-200 p-2 text-sm text-stone-400">
              {value("messagePlaceholder")}
            </div>
          </div>
          <span className="w-fit rounded-sm bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-900">
            {value("buttonLabel")}
          </span>
        </div>
      </div>
    </section>
  );
}
