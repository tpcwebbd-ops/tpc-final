/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

/*
|-----------------------------------------
| dashboard editor for section-4
|-----------------------------------------
*/

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons";
import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";

import { defaultDataSection4, type DashboardMetric, type ModerationItem, type Section4Data } from "./data";

type Props = {
  data?: Section4Data;
  onChange?: (values: Section4Data) => void;
};

const button = "cursor-pointer transition duration-700 hover:-translate-y-0.5 disabled:cursor-not-allowed";

export default function MutationSection4({ data, onChange }: Props) {
  const onChangeRef = useRef(onChange);
  const [formData, setFormData] = useState<Section4Data>(() => ({
    ...defaultDataSection4,
    ...data,
    showEyebrow: data?.showEyebrow ?? defaultDataSection4.showEyebrow,
    metrics: data?.metrics ?? defaultDataSection4.metrics,
    moderationQueue: data?.moderationQueue ?? defaultDataSection4.moderationQueue,
  }));
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [mediaIndex, setMediaIndex] = useState<number | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.(formData);
  }, [formData]);

  const setHeader = (field: "badge" | "title" | "subTitle", value: string) =>
    setFormData((current) => ({ ...current, [field]: value }));
  const setEyebrowVisibility = (showEyebrow: boolean) => setFormData((current) => ({ ...current, showEyebrow }));
  const updateMetric = (index: number, field: keyof DashboardMetric, value: string | number) =>
    setFormData((current) => ({
      ...current,
      metrics: current.metrics.map((metric, entry) => (entry === index ? { ...metric, [field]: value } : metric)),
    }));
  const updateItem = (
    index: number,
    field: "content" | "flagReason" | "timestamp" | "type" | "severity",
    value: string,
  ) =>
    setFormData((current) => ({
      ...current,
      moderationQueue: current.moderationQueue.map((item, entry) =>
        entry === index ? ({ ...item, [field]: value } as ModerationItem) : item,
      ),
    }));
  const updateAuthor = (index: number, field: keyof ModerationItem["author"], value: string | number) =>
    setFormData((current) => ({
      ...current,
      moderationQueue: current.moderationQueue.map((item, entry) =>
        entry === index ? { ...item, author: { ...item.author, [field]: value } } : item,
      ),
    }));
  const updatePadding = (field: "paddingX" | "paddingY", value: number) =>
    setFormData((current) => ({ ...current, [field]: Math.min(300, Math.max(-300, value)) }));
  const addMetric = () =>
    setFormData((current) => ({
      ...current,
      metrics: [
        ...current.metrics,
        { id: `metric-${Date.now()}`, label: "New metric", value: "0", trend: 0, status: "stable" },
      ],
    }));
  const addItem = () =>
    setFormData((current) => ({
      ...current,
      moderationQueue: [
        {
          id: `item-${Date.now()}`,
          type: "comment",
          content: "Describe the item awaiting review.",
          author: { name: "New author", avatar: "", trustScore: 50 },
          flagReason: "Manual review",
          timestamp: "Just now",
          severity: "low",
        },
        ...current.moderationQueue,
      ],
    }));

  return (
    <div className="custom-parent-border min-h-full bg-white text-stone-800">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <header className="border-b border-[#eadfca] pb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Page section</p>
            <h1 className="mt-1 text-2xl font-semibold text-stone-900">Network dashboard</h1>
            <p className="mt-1 text-sm text-stone-600">Edit the metrics and moderation view shown on your page.</p>
          </div>
        </header>
        <Tabs className="mt-6" defaultValue="overview">
          <TabsList className="w-full justify-start gap-2 border-b border-[#eadfca] pb-3">
            <TabsTrigger
              className={`${button} rounded-sm border border-[#eadfca] bg-white px-3 py-2 text-sm text-stone-700 data-[state=active]:border-amber-300 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-950`}
              value="overview"
            >
              {iconMap.Settings} Overview
            </TabsTrigger>
            <TabsTrigger
              className={`${button} rounded-sm border border-[#eadfca] bg-white px-3 py-2 text-sm text-stone-700 data-[state=active]:border-amber-300 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-950`}
              value="metrics"
            >
              {iconMap.BarChart} Metrics
            </TabsTrigger>
            <TabsTrigger
              className={`${button} rounded-sm border border-[#eadfca] bg-white px-3 py-2 text-sm text-stone-700 data-[state=active]:border-amber-300 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-950`}
              value="queue"
            >
              {iconMap.ShieldCheck} Queue
            </TabsTrigger>
          </TabsList>
          <TabsContent className="mt-5 space-y-5" value="overview">
            <Panel title="Section details">
              <div className="grid gap-4">
                <div className="flex items-center justify-between rounded-sm border border-[#eadfca] bg-[#fffdf8] p-3">
                  <div>
                    <Label className="font-medium text-stone-800">Show eyebrow</Label>
                    <p className="mt-1 text-xs text-stone-500">Show or hide the badge above the section title.</p>
                  </div>
                  <Switch checked={formData.showEyebrow} onCheckedChange={setEyebrowVisibility} />
                </div>
                <Field label="Badge">
                  <Input value={formData.badge} onChange={(event) => setHeader("badge", event.target.value)} />
                </Field>
                <Field label="Title">
                  <Input value={formData.title} onChange={(event) => setHeader("title", event.target.value)} />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Subtitle">
                    <Textarea
                      className="min-h-36"
                      rows={6}
                      value={formData.subTitle}
                      onChange={(event) => setHeader("subTitle", event.target.value)}
                    />
                  </Field>
                </div>
              </div>
            </Panel>
            <Panel title="Layout spacing">
              <div className="border-l-2 border-amber-300 pl-4">
                <p className="mb-4 text-xs leading-5 text-stone-500">
                  Adjust the horizontal and vertical breathing room for the public dashboard preview.
                </p>
                <div className="grid gap-4">
                  {(["paddingX", "paddingY"] as const).map((field) => {
                    const value = formData[field];
                    const label = field === "paddingX" ? "Padding X" : "Padding Y";
                    return (
                      <div className="rounded-sm border border-[#eadfca] bg-[#fffdf8] p-4" key={field}>
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <Label className="font-medium text-stone-800">{label}</Label>
                          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold tabular-nums text-amber-900">
                            {value}px
                          </span>
                        </div>
                        <Input
                          aria-label={`${label} manual value`}
                          className="mb-3 bg-white"
                          max={300}
                          min={-300}
                          onChange={(event) => updatePadding(field, Number(event.target.value) || 0)}
                          type="number"
                          value={value}
                        />
                        <Slider
                          aria-label={label}
                          min={-300}
                          max={300}
                          step={1}
                          value={[value]}
                          onValueChange={([nextValue]) => updatePadding(field, nextValue ?? 0)}
                        />
                        <div className="mt-2 flex justify-between text-[10px] font-medium text-stone-400">
                          <span>-300px</span>
                          <span>0</span>
                          <span>+300px</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 text-[11px] leading-4 text-stone-500">
                  Negative values are accepted in the editor, while the public preview clamps padding to 0px because CSS
                  padding cannot be negative.
                </p>
              </div>
            </Panel>
          </TabsContent>
          <TabsContent className="mt-5" value="metrics">
            <Panel
              action={
                <Button
                  className={`${button} bg-amber-100 text-amber-950 hover:bg-amber-200`}
                  onClick={addMetric}
                  size="sm"
                >
                  {iconMap.Plus} Add metric
                </Button>
              }
              title="Metrics"
            >
              <div className="grid gap-4">
                {formData.metrics.map((metric, index) => (
                  <div className="rounded-sm border border-[#eadfca] bg-[#fffdf8] p-4" key={metric.id}>
                    <div className="grid gap-3">
                      <Field label="Label">
                        <Input
                          value={metric.label}
                          onChange={(event) => updateMetric(index, "label", event.target.value)}
                        />
                      </Field>
                      <Field label="Value">
                        <Input
                          value={metric.value}
                          onChange={(event) => updateMetric(index, "value", event.target.value)}
                        />
                      </Field>
                      <Field label="Trend">
                        <Input
                          type="number"
                          value={metric.trend}
                          onChange={(event) => updateMetric(index, "trend", Number(event.target.value))}
                        />
                      </Field>
                      <Field label="Status">
                        <Select value={metric.status} onValueChange={(value) => updateMetric(index, "status", value)}>
                          <SelectTrigger className="border-[#eadfca] bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-[#eadfca] bg-white">
                            <SelectItem value="stable">Stable</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </TabsContent>
          <TabsContent className="mt-5" value="queue">
            <Panel
              action={
                <Button
                  className={`${button} bg-amber-100 text-amber-950 hover:bg-amber-200`}
                  onClick={addItem}
                  size="sm"
                >
                  {iconMap.Plus} Add item
                </Button>
              }
              title="Moderation queue"
            >
              <div className="space-y-4">
                {formData.moderationQueue.map((item, index) => (
                  <article className="rounded-sm border border-[#eadfca] bg-[#fffdf8] p-4" key={item.id}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-medium text-stone-900">Queue item {index + 1}</p>
                      <Button
                        className={`${button} bg-red-100 text-red-800 hover:bg-red-200`}
                        onClick={() => setDeleteIndex(index)}
                        size="sm"
                      >
                        {iconMap.Trash2} Delete
                      </Button>
                    </div>
                    <div className="mt-4 grid gap-4">
                      <Field label="Author">
                        <Input
                          value={item.author.name}
                          onChange={(event) => updateAuthor(index, "name", event.target.value)}
                        />
                      </Field>
                      <Field label="Trust score">
                        <Input
                          max="100"
                          min="0"
                          type="number"
                          value={item.author.trustScore}
                          onChange={(event) => updateAuthor(index, "trustScore", Number(event.target.value))}
                        />
                      </Field>
                      <div>
                        <Label>Avatar</Label>
                        <div className="mt-1 space-y-3">
                          {item.author.avatar ? (
                            <Image
                              alt={`${item.author.name} avatar preview`}
                              className="size-20 rounded-sm border border-[#eadfca] bg-white object-cover"
                              height={80}
                              src={item.author.avatar}
                              width={80}
                            />
                          ) : (
                            <div className="grid size-20 place-items-center rounded-sm border border-dashed border-[#d9c9aa] bg-white text-xs text-stone-500">
                              No image selected
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Input readOnly value={item.author.avatar} />
                            <Button
                              className={`${button} bg-amber-100 text-amber-950 hover:bg-amber-200`}
                              onClick={() => setMediaIndex(index)}
                              size="sm"
                            >
                              {iconMap.ImageIcon} Media
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Field label="Reason">
                        <Input
                          value={item.flagReason}
                          onChange={(event) => updateItem(index, "flagReason", event.target.value)}
                        />
                      </Field>
                      <Field label="Severity">
                        <Select value={item.severity} onValueChange={(value) => updateItem(index, "severity", value)}>
                          <SelectTrigger className="border-[#eadfca] bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-[#eadfca] bg-white">
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Timestamp">
                        <Input
                          value={item.timestamp}
                          onChange={(event) => updateItem(index, "timestamp", event.target.value)}
                        />
                      </Field>
                      <div>
                        <Field label="Content">
                          <Textarea
                            className="min-h-36"
                            rows={6}
                            value={item.content}
                            onChange={(event) => updateItem(index, "content", event.target.value)}
                          />
                        </Field>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </Panel>
          </TabsContent>
        </Tabs>
      </div>
      {mediaIndex !== null && (
        <ImagePickerModal
          close={() => setMediaIndex(null)}
          onSelect={(url) => {
            updateAuthor(mediaIndex, "avatar", url);
            setMediaIndex(null);
            setToast({ message: "Media selected." });
          }}
        />
      )}
      {deleteIndex !== null && (
        <AlertDialog
          description="This removes the selected moderation item from this section."
          onCancel={() => setDeleteIndex(null)}
          onConfirm={() => {
            setFormData((current) => ({
              ...current,
              moderationQueue: current.moderationQueue.filter((_, index) => index !== deleteIndex),
            }));
            setDeleteIndex(null);
            setToast({ message: "Moderation item deleted." });
          }}
          open
          title="Delete moderation item"
        />
      )}
      {toast && <Toast error={toast.error} message={toast.message} onDismiss={() => setToast(null)} />}
    </div>
  );
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-sm border border-[#eadfca] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-stone-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
