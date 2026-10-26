/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { motion } from "framer-motion";
import {
  AlignLeft as AlignLeftIcon,
  Badge as BadgeIconComponent,
  List as ListIcon,
  Type as TypeIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";
import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { ArticleBlock, defaultDataSection14, Section14Data } from "./data";

// eslint-disable-next-line react/display-name
const iconComponent = (icon: keyof typeof iconMap) => (_props: { className?: string; size?: number }) => {
  const Icon = iconMap[icon];
  return <Icon {..._props} />;
};
const Tag = iconComponent("Tag");
const Plus = iconComponent("Plus");
const User = iconComponent("User");
const Type = TypeIcon;
const Quote = iconComponent("Quote");
const Clock = iconComponent("Clock");
const Trash2 = iconComponent("Trash2");
const FileText = iconComponent("FileText");
const Calendar = iconComponent("Calendar");
const AlignLeft = AlignLeftIcon;
const ImageIcon = iconComponent("Image");
const Settings2 = iconComponent("Settings");
const LayoutList = ListIcon;
const GripVertical = iconComponent("GripVertical");
const ChevronRight = iconComponent("ChevronRight");
const LayoutTemplate = iconComponent("Layout");
const BadgeIcon = BadgeIconComponent;

type MediaTarget = { type: "hero" } | { type: "avatar" } | { type: "block"; blockIndex: number };

export interface Section14FormProps {
  data?: Section14Data;
  onChange?: (values: Section14Data) => void;
}

const MutationSection14 = ({ data, onChange }: Section14FormProps) => {
  const onChangeRef = useRef(onChange);
  const [formData, setFormData] = useState<Section14Data>(() => ({ ...defaultDataSection14, ...data }));
  const [activeArticleId, setActiveArticleId] = useState<string>(
    data?.allData?.[0]?.id || defaultDataSection14.allData[0]?.id || "",
  );
  const [mediaTarget, setMediaTarget] = useState<MediaTarget | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.(formData);
  }, [formData]);

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    setFormData((current) => ({ ...current, [field]: Math.min(300, Math.max(-300, value)) }));
  };

  const activeArticle = formData.allData.find((a) => a.id === activeArticleId) || formData.allData[0];
  const activeIndex = formData.allData.findIndex((a) => a.id === activeArticleId);

  const handleSectionChange = (field: keyof Section14Data, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddArticle = () => {
    const newArticle = {
      id: `art-${Date.now()}`,
      title: "New Untitled Article",
      subtitle: "Add a short subtitle here...",
      category: "Uncategorized",
      readTime: "5 min read",
      publishedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      author: {
        name: "Author Name",
        role: "Writer",
        avatar: "",
      },
      heroImage: "",
      tags: ["New"],
      content: [
        { type: "heading", content: "Introduction" } as ArticleBlock,
        { type: "text", content: "Start writing your article content here..." } as ArticleBlock,
      ],
    };

    setFormData((prev) => ({
      ...prev,
      allData: [...prev.allData, newArticle],
    }));
    setActiveArticleId(newArticle.id);
  };

  const handleDeleteArticle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (formData.allData.length === 1) return; // Prevent deleting last article

    const newArticles = formData.allData.filter((a) => a.id !== id);
    setFormData((prev) => ({ ...prev, allData: newArticles }));

    if (activeArticleId === id) {
      setActiveArticleId(newArticles[0].id);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateArticle = (field: string, value: any) => {
    const updatedArticles = [...formData.allData];
    updatedArticles[activeIndex] = { ...updatedArticles[activeIndex], [field]: value };
    setFormData((prev) => ({ ...prev, allData: updatedArticles }));
  };

  const updateAuthor = (field: string, value: string) => {
    const updatedArticles = [...formData.allData];
    updatedArticles[activeIndex] = {
      ...updatedArticles[activeIndex],
      author: { ...updatedArticles[activeIndex].author, [field]: value },
    };
    setFormData((prev) => ({ ...prev, allData: updatedArticles }));
  };

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    updateArticle("tags", tags);
  };

  const addBlock = (type: ArticleBlock["type"]) => {
    const newBlock: ArticleBlock =
      type === "heading"
        ? { type: "heading", content: "New Heading" }
        : type === "quote"
          ? { type: "quote", content: "Quote text...", author: "Source" }
          : type === "image"
            ? { type: "image", src: "", alt: "Image description", caption: "" }
            : { type: "text", content: "New paragraph block..." };

    const updatedContent = [...activeArticle.content, newBlock];
    updateArticle("content", updatedContent);
  };

  const removeBlock = (blockIndex: number) => {
    const updatedContent = activeArticle.content.filter((_, i) => i !== blockIndex);
    updateArticle("content", updatedContent);
  };

  const updateBlock = (blockIndex: number, field: string, value: string) => {
    const updatedContent = [...activeArticle.content];

    const currentBlock = updatedContent[blockIndex] as unknown as Record<string, string>;
    updatedContent[blockIndex] = { ...currentBlock, [field]: value } as ArticleBlock;

    updateArticle("content", updatedContent);
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === activeArticle.content.length - 1))
      return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const content = [...activeArticle.content];
    [content[index], content[newIndex]] = [content[newIndex], content[index]];
    updateArticle("content", content);
  };

  if (!activeArticle) return null;

  return (
    <div className="custom-parent-border min-h-screen w-full max-w-7xl mx-auto bg-white text-stone-800 font-sans pb-32 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute left-[-10%] top-[-10%] h-[40vw] w-[40vw] rounded-full bg-indigo-100/60 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40vw] w-[40vw] rounded-full bg-purple-100/60 blur-[120px]" />
      </div>

      <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6 relative z-10">
        <div className="flex flex-col items-center md:items-start mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <FileText size={12} />
            <span>Content Manager</span>
          </motion.div>
          <h1 className="bg-gradient-to-r from-indigo-700 to-violet-700 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Editorial Dashboard
          </h1>
          <p className="mt-2 text-lg text-slate-600">Manage section headers, articles, and rich media content.</p>
        </div>

        <div className="mb-8 grid gap-4 rounded-sm border border-[#eadfca] bg-slate-50 p-4">
          <div className="border-l-2 border-amber-300 pl-4">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-700">Layout spacing</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Adjust the horizontal and vertical breathing room for the public editorial section.
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
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold tabular-nums text-indigo-700">
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

        <div className="grid grid-cols-1 items-start gap-6">
          <div className="h-fit space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4 rounded-sm border border-slate-200 bg-slate-50 p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-widest text-indigo-600">
                <LayoutTemplate size={14} /> Section Header
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-4 rounded-sm border border-slate-200 bg-white p-3">
                    <Label className="flex items-center gap-1 text-xs text-slate-700">
                      <BadgeIcon size={10} /> Eyebrow
                    </Label>
                    <Switch
                      aria-label="Show eyebrow"
                      checked={formData.showEyebrow !== false}
                      onCheckedChange={(checked) => setFormData((current) => ({ ...current, showEyebrow: checked }))}
                    />
                  </div>
                  <Label className="flex items-center gap-1 text-xs text-slate-600">Eyebrow Text</Label>
                  <Input
                    value={formData.badge}
                    onChange={(e) => handleSectionChange("badge", e.target.value)}
                    className="h-9 border-slate-200 bg-white text-sm text-slate-900 focus:border-indigo-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Main Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleSectionChange("title", e.target.value)}
                    className="h-9 border-slate-200 bg-white text-sm font-bold text-slate-900 focus:border-indigo-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Subtitle</Label>
                  <Textarea
                    value={formData.subTitle}
                    onChange={(e) => handleSectionChange("subTitle", e.target.value)}
                    className="min-h-36 resize-y border-slate-200 bg-white text-sm text-slate-900 focus:border-indigo-500/50"
                    rows={6}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex min-h-[400px] flex-col gap-3 rounded-sm border border-slate-200 bg-slate-50 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-2 pb-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                  <LayoutList size={14} /> Stories
                </span>
                <Button
                  onClick={handleAddArticle}
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 rounded-full text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <Plus size={14} />
                </Button>
              </div>

              <ScrollArea className="flex-1 pr-3 -mr-3 max-h-[calc(100vh-500px)]">
                <div className="flex flex-col gap-2">
                  {formData.allData.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => setActiveArticleId(article.id)}
                      className={`
                         group relative cursor-pointer rounded-sm border p-3 transition-all duration-200
                         ${
                           activeArticleId === article.id
                             ? "bg-indigo-500/10 border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                             : "bg-white border-slate-200 hover:bg-indigo-50/50 hover:border-indigo-200"
                         }
                       `}
                    >
                      <div className="flex gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-slate-200 bg-white">
                          {article.heroImage ? (
                            <Image src={article.heroImage} alt="" fill className="object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-slate-500">
                              <ImageIcon size={16} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`truncate text-sm font-medium ${activeArticleId === article.id ? "text-indigo-900" : "text-slate-700 group-hover:text-indigo-800"}`}
                          >
                            {article.title || "Untitled"}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className="h-4 max-w-[80px] truncate border-slate-200 px-1 py-0 text-[10px] text-slate-500"
                            >
                              {article.category}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={(e) => handleDeleteArticle(article.id, e)}
                        className={`
                            absolute top-2 right-2 h-6 w-6 p-0 rounded-full bg-white text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200
                            opacity-0 group-hover:opacity-100 transition-opacity
                            ${formData.allData.length === 1 ? "hidden" : ""}
                          `}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6 rounded-sm border border-slate-200 bg-slate-50 p-6 shadow-sm"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">Article Title</Label>
                    <Input
                      value={activeArticle.title}
                      onChange={(e) => updateArticle("title", e.target.value)}
                      className="border-slate-200 bg-white text-lg font-bold text-slate-900 focus:border-indigo-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Article Subtitle
                    </Label>
                    <Textarea
                      value={activeArticle.subtitle}
                      onChange={(e) => updateArticle("subtitle", e.target.value)}
                      className="min-h-36 resize-y border-slate-200 bg-white text-sm text-slate-700 focus:border-indigo-500/50"
                      rows={6}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="flex gap-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                      <Tag size={12} /> Category
                    </Label>
                    <Input
                      value={activeArticle.category}
                      onChange={(e) => updateArticle("category", e.target.value)}
                      className="h-9 border-slate-200 bg-white text-xs text-slate-900 focus:border-indigo-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex gap-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                      <Clock size={12} /> Read Time
                    </Label>
                    <Input
                      value={activeArticle.readTime}
                      onChange={(e) => updateArticle("readTime", e.target.value)}
                      className="h-9 border-slate-200 bg-white text-xs text-slate-900 focus:border-indigo-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex gap-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                    <Calendar size={12} /> Publish Date
                  </Label>
                  <Input
                    value={activeArticle.publishedAt}
                    onChange={(e) => updateArticle("publishedAt", e.target.value)}
                    className="h-9 border-slate-200 bg-white text-slate-900 focus:border-indigo-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Tags (comma separated)
                  </Label>
                  <Input
                    value={activeArticle.tags.join(", ")}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    className="border-slate-200 bg-white text-slate-900 focus:border-indigo-500/50"
                    placeholder="Tech, Design, Future"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6 rounded-sm border border-slate-200 bg-slate-50 p-6 shadow-sm"
              >
                <div className="space-y-3">
                  <Label className="flex gap-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                    <ImageIcon size={12} /> Hero Image
                  </Label>
                  <div className="flex flex-col gap-3 rounded-sm border border-slate-200 bg-white p-3">
                    <div className="relative aspect-video overflow-hidden rounded-sm bg-slate-50">
                      {activeArticle.heroImage ? (
                        <Image
                          alt={activeArticle.title || "Article hero preview"}
                          className="object-cover"
                          fill
                          src={activeArticle.heroImage}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-500">
                          <ImageIcon size={28} />
                        </div>
                      )}
                    </div>
                    <Button
                      className="border-indigo-200 bg-indigo-50 text-indigo-900 hover:bg-indigo-100"
                      onClick={() => setMediaTarget({ type: "hero" })}
                      type="button"
                      variant="outline"
                    >
                      <ImageIcon className="mr-2" size={16} /> Choose or upload hero image
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex gap-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                      <User size={12} /> Author
                    </Label>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white">
                      {activeArticle.author.avatar ? (
                        <Image src={activeArticle.author.avatar} fill alt="Author" className="object-cover" />
                      ) : (
                        <User className="m-6 h-8 w-8 text-slate-500" />
                      )}
                    </div>
                    <Button
                      className="w-fit border-indigo-200 bg-indigo-50 text-indigo-900 hover:bg-indigo-100"
                      onClick={() => setMediaTarget({ type: "avatar" })}
                      type="button"
                      variant="outline"
                    >
                      <ImageIcon className="mr-2" size={16} /> Choose or upload author image
                    </Button>
                    <div className="flex-1 space-y-2">
                      <Input
                        placeholder="Name"
                        value={activeArticle.author.name}
                        onChange={(e) => updateAuthor("name", e.target.value)}
                        className="h-9 border-slate-200 bg-white text-xs text-slate-900"
                      />
                      <Input
                        placeholder="Role"
                        value={activeArticle.author.role}
                        onChange={(e) => updateAuthor("role", e.target.value)}
                        className="h-9 border-slate-200 bg-white text-xs text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex min-h-[600px] flex-col overflow-hidden rounded-sm border border-slate-200 bg-slate-50 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-2">
                    <Settings2 size={16} className="text-indigo-400" />
                    <span className="text-sm font-bold text-slate-800">Content Builder</span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        className="h-8 gap-2 border border-indigo-200 bg-indigo-50 text-xs text-indigo-900 hover:bg-indigo-100"
                      >
                        <Plus size={14} /> Add Block
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border-slate-200 bg-white text-slate-800">
                      <DropdownMenuItem
                        onClick={() => addBlock("heading")}
                        className="cursor-pointer gap-2 hover:bg-indigo-50"
                      >
                        <Type size={14} /> Heading
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => addBlock("text")}
                        className="cursor-pointer gap-2 hover:bg-indigo-50"
                      >
                        <AlignLeft size={14} /> Paragraph
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => addBlock("quote")}
                        className="cursor-pointer gap-2 hover:bg-indigo-50"
                      >
                        <Quote size={14} /> Quote
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => addBlock("image")}
                        className="cursor-pointer gap-2 hover:bg-indigo-50"
                      >
                        <ImageIcon size={14} /> Image
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex-1 space-y-4 bg-slate-50 p-6">
                  {activeArticle.content.map((block, index) => (
                    <motion.div
                      layout
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative rounded-sm border border-transparent px-2 py-2 pl-8 transition-colors hover:border-slate-200 hover:bg-white"
                    >
                      <div className="absolute left-1 top-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => moveBlock(index, "up")} className="text-zinc-600 hover:text-indigo-400">
                          <ChevronRight size={14} className="-rotate-90" />
                        </button>
                        <GripVertical size={14} className="text-zinc-600 cursor-grab active:cursor-grabbing" />
                        <button
                          onClick={() => moveBlock(index, "down")}
                          className="text-zinc-600 hover:text-indigo-400"
                        >
                          <ChevronRight size={14} className="rotate-90" />
                        </button>
                      </div>

                      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-zinc-600 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => removeBlock(index)}
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>

                      {block.type === "heading" && (
                        <div className="flex gap-3 items-center">
                          <Type className="text-indigo-500 shrink-0 mt-2" size={20} />
                          <Input
                            value={block.content}
                            onChange={(e) => updateBlock(index, "content", e.target.value)}
                            className="h-auto border-slate-200 bg-white px-2 py-1 text-xl font-bold text-slate-900 focus:border-indigo-500/50"
                            placeholder="Heading Text"
                          />
                        </div>
                      )}

                      {block.type === "text" && (
                        <div className="flex gap-3 items-start">
                          <AlignLeft className="text-zinc-600 shrink-0 mt-2" size={16} />
                          <Textarea
                            value={block.content}
                            onChange={(e) => updateBlock(index, "content", e.target.value)}
                            className="min-h-36 resize-y border-slate-200 bg-white px-2 leading-relaxed text-slate-700 focus:border-indigo-500/50"
                            placeholder="Write your paragraph here..."
                            rows={6}
                          />
                        </div>
                      )}

                      {block.type === "quote" && (
                        <div className="flex gap-3 items-start pl-2">
                          <div className="w-1 self-stretch bg-indigo-500/30 rounded-full mr-1" />
                          <div className="flex-1 space-y-2">
                            <Textarea
                              value={block.content}
                              onChange={(e) => updateBlock(index, "content", e.target.value)}
                              className="min-h-36 resize-y rounded-sm border border-slate-200 bg-white p-4 text-lg italic text-indigo-700 focus:border-indigo-500/50"
                              placeholder="Quote text..."
                              rows={6}
                            />
                            <div className="flex items-center gap-2 max-w-[50%] ml-auto">
                              <div className="h-px flex-1 bg-slate-200" />
                              <Input
                                value={"author" in block ? block.author : ""}
                                onChange={(e) => updateBlock(index, "author", e.target.value)}
                                className="h-6 w-32 rounded-none border-transparent bg-transparent p-0 text-right text-xs text-slate-500 focus:border-b focus:border-indigo-500 focus:text-slate-800"
                                placeholder="- Author"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {block.type === "image" && (
                        <div className="space-y-3 pl-8">
                          <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 overflow-hidden rounded-sm border border-slate-200 bg-white p-3">
                            {"src" in block && block.src ? (
                              <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-slate-50">
                                <Image
                                  alt={block.alt || "Article content preview"}
                                  className="object-cover"
                                  fill
                                  src={block.src}
                                />
                              </div>
                            ) : (
                              <div className="flex aspect-video w-full items-center justify-center bg-slate-50 text-slate-500">
                                <ImageIcon size={28} />
                              </div>
                            )}
                            <Button
                              className="border-indigo-200 bg-indigo-50 text-indigo-900 hover:bg-indigo-100"
                              onClick={() => setMediaTarget({ type: "block", blockIndex: index })}
                              type="button"
                              variant="outline"
                            >
                              <ImageIcon className="mr-2" size={16} /> Choose or upload block image
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                            <Input
                              value={"alt" in block ? block.alt : ""}
                              onChange={(e) => updateBlock(index, "alt", e.target.value)}
                              className="h-8 rounded-none border-x-0 border-t-0 border-b-slate-200 bg-transparent p-0 text-xs text-slate-600 focus:border-indigo-500"
                              placeholder="Alt Text (SEO)"
                            />
                            <Input
                              value={"caption" in block ? block.caption || "" : ""}
                              onChange={(e) => updateBlock(index, "caption", e.target.value)}
                              className="h-8 rounded-none border-x-0 border-t-0 border-b-slate-200 bg-transparent p-0 text-xs text-slate-600 focus:border-indigo-500"
                              placeholder="Image Caption (Optional)"
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {activeArticle.content.length === 0 && (
                    <div className="m-4 flex h-40 flex-col items-center justify-center rounded-sm border-2 border-dashed border-slate-200 text-slate-500">
                      <FileText size={32} className="mb-2 opacity-50" />
                      <p className="text-sm">Start building your story</p>
                      <Button variant="link" onClick={() => addBlock("text")} className="text-indigo-400">
                        Add Paragraph
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {mediaTarget && (
        <ImagePickerModal
          close={() => setMediaTarget(null)}
          description="Select an existing article image or upload a new one."
          onSelect={(url) => {
            if (mediaTarget.type === "hero") updateArticle("heroImage", url);
            if (mediaTarget.type === "avatar") updateAuthor("avatar", url);
            if (mediaTarget.type === "block") updateBlock(mediaTarget.blockIndex, "src", url);
            setMediaTarget(null);
          }}
          title="Choose article image"
          uploadLabel="Upload article image"
        />
      )}
    </div>
  );
};

export default MutationSection14;
