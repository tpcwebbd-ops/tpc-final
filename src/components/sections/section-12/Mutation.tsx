/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Briefcase as BriefcaseIcon, Handshake as HandshakeIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";
import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { defaultDataSection12, ICollabOption, IPartner, Section12Data } from "./data";
import { defaultCollabOption, defaultPartner } from "./data";

// eslint-disable-next-line react/display-name
const iconComponent = (icon: keyof typeof iconMap) => (_props: { className?: string; size?: number }) => {
  const Icon = iconMap[icon];
  return <Icon {..._props} />;
};
const Plus = iconComponent("Plus");
const Trash2 = iconComponent("Trash2");
const Users = iconComponent("Users");
const Handshake = HandshakeIcon;
const Briefcase = BriefcaseIcon;
const LayoutTemplate = iconComponent("Layout");
const ImageIcon = iconComponent("Image");
const X = iconComponent("X");
const Tag = iconComponent("Tag");

export interface Section12FormProps {
  data?: Section12Data;
  onChange?: (values: Section12Data) => void;
}

const MutationSection12 = ({ data, onChange }: Section12FormProps) => {
  const onChangeRef = useRef(onChange);
  const [formData, setFormData] = useState<Section12Data>(() => ({ ...defaultDataSection12, ...data }));
  const [mediaPartnerIndex, setMediaPartnerIndex] = useState<number | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.(formData);
  }, [formData]);

  const handleChange = (field: keyof Section12Data, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addPartner = () => {
    const newPartner: IPartner = { id: `partner-${Date.now()}`, ...defaultPartner };
    setFormData((prev) => ({ ...prev, partners: [...prev.partners, newPartner] }));
  };

  const removePartner = (index: number) => {
    const updated = formData.partners.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, partners: updated }));
  };

  const updatePartner = (index: number, field: keyof IPartner, value: string) => {
    const updated = [...formData.partners];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, partners: updated }));
  };

  const addOption = () => {
    const newOption: ICollabOption = { id: `opt-${Date.now()}`, ...defaultCollabOption };
    setFormData((prev) => ({ ...prev, collabOptions: [...prev.collabOptions, newOption] }));
  };

  const removeOption = (index: number) => {
    const updated = formData.collabOptions.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, collabOptions: updated }));
  };

  const updateOption = (index: number, field: keyof ICollabOption, value: string) => {
    const updated = [...formData.collabOptions];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, collabOptions: updated }));
  };
  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    setFormData((current) => ({ ...current, [field]: Math.min(300, Math.max(-300, value)) }));
  };

  return (
    <div className="custom-parent-border min-h-screen bg-white text-stone-800 font-sans pb-32 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute right-[-5%] top-[-10%] h-[40vw] w-[40vw] rounded-full bg-cyan-100/60 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[40vw] w-[40vw] rounded-full bg-blue-100/60 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-4"
            >
              <Handshake size={12} />
              <span>Network & Growth</span>
            </motion.div>
            <h1 className="bg-gradient-to-r from-cyan-700 to-blue-700 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              Collaboration
            </h1>
            <p className="text-slate-600 mt-2 text-lg">Manage your strategic partners and engagement models.</p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 rounded-sm border border-[#eadfca] bg-slate-50 p-4">
          <div className="border-l-2 border-amber-300 pl-4">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-700">Layout spacing</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Adjust the horizontal and vertical breathing room for the public collaboration section.
            </p>
          </div>
          <div className="grid gap-4">
            {(["paddingX", "paddingY"] as const).map((field) => {
              const value = formData[field];
              const label = field === "paddingX" ? "Padding X" : "Padding Y";
              return (
                <div className="rounded-sm border border-slate-200 bg-white p-3" key={field}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <Label className="text-sm font-medium text-slate-700">{label}</Label>
                    <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-bold tabular-nums text-cyan-700">
                      {value}px
                    </span>
                  </div>
                  <Slider
                    aria-label={label}
                    min={-300}
                    max={300}
                    step={1}
                    value={[value]}
                    onValueChange={([nextValue]) => updateSpacing(field, nextValue ?? 0)}
                  />
                  <Input
                    aria-label={`${label} manual value`}
                    className="mt-3 h-10 border-slate-200 bg-white text-slate-900"
                    max={300}
                    min={-300}
                    onChange={(event) => updateSpacing(field, Number(event.target.value) || 0)}
                    step={1}
                    type="number"
                    value={value}
                  />
                  <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400">
                    <span>-300px</span>
                    <span>0</span>
                    <span>+300px</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-sm border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)] md:p-8"
            >
              <div className="flex items-center gap-2 text-slate-600 uppercase text-xs font-bold tracking-widest mb-6">
                <LayoutTemplate size={14} />
                <span>Section Header</span>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4 rounded-sm border border-slate-200 bg-slate-50 p-3">
                    <div>
                      <Label className="flex items-center gap-2 text-slate-700">
                        <Tag size={14} /> Eyebrow
                      </Label>
                      <p className="mt-1 text-xs text-slate-500">Show or hide the eyebrow on the public section.</p>
                    </div>
                    <Switch
                      aria-label="Show eyebrow"
                      checked={formData.showEyebrow !== false}
                      onCheckedChange={(checked) => setFormData((current) => ({ ...current, showEyebrow: checked }))}
                    />
                  </div>
                  <Label className="text-slate-700">Eyebrow Text</Label>
                  <Input
                    value={formData.badge}
                    onChange={(e) => handleChange("badge", e.target.value)}
                    className="bg-slate-50 border-slate-200 focus:border-cyan-500/50 h-11 text-slate-900"
                    placeholder="e.g. Partnership Network"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Main Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="bg-slate-50 border-slate-200 focus:border-cyan-500/50 h-11 text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Subtitle</Label>
                  <Input
                    value={formData.subTitle}
                    onChange={(e) => handleChange("subTitle", e.target.value)}
                    className="bg-slate-50 border-slate-200 focus:border-cyan-500/50 h-11 text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="min-h-36 resize-y border-slate-200 bg-slate-50 text-slate-900 focus:border-cyan-500/50"
                    rows={6}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex h-fit flex-col rounded-sm border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)] md:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-cyan-400 uppercase text-xs font-bold tracking-widest">
                  <Users size={14} />
                  <span>Trusted Partners</span>
                </div>
                <Button
                  onClick={addPartner}
                  size="sm"
                  className="bg-slate-100 hover:bg-cyan-50 text-slate-700 border border-slate-200"
                >
                  <Plus size={14} className="mr-2" /> Add Logo
                </Button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {formData.partners.map((partner, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={partner.id}
                      className="group relative flex flex-col items-start gap-5 overflow-hidden rounded-sm border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="shrink-0 relative">
                        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
                          {partner.logo ? (
                            <div className="relative w-full h-full p-2">
                              <Image
                                src={partner.logo}
                                alt={partner.name}
                                fill
                                className="object-contain"
                                loading={index === 0 ? "eager" : "lazy"}
                              />
                            </div>
                          ) : (
                            <ImageIcon size={24} className="text-slate-500" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 w-full space-y-3 min-w-0 z-10">
                        <div className="space-y-1">
                          <Label className="ml-1 text-xs font-medium text-slate-600">Company Name</Label>
                          <Input
                            value={partner.name}
                            onChange={(e) => updatePartner(index, "name", e.target.value)}
                            className="h-10 border-slate-200 bg-white text-slate-900 focus:border-cyan-500/50"
                            placeholder="Enter partner name"
                          />
                        </div>

                        <div className="relative">
                          <Label className="mb-1 ml-1 block text-xs font-medium text-slate-600">Partner Logo</Label>
                          <Button
                            className="border-slate-200 bg-white text-slate-700 hover:bg-cyan-50 hover:text-cyan-800"
                            onClick={() => setMediaPartnerIndex(index)}
                            type="button"
                            variant="outline"
                          >
                            <ImageIcon className="" size={16} /> Media
                          </Button>
                        </div>
                      </div>

                      <div className="absolute right-2 top-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removePartner(index)}
                          className="text-zinc-600 hover:text-red-400 hover:bg-red-500/10 h-8 w-8"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {formData.partners.length === 0 && (
                  <div className="rounded-sm border border-dashed border-slate-200 bg-slate-50 py-12 text-center text-slate-600">
                    <p className="text-sm">No partners added yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="min-h-full rounded-sm border border-slate-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.08)] md:p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-cyan-400 uppercase text-xs font-bold tracking-widest">
                  <Briefcase size={14} />
                  <span>Service Models</span>
                </div>
                <Button
                  onClick={addOption}
                  size="sm"
                  className="border border-cyan-200 bg-cyan-50 text-cyan-900 shadow-sm hover:bg-cyan-100"
                >
                  <Plus size={14} className="mr-2" /> Add Model
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <AnimatePresence>
                  {formData.collabOptions.map((opt, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={opt.id}
                      className="group relative rounded-sm border border-slate-200 bg-slate-50 p-6 transition-all hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10"
                    >
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => removeOption(index)}
                        >
                          <X size={16} />
                        </Button>
                      </div>

                      <div className="space-y-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 text-cyan-400">
                          <Handshake size={24} />
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-medium uppercase tracking-wider text-slate-600">Title</Label>
                            <Input
                              value={opt.title}
                              onChange={(e) => updateOption(index, "title", e.target.value)}
                              className="h-10 border-slate-200 bg-white pl-3 text-lg font-bold text-slate-900 focus:border-cyan-500/50"
                              placeholder="Service Name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs font-medium uppercase tracking-wider text-slate-600">
                              Description
                            </Label>
                            <Textarea
                              value={opt.description}
                              onChange={(e) => updateOption(index, "description", e.target.value)}
                              className="min-h-36 resize-y border-slate-200 bg-white text-sm leading-relaxed text-slate-700 focus:border-cyan-500/50"
                              placeholder="Describe this engagement model..."
                              rows={6}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {mediaPartnerIndex !== null && (
        <ImagePickerModal
          close={() => setMediaPartnerIndex(null)}
          description="Select an existing partner logo or upload a new image."
          onSelect={(url) => {
            updatePartner(mediaPartnerIndex, "logo", url);
            setMediaPartnerIndex(null);
          }}
          title="Choose partner logo"
          uploadLabel="Upload logo"
        />
      )}
    </div>
  );
};

export default MutationSection12;
