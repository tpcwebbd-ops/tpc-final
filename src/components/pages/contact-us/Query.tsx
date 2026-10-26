/*
|-----------------------------------------
| setting up Query.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 30 August, 2026
|-----------------------------------------
*/

import { defaultData } from "./data";

type OpeningDay = { day: string; openTime: string; closeTime: string };
function readDays(value: string | undefined) {
  try {
    const days = JSON.parse(value ?? defaultData.openingDays) as OpeningDay[];
    return Array.isArray(days) ? days : [];
  } catch {
    return JSON.parse(defaultData.openingDays) as OpeningDay[];
  }
}
const formatTime = (value: string) => {
  if (!value) return "Closed";
  const [hour, minute] = value.split(":").map(Number);
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
};

export default function Query({ data = defaultData }: { data?: Record<string, string> }) {
  const days = readDays(data.openingDays);
  const value = (key: keyof typeof defaultData) => data[key] || defaultData[key];
  const openAllDay = value("open247") === "true";
  return (
    <section className="overflow-hidden custom-parent-border bg-white">
      <div className="border-b border-amber-200 bg-amber-50 p-7 text-stone-900 sm:p-10">
        {value("showEyebrow") !== "false" && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">Contact</p>
        )}
        <h1 className="mt-2 text-3xl font-semibold">{value("title")}</h1>
        <p className="mt-3 max-w-2xl text-sm text-stone-600">{value("intro")}</p>
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
          <iframe
            className="mt-3 h-52 w-full rounded-sm border border-[#eadfca]"
            loading="lazy"
            src={value("mapUrl")}
            title="Google Map"
          />
        </div>
        <div className="border-t border-[#eadfca] p-6 md:border-l md:border-t-0">
          {openAllDay ? (
            <div className="relative overflow-hidden rounded-md border border-emerald-200 bg-emerald-50 p-6 text-center">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-100" />
              <div className="absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-amber-100" />
              <div className="relative">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-600 text-2xl text-white shadow-sm">
                  ✓
                </span>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Availability</p>
                <h2 className="mt-2 text-2xl font-semibold text-stone-900">Always open</h2>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-stone-600">
                  We are always open, every day and every hour. Reach out whenever it is convenient for you.
                </p>
                <span className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200">
                  Open 24 hours · 7 days a week
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Availability</p>
                <h2 className="mt-1 text-xl font-semibold text-stone-900">Opening Days</h2>
              </div>
              <div className="overflow-hidden rounded-sm border border-emerald-200">
                <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-emerald-50 px-3 py-2 text-xs font-semibold text-stone-700">
                  <span>Day</span>
                  <span>Opening time</span>
                  <span>Closing time</span>
                </div>
                {days.map((item, index) => (
                  <div
                    className="grid grid-cols-[1.2fr_1fr_1fr] border-t border-emerald-100 px-3 py-3 text-sm text-stone-700"
                    key={`${item.day}-${index}`}
                  >
                    <span className="font-medium text-stone-900">{item.day}</span>
                    <span>{formatTime(item.openTime)}</span>
                    <span>{formatTime(item.closeTime)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
