/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/app/api/lib/utils";
import { iconMap, iconOptions } from "@/components/all-icons/all-icons-jsx";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IconPicker } from "@/components/ui/icon-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

import { defaultDataSection25, defaultLayout, IFeatureCard, Section25Data, Section25Payload } from "./data";

const LayoutTemplate = iconMap.Layout;
const Plus = iconMap.Plus;
const Trash2 = iconMap.Trash2;
const Search = iconMap.Search;
const X = iconMap.X;

export interface Section25FormProps {
  data?: Section25Data | Section25Payload;
  onChange?: (values: Section25Data | Section25Payload) => void;
  onSubmit?: (values: Section25Data | Section25Payload) => void;
}

const gradientOptions = [
  { label: "Blue", value: "from-blue-500 to-blue-600" },
  { label: "Green", value: "from-green-500 to-green-600" },
  { label: "Purple", value: "from-purple-500 to-purple-600" },
  { label: "Red", value: "from-red-500 to-red-600" },
  { label: "Orange", value: "from-orange-500 to-orange-600" },
  { label: "Indigo", value: "from-indigo-500 to-indigo-600" },
  { label: "Pink", value: "from-pink-500 to-pink-600" },
];

const MutationSection25 = ({ data, onChange }: Section25FormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload: Section25Payload =
    data && "paddingX" in data ? data : { ...defaultDataSection25, ...defaultLayout, ...(data || {}) };
  const [formData, setFormData] = useState<Section25Data>(() => ({
    ...initialPayload,
    cards: initialPayload.cards ?? defaultDataSection25.cards,
  }));
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [iconPickerCardIndex, setIconPickerCardIndex] = useState<number | null>(null);
  const [iconSearch, setIconSearch] = useState("");

  const normalizedIconOptions = useMemo(() => [...iconOptions].sort((a, b) => a.localeCompare(b)), []);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.({ ...formData, paddingX, paddingY });
  }, [formData, paddingX, paddingY]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIconPickerCardIndex(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof Section25Data, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCard = () => {
    const newCard: IFeatureCard = {
      title: "New Feature",
      description: "Feature description goes here.",
      iconName: "Star",
      gradient: "from-indigo-500 to-indigo-600",
    };
    updateField("cards", [...formData.cards, newCard]);
  };

  const handleRemoveCard = (index: number) => {
    const newCards = formData.cards.filter((_, i) => i !== index);
    updateField("cards", newCards);
  };

  const updateCard = (index: number, field: keyof IFeatureCard, value: string) => {
    const newCards = [...formData.cards];
    newCards[index] = { ...newCards[index], [field]: value };
    updateField("cards", newCards);
  };

  const openIconPicker = (index: number) => {
    setIconSearch("");
    setIconPickerCardIndex(index);
  };

  const selectedCard = iconPickerCardIndex === null ? null : formData.cards[iconPickerCardIndex];
  const selectedIconName = selectedCard?.iconName ?? "Zap";
  const SelectedIcon = iconMap[selectedIconName] ?? iconMap.Zap;
  const filteredIconOptions = normalizedIconOptions.filter((iconName) =>
    iconName.toLowerCase().includes(iconSearch.trim().toLowerCase()),
  );

  return (
    <div className="custom-parent-border min-h-screen w-full max-w-7xl mx-auto border-x border-[#e8d8bd] bg-[#fffaf0] text-[#49352b] font-sans">
      <div className="w-full overflow-hidden rounded-sm border border-[#e8d8bd] bg-[#fffdf8] shadow-[0_14px_35px_rgba(105,66,38,0.08)]">
        <div className="flex items-center gap-3 border-b border-[#eadcc7] bg-gradient-to-r from-[#fff2d9] via-[#fffaf0] to-[#f4efff] p-6">
          <div className="rounded-sm bg-gradient-to-br from-[#f6c86e] to-[#d9874a] p-2 shadow-sm">
            <LayoutTemplate className="text-[#593319]" size={24} />
          </div>
          <div>
            <h2 className="bg-gradient-to-r from-[#87451f] via-[#b34e45] to-[#66419a] bg-clip-text text-xl font-bold text-transparent">
              Edit Section 25
            </h2>
            <p className="text-sm text-[#765f50]">Manage the feature cards and their styles.</p>
          </div>
        </div>

        <div className="space-y-6 p-6 md:p-8">
          <div className="grid gap-4 rounded-sm border border-[#eadcc7] bg-[#fff5e4] p-4">
            <div className="border-l-2 border-[#d78b3d] pl-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#8b481d]">Layout spacing</p>
              <p className="mt-1 text-xs leading-5 text-[#765f50]">
                Adjust the horizontal and vertical breathing room around the cards.
              </p>
            </div>
            <div className="grid gap-4">
              {(["paddingX", "paddingY"] as const).map((field) => {
                const value = field === "paddingX" ? paddingX : paddingY;
                const label = field === "paddingX" ? "Padding X" : "Padding Y";
                return (
                  <div className="rounded-sm border border-[#eadcc7] bg-[#fffdf8] p-3" key={field}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <Label className="text-sm font-medium text-[#594135]">{label}</Label>
                      <span className="rounded-full bg-[#f2e8ff] px-2.5 py-1 text-xs font-bold tabular-nums text-[#70458f]">
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
                      className="mt-3 h-10 border-[#e8d8bd] bg-[#fffdf8] text-[#49352b] focus:border-[#9a5b9c]"
                      max={300}
                      min={-300}
                      onChange={(event) => updateSpacing(field, Number(event.target.value) || 0)}
                      step={1}
                      type="number"
                      value={value}
                    />
                    <div className="mt-2 flex justify-between text-[10px] font-medium text-[#a68e7d]">
                      <span>-300px</span>
                      <span>0</span>
                      <span>+300px</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold text-[#594135]">Feature Cards</Label>
            <Button
              onClick={handleAddCard}
              size="sm"
              variant="outline"
              className="border-[#d9c5ef] bg-[#fffdf8] text-[#70458f] hover:bg-[#f3ebff]"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Card
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {formData.cards.map((card, idx) => (
              <div
                key={idx}
                className="group relative space-y-4 rounded-sm border border-[#eadcc7] bg-[#fff9ef] p-5 transition-colors hover:border-[#c69cda]"
              >
                <button
                  onClick={() => handleRemoveCard(idx)}
                  className="absolute right-2 top-2 z-10 rounded-sm bg-[#fff0eb] p-1.5 text-[#bd4f3e] opacity-0 transition-all hover:bg-[#bd4f3e] hover:text-white group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>

                <div className="space-y-2">
                  <Label className="text-xs text-[#765f50]">Title</Label>
                  <Input
                    value={card.title}
                    onChange={(e) => updateCard(idx, "title", e.target.value)}
                    className="border-[#e8d8bd] bg-[#fffdf8] text-[#49352b] focus:border-[#9a5b9c]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-[#765f50]">Description</Label>
                  <Textarea
                    value={card.description}
                    onChange={(e) => updateCard(idx, "description", e.target.value)}
                    className="min-h-36 resize-y border-[#e8d8bd] bg-[#fffdf8] text-sm text-[#49352b] focus:border-[#9a5b9c]"
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs text-[#765f50]">Icon</Label>
                    <button
                      type="button"
                      onClick={() => openIconPicker(idx)}
                      className="group flex w-full items-center gap-3 rounded-sm border border-[#e8d8bd] bg-[#fffdf8] p-3 text-left transition-all hover:border-[#c69cda] hover:bg-[#f7f0ff] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9a5b9c] focus-visible:ring-offset-2"
                    >
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-gradient-to-br ${card.gradient} text-white shadow-sm`}
                      >
                        {(() => {
                          const CardIcon = iconMap[card.iconName] ?? iconMap.Zap;
                          return <CardIcon size={19} strokeWidth={2} />;
                        })()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-[#594135]">Choose icon</span>
                        <span className="block truncate font-mono text-xs text-[#765f50]">{card.iconName}</span>
                      </span>
                      <span className="text-xs font-semibold text-[#874f93] transition-transform group-hover:translate-x-0.5">
                        Change
                      </span>
                    </button>
                    <IconPicker
                      label="Card icon"
                      onChange={(icon) => updateCard(idx, "iconName", icon)}
                      value={card.iconName}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-[#765f50]">Color Theme</Label>
                    <select
                      value={card.gradient}
                      onChange={(e) => updateCard(idx, "gradient", e.target.value)}
                      className="h-9 w-full rounded-sm border border-[#e8d8bd] bg-[#fffdf8] px-2 text-sm text-[#49352b] focus:border-[#9a5b9c] focus:outline-none"
                    >
                      {gradientOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={`h-1.5 w-full rounded-full bg-gradient-to-r ${card.gradient}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={iconPickerCardIndex !== null} onOpenChange={(open) => !open && setIconPickerCardIndex(null)}>
        <DialogContent className="w-full max-w-3xl overflow-hidden rounded-sm border border-[#e3d0b4] bg-[#fffdf8] p-0 shadow-2xl">
          {selectedCard && (
            <>
              <DialogHeader className="relative overflow-hidden border-b border-[#e3d0b4] bg-gradient-to-br from-[#5b2d83] via-[#9b3d69] to-[#c76332] px-6 py-5 text-white">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                <div className="relative flex items-center gap-4 pr-10">
                  <span
                    className={`grid h-14 w-14 place-items-center rounded-sm bg-gradient-to-br ${selectedCard.gradient} shadow-lg ring-4 ring-white/20`}
                  >
                    <SelectedIcon size={25} strokeWidth={2} />
                  </span>
                  <div>
                    <DialogTitle className="text-xl font-bold tracking-tight">Choose an icon</DialogTitle>
                    <DialogDescription className="mt-1 text-sm text-[#f7dfcc]">
                      Pick an icon that best represents “{selectedCard.title}”.
                    </DialogDescription>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIconPickerCardIndex(null)}
                  className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-sm text-white/80 transition hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Close icon picker"
                >
                  <X size={19} />
                </button>
              </DialogHeader>

              <div className="space-y-4 p-5 sm:p-6">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a5b9c]" />
                  <Input
                    autoFocus
                    value={iconSearch}
                    onChange={(event) => setIconSearch(event.target.value)}
                    placeholder="Search hundreds of icons..."
                    className="h-11 border-[#e3d0b4] bg-[#fff7e9] pl-10 text-[#49352b] placeholder:text-[#a68e7d] focus:border-[#9a5b9c] focus:bg-[#fffdf8]"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="font-medium text-[#765f50]">{filteredIconOptions.length} icons available</span>
                  <span className="truncate rounded-full bg-[#f2e8ff] px-2.5 py-1 font-mono text-[#70458f]">
                    Selected: {selectedIconName}
                  </span>
                </div>
                <div className="max-h-[48vh] overflow-y-auto rounded-sm border border-[#e8d8bd] bg-[#fff8ed] p-3">
                  {filteredIconOptions.length ? (
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                      {filteredIconOptions.map((iconName) => {
                        const IconComponent = iconMap[iconName];
                        const isSelected = selectedIconName === iconName;
                        return (
                          <button
                            type="button"
                            key={iconName}
                            onClick={() => {
                              if (iconPickerCardIndex !== null) updateCard(iconPickerCardIndex, "iconName", iconName);
                              setIconPickerCardIndex(null);
                            }}
                            title={iconName}
                            aria-label={`Choose ${iconName} icon`}
                            aria-pressed={isSelected}
                            className={cn(
                              "flex aspect-square items-center justify-center rounded-sm border transition-all duration-200",
                              isSelected
                                ? "border-[#8b4e9c] bg-gradient-to-br from-[#7b3f94] to-[#b44e58] text-white shadow-md"
                                : "border-[#eadcc7] bg-[#fffdf8] text-[#765f50] hover:-translate-y-0.5 hover:border-[#c69cda] hover:bg-[#f6edff] hover:text-[#70458f] hover:shadow-sm",
                            )}
                          >
                            <IconComponent size={20} strokeWidth={1.8} />
                            <span className="sr-only">{iconName}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="grid min-h-48 place-items-center text-center">
                      <div>
                        <Search className="mx-auto h-7 w-7 text-[#c9b29b]" />
                        <p className="mt-3 text-sm font-semibold text-[#765f50]">No matching icons</p>
                        <p className="mt-1 text-xs text-[#a68e7d]">Try a different keyword.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MutationSection25;
