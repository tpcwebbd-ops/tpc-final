/*
|-----------------------------------------
| setting up Preview.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

import { defaultData } from "./data";
export default function Preview({ data = defaultData }: { data?: Record<string, string> }) {
  const fields = [
    {
      key: "showName",
      label: data.nameLabel ?? defaultData.nameLabel,
      placeholder: data.namePlaceholder ?? defaultData.namePlaceholder,
    },
    {
      key: "showEmail",
      label: data.emailLabel ?? defaultData.emailLabel,
      placeholder: data.emailPlaceholder ?? defaultData.emailPlaceholder,
    },
    {
      key: "showPhone",
      label: data.phoneLabel ?? defaultData.phoneLabel,
      placeholder: data.phonePlaceholder ?? defaultData.phonePlaceholder,
    },
    {
      key: "showMessage",
      label: data.messageLabel ?? defaultData.messageLabel,
      placeholder: data.messagePlaceholder ?? defaultData.messagePlaceholder,
    },
  ].filter(({ key }) => data[key] !== "false");
  return (
    <section className="rounded-sm border border-stone-200 bg-white p-5">
      <h2 className="font-semibold">{data.heading ?? defaultData.heading}</h2>
      <div className="mt-3 grid gap-2">
        {fields.map(({ key, label, placeholder }) => (
          <div className="grid gap-1" key={key}>
            <span className="text-xs font-medium text-stone-600">{label}</span>
            <div className="rounded-sm border border-stone-200 px-3 py-2 text-sm text-stone-400">{placeholder}</div>
          </div>
        ))}
      </div>
      <span className="mt-3 inline-block rounded-sm bg-amber-700 px-3 py-2 text-sm text-white">
        {data.buttonLabel ?? defaultData.buttonLabel}
      </span>
    </section>
  );
}
