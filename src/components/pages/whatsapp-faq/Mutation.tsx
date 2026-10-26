/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 29 August, 2026
|-----------------------------------------
*/

"use client";

import { LayoutPanelTop, MessageCircle, MoveHorizontal, Plus, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";

import {
  defaultDataWhatsAppFaq,
  defaultLayout,
  defaultWhatsAppFaqItem,
  type IWhatsAppFaqData,
  type WhatsAppFaqItem,
  type WhatsAppFaqPayload,
} from "./data";

export interface WhatsAppFaqFormProps {
  data?: IWhatsAppFaqData | WhatsAppFaqPayload;
  onChange?: (values: WhatsAppFaqPayload) => void;
}

const normalizeData = (data?: IWhatsAppFaqData | WhatsAppFaqPayload): WhatsAppFaqPayload => ({
  ...defaultDataWhatsAppFaq,
  ...defaultLayout,
  ...data,
  pageUid: "whatsapp-faq-uid",
  pageName: "WhatsApp FAQ",
  faqs: Array.isArray(data?.faqs) ? data.faqs : defaultDataWhatsAppFaq.faqs,
});
const emptyFaq = (): WhatsAppFaqItem => ({ ...defaultWhatsAppFaqItem });

const MutationWhatsAppFaq = ({ data, onChange }: WhatsAppFaqFormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload = normalizeData(data);
  const [formData, setFormData] = useState<IWhatsAppFaqData>(initialPayload);
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [toast, setToast] = useState("");
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    const nextData = normalizeData(data);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((current) => (JSON.stringify(current) === JSON.stringify(nextData) ? current : nextData));
    setPaddingX((current) => (current === nextData.paddingX ? current : nextData.paddingX));
    setPaddingY((current) => (current === nextData.paddingY ? current : nextData.paddingY));
  }, [data]);
  useEffect(() => {
    onChangeRef.current?.({ ...formData, paddingX, paddingY, pageUid: "whatsapp-faq-uid", pageName: "WhatsApp FAQ" });
  }, [formData, paddingX, paddingY]);
  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const next = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(next);
    else setPaddingY(next);
  };
  const updateFaq = (index: number, field: keyof WhatsAppFaqItem, value: string) =>
    setFormData((current) => ({
      ...current,
      faqs: current.faqs.map((faq, faqIndex) => (faqIndex === index ? { ...faq, [field]: value } : faq)),
    }));
  const addFaq = () => {
    setFormData((current) => ({ ...current, faqs: [...current.faqs, emptyFaq()] }));
    setToast("New FAQ added.");
  };
  const removeFaq = () => {
    if (deleteIndex === null) return;
    setFormData((current) => ({ ...current, faqs: current.faqs.filter((_, index) => index !== deleteIndex) }));
    setDeleteIndex(null);
    setToast("FAQ removed.");
  };

  return (
    <div className="custom-parent-border w-full min-w-0 overflow-x-hidden bg-[#f8f7f4] text-stone-800">
      <Toast message={toast} onDismiss={() => setToast("")} />
      <div className="mx-auto w-full min-w-0 max-w-7xl border-x border-[#e8e3d9] bg-white">
        <header className="border-b border-[#e8e3d9] bg-gradient-to-r from-emerald-950 to-stone-900 px-4 py-5 text-white sm:px-6">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-emerald-200 uppercase">
                <Sparkles className="size-4" /> Content studio
              </div>
              <h2 className="text-xl font-semibold tracking-tight">Build your WhatsApp FAQ page</h2>
              <p className="mt-1 text-sm text-stone-300">
                Make it easy for visitors to find answers and start a WhatsApp conversation.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-sm border border-white/15 bg-white/10 px-3 py-2 text-xs text-stone-200 sm:self-auto">
              <LayoutPanelTop className="size-4 text-emerald-200" /> whatsapp-faq-uid
            </div>
          </div>
        </header>
        <ScrollArea className="max-h-[calc(100vh-12rem)] w-full min-w-0 overflow-x-hidden">
          <div className="mx-auto grid w-full min-w-0 max-w-6xl gap-5 pb-8 lg:grid-cols-12">
            <section className="grid min-w-0 gap-4 rounded-sm border border-[#e8e3d9] bg-[#fffdf9] p-4 shadow-sm lg:col-span-7">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-emerald-700 uppercase">01 · Contact prompt</p>
                <h3 className="mt-1 text-lg font-semibold text-stone-900">WhatsApp call to action</h3>
                <p className="mt-1 text-sm text-stone-600">This content appears beside the FAQ list.</p>
              </div>
              <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                <div className="grid min-w-0 gap-1.5">
                  <Label htmlFor="whatsapp-faq-name">Page label</Label>
                  <Input
                    className="box-border max-w-full"
                    id="whatsapp-faq-name"
                    value={formData.pageName}
                    onChange={(e) => setFormData((c) => ({ ...c, pageName: e.target.value }))}
                  />
                </div>
                <div className="grid min-w-0 gap-1.5">
                  <Label htmlFor="whatsapp-faq-label">Button text</Label>
                  <Input
                    className="box-border max-w-full"
                    id="whatsapp-faq-label"
                    value={formData.whatsappLabel}
                    onChange={(e) => setFormData((c) => ({ ...c, whatsappLabel: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid min-w-0 gap-1.5">
                <Label htmlFor="whatsapp-faq-heading">Main heading</Label>
                <Textarea
                  className="box-border min-h-24 max-w-full"
                  id="whatsapp-faq-heading"
                  value={formData.heading}
                  onChange={(e) => setFormData((c) => ({ ...c, heading: e.target.value }))}
                />
              </div>
              <div className="grid min-w-0 gap-1.5">
                <Label htmlFor="whatsapp-faq-number">WhatsApp number</Label>
                <div className="relative min-w-0">
                  <MessageCircle className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-emerald-600" />
                  <Input
                    className="box-border max-w-full pl-9"
                    id="whatsapp-faq-number"
                    inputMode="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData((c) => ({ ...c, whatsappNumber: e.target.value }))}
                  />
                </div>
                <p className="text-xs text-stone-500">Use international format, e.g. +880 17…</p>
              </div>
            </section>
            <aside className="grid min-w-0 content-start gap-4 rounded-sm border border-emerald-200 bg-emerald-50 p-4 lg:col-span-5">
              <div>
                <p className="text-xs font-bold tracking-[0.14em] text-emerald-800 uppercase">02 · Layout</p>
                <h3 className="mt-1 text-lg font-semibold text-stone-900">Page spacing</h3>
                <p className="mt-1 text-sm leading-6 text-stone-600">
                  Adjust the horizontal and vertical space around the full FAQ page.
                </p>
              </div>
              {(
                [
                  ["paddingX", "Padding X", paddingX],
                  ["paddingY", "Padding Y", paddingY],
                ] as const
              ).map(([field, label, value]) => (
                <div className="grid min-w-0 gap-3 border-t border-emerald-200 pt-4" key={field}>
                  <div className="flex items-center justify-between gap-3">
                    <Label className="flex items-center gap-2">
                      <MoveHorizontal className="size-4 text-emerald-700" /> {label}
                    </Label>
                    <span className="rounded-full bg-emerald-800 px-2.5 py-1 text-xs font-semibold text-white">
                      {value}px
                    </span>
                  </div>
                  <Slider
                    aria-label={label}
                    max={300}
                    min={-300}
                    onValueChange={([nextValue]) => updateSpacing(field, nextValue)}
                    step={1}
                    value={[value]}
                  />
                  <div className="flex justify-between text-[11px] font-medium text-stone-500">
                    <span>-300</span>
                    <span>0</span>
                    <span>+300</span>
                  </div>
                </div>
              ))}
            </aside>
            <section className="grid min-w-0 gap-4 lg:col-span-12">
              <div className="flex min-w-0 flex-col gap-3 rounded-sm border border-[#e8e3d9] bg-stone-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-bold tracking-[0.14em] text-emerald-700 uppercase">03 · Answers</p>
                  <h3 className="mt-1 text-lg font-semibold text-stone-900">Frequently asked questions</h3>
                  <p className="text-sm text-stone-600">Visitors see these as expandable questions.</p>
                </div>
                <Button
                  className="cursor-pointer bg-emerald-800 text-white hover:bg-emerald-700"
                  onClick={addFaq}
                  type="button"
                >
                  <Plus className="size-4" /> Add FAQ
                </Button>
              </div>
              {formData.faqs.length === 0 && (
                <div className="border border-dashed border-stone-300 bg-stone-50 p-8 text-center text-sm text-stone-600">
                  No FAQ entries yet. Add a question to build this area.
                </div>
              )}
              <div className="grid min-w-0 grid-cols-1 gap-4">
                {formData.faqs.map((faq, index) => (
                  <article
                    className="grid min-w-0 gap-4 rounded-sm border border-[#e8e3d9] bg-white p-4 shadow-sm"
                    key={`${faq.question}-${index}`}
                  >
                    <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-sm bg-emerald-100 text-sm font-bold text-emerald-900">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <h4 className="break-words text-sm font-semibold text-stone-900 sm:truncate sm:text-base">
                            {faq.question || "Untitled question"}
                          </h4>
                          <p className="text-xs text-stone-500">FAQ entry</p>
                        </div>
                      </div>
                      <Button
                        aria-label={`Delete ${faq.question || `FAQ ${index + 1}`}`}
                        className="cursor-pointer text-red-700 hover:bg-red-50 hover:text-red-800"
                        onClick={() => setDeleteIndex(index)}
                        size="icon-sm"
                        type="button"
                        variant="ghost"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    <div className="grid min-w-0 gap-1.5">
                      <Label htmlFor={`whatsapp-faq-question-${index}`}>Question</Label>
                      <Textarea
                        className="box-border min-h-20 max-w-full"
                        id={`whatsapp-faq-question-${index}`}
                        value={faq.question}
                        onChange={(e) => updateFaq(index, "question", e.target.value)}
                      />
                    </div>
                    <div className="grid min-w-0 gap-1.5">
                      <Label htmlFor={`whatsapp-faq-answer-${index}`}>Answer</Label>
                      <Textarea
                        className="box-border min-h-32 max-w-full"
                        id={`whatsapp-faq-answer-${index}`}
                        value={faq.answer}
                        onChange={(e) => updateFaq(index, "answer", e.target.value)}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </ScrollArea>
      </div>
      <AlertDialog
        busy={false}
        description="This removes the FAQ from the current editor. You can add another question whenever needed."
        onCancel={() => setDeleteIndex(null)}
        onConfirm={removeFaq}
        open={deleteIndex !== null}
        title="Delete this FAQ?"
      />
    </div>
  );
};
export default MutationWhatsAppFaq;
