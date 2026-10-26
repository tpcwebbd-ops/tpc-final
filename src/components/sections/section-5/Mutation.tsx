/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";
import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { BlogPost, defaultDataSection5, Section5Data } from "./data";

// eslint-disable-next-line react/display-name
const iconComponent = (icon: keyof typeof iconMap) => (_props: { className?: string; size?: number }) => {
  const Icon = iconMap[icon];
  return <Icon {..._props} />;
};
const Plus = iconComponent("Plus");
const Trash2 = iconComponent("Trash2");
const Search = iconComponent("Search");
const ImageIcon = iconComponent("Image");
const User = iconComponent("User");
const Calendar = iconComponent("Calendar");
const Clock = iconComponent("Clock");
const Tag = iconComponent("Tag");
const Star = iconComponent("Star");
const LayoutList = iconComponent("FileText");
const Edit2 = iconComponent("Edit2");
// `all-icons-jsx` does not currently expose a `Layers` key; use the registered
// folder icon for the categories panel instead of creating an undefined element.
const Layers = iconComponent("FolderKanban");
const X = iconComponent("X");

export interface Section5FormProps {
  data?: Section5Data;
  onChange?: (values: Section5Data) => void;
}

const MutationSection5 = ({ data, onChange }: Section5FormProps) => {
  const onChangeRef = useRef(onChange);
  const [sectionData, setSectionData] = useState<Section5Data>(() => ({
    ...defaultDataSection5,
    ...data,
    showEyebrow: data?.showEyebrow ?? defaultDataSection5.showEyebrow,
    categories: data?.categories || defaultDataSection5.categories,
    allData: data?.allData || defaultDataSection5.allData,
  }));
  const [activePostId, setActivePostId] = useState<string>(
    () => data?.allData?.[0]?.id || defaultDataSection5.allData[0]?.id || "",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [mediaTarget, setMediaTarget] = useState<"cover" | "avatar" | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.(sectionData);
  }, [sectionData]);

  const activePost = sectionData.allData.find((p) => p.id === activePostId) || sectionData.allData[0];
  const activeIndex = sectionData.allData.findIndex((p) => p.id === activePostId);

  const handleAddPost = () => {
    const defaultCat = sectionData.categories.find((c) => c !== "All") || "General";

    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: "New Untitled Post",
      excerpt: "Write a catchy summary...",
      coverImage: "",
      publishedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readTime: "5 min read",
      category: defaultCat,
      tags: [],
      featured: false,
      author: {
        name: "Author Name",
        role: "Writer",
        avatar: "",
      },
    };

    setSectionData((prev) => ({
      ...prev,
      allData: [newPost, ...prev.allData],
    }));
    setActivePostId(newPost.id);
  };

  const handleDeletePost = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sectionData.allData.length === 1) return;

    const newPosts = sectionData.allData.filter((p) => p.id !== id);
    setSectionData((prev) => ({ ...prev, allData: newPosts }));

    if (activePostId === id) {
      setActivePostId(newPosts[0].id);
    }
  };

  const updatePost = (field: keyof BlogPost, value: unknown) => {
    const updatedPosts = [...sectionData.allData];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updatedPosts[activeIndex] = { ...updatedPosts[activeIndex], [field]: value } as any;
    setSectionData((prev) => ({ ...prev, allData: updatedPosts }));
  };

  const updateAuthor = (field: keyof BlogPost["author"], value: string) => {
    const updatedPosts = [...sectionData.allData];
    updatedPosts[activeIndex] = {
      ...updatedPosts[activeIndex],
      author: { ...updatedPosts[activeIndex].author, [field]: value },
    };
    setSectionData((prev) => ({ ...prev, allData: updatedPosts }));
  };

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    updatePost("tags", tags);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !sectionData.categories.includes(newCategory.trim())) {
      setSectionData((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()],
      }));
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (catToRemove: string) => {
    if (catToRemove === "All") return; // Protect 'All'
    setSectionData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== catToRemove),
    }));
  };

  const filteredPosts = sectionData.allData.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    setSectionData((current) => ({ ...current, [field]: Math.min(300, Math.max(-300, value)) }));
  };
  const handleEditPost = (id: string) => {
    setActivePostId(id);
    requestAnimationFrame(() => editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  if (!activePost) return null;

  return (
    <div className="custom-parent-border relative min-h-screen overflow-hidden bg-[#fffaf0] pb-32 font-sans text-stone-800">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-amber-100/60 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-rose-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl space-y-6 py-6 md:px-6 lg:py-10">
        <div className="rounded-sm border border-[#eadfca] bg-white p-6 shadow-sm md:p-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-amber-800"
          >
            <LayoutList size={12} />
            <span>Blog Manager</span>
          </motion.div>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">Content Curation</h1>
          <p className="text-stone-600 mt-2 text-lg">Manage posts, categories, and authors for your blog section.</p>
          <div className="mt-4 flex w-full items-center justify-between rounded-sm border border-[#eadfca] bg-[#fffdf8] p-3 sm:max-w-sm">
            <div>
              <Label className="text-sm font-semibold text-stone-800">Show eyebrow</Label>
              <p className="mt-1 text-xs text-stone-500">Show or hide the Featured Story label.</p>
            </div>
            <Switch
              checked={sectionData.showEyebrow !== false}
              onCheckedChange={(checked) => setSectionData((current) => ({ ...current, showEyebrow: checked }))}
            />
          </div>
        </div>

        <div className="grid gap-5 rounded-sm border border-[#eadfca] bg-white p-5 shadow-sm md:p-6">
          <div className="border-l-2 border-amber-300 pl-4">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-800">
              <LayoutList size={14} /> Layout spacing
            </div>
            <p className="text-xs leading-5 text-stone-500">
              Adjust the horizontal and vertical breathing room for the public blog section.
            </p>
          </div>
          <div className="grid gap-4">
            {(["paddingX", "paddingY"] as const).map((field) => {
              const value = sectionData[field];
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
                    onChange={(event) => updateSpacing(field, Number(event.target.value) || 0)}
                    type="number"
                    value={value}
                  />
                  <Slider
                    aria-label={label}
                    min={-300}
                    max={300}
                    step={1}
                    value={[value]}
                    onValueChange={([nextValue]) => updateSpacing(field, nextValue ?? 0)}
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
        </div>

        <div className="grid grid-cols-1 gap-6 items-start">
          <div className="space-y-6 h-fit">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4 rounded-sm border border-[#eadfca] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-[#eadfca] pb-3 text-xs font-bold uppercase tracking-widest text-amber-800">
                <Layers size={14} /> Categories
              </div>

              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                  placeholder="Add category..."
                  className="bg-white border-[#eadfca] focus:border-amber-400 h-9 text-xs"
                />
                <Button
                  onClick={handleAddCategory}
                  size="sm"
                  className="h-9 w-9 bg-amber-100 p-0 text-amber-950 hover:bg-amber-200"
                >
                  <Plus size={14} />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {sectionData.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-amber-50 border border-amber-200 text-[10px] text-amber-900 group hover:border-amber-300 transition-colors cursor-default"
                  >
                    {cat}
                    {cat !== "All" && (
                      <button
                        onClick={() => handleRemoveCategory(cat)}
                        className="hover:text-red-400 transition-colors ml-1"
                      >
                        <X size={10} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex min-h-[420px] flex-col gap-4 rounded-sm border border-[#eadfca] bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3 border-b border-[#eadfca] pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-800">
                  <LayoutList size={14} /> Posts
                </div>
                <span className="text-xs text-stone-500">{sectionData.allData.length} total</span>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={14} />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white border-[#eadfca] text-xs rounded-sm h-10 focus:border-amber-400"
                />
              </div>

              <Button
                onClick={handleAddPost}
                size="sm"
                className="w-full bg-amber-100 hover:bg-amber-200 text-amber-950 shadow-sm rounded-sm cursor-pointer transition duration-700"
              >
                <Plus size={16} className="mr-2" /> New Post
              </Button>

              <ScrollArea className="flex-1 pr-3 -mr-3 h-[calc(100vh-450px)]">
                <div className="flex flex-col gap-2">
                  {filteredPosts.map((post) => (
                    <motion.div
                      layoutId={`post-list-${post.id}`}
                      key={post.id}
                      onClick={() => setActivePostId(post.id)}
                      className={`
                        group relative cursor-pointer rounded-sm border p-3 transition-all duration-200
                        ${
                          activePostId === post.id
                            ? "border-amber-300 bg-amber-50 shadow-sm"
                            : "bg-transparent border-transparent hover:bg-amber-50 hover:border-amber-200"
                        }
                      `}
                    >
                      <div className="flex gap-3">
                        <div className="h-12 w-12 rounded-sm bg-amber-50 border border-[#eadfca] shrink-0 overflow-hidden relative">
                          {post.coverImage ? (
                            <Image src={post.coverImage} alt="" fill sizes="48px" className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-stone-400">
                              <ImageIcon size={16} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-sm font-medium truncate ${activePostId === post.id ? "text-amber-950" : "text-stone-600 group-hover:text-stone-900"}`}
                          >
                            {post.title || "Untitled"}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            {post.featured && <Star size={10} className="text-amber-500 fill-amber-500" />}
                            <span className="text-[10px] text-stone-500">{post.publishedAt}</span>
                          </div>
                          <span className="mt-2 inline-flex w-fit rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-900">
                            {post.category || "Uncategorized"}
                          </span>
                        </div>
                      </div>
                      <Button
                        aria-label={`Edit ${post.title || "post"}`}
                        className="absolute right-10 top-2 h-7 w-7 rounded-sm bg-amber-100 p-0 text-amber-900 opacity-0 transition-opacity hover:bg-amber-200 group-hover:opacity-100 focus-visible:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPost(post.id);
                        }}
                        title="Edit post"
                        type="button"
                      >
                        <Edit2 size={12} />
                      </Button>
                      <Button
                        onClick={(e) => handleDeletePost(post.id, e)}
                        className={`
                           absolute top-2 right-2 h-7 w-7 rounded-sm bg-red-100 p-0 text-red-700 hover:bg-red-200
                           opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100
                           ${sectionData.allData.length === 1 ? "hidden" : ""}
                        `}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          </div>

          <div className="space-y-6" ref={editorRef}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8 rounded-sm border border-[#eadfca] bg-white p-6 shadow-sm md:p-8"
            >
              <div className="flex flex-col items-start gap-6">
                <div className="space-y-4 flex-1 w-full">
                  <div className="space-y-2">
                    <Label className="text-stone-600 text-xs uppercase font-bold tracking-wider">Headline</Label>
                    <Input
                      value={activePost.title}
                      onChange={(e) => updatePost("title", e.target.value)}
                      className="bg-white border-[#eadfca] text-lg md:text-xl font-bold h-12 focus:border-amber-400 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-600 text-xs uppercase font-bold tracking-wider">
                      Excerpt / Summary
                    </Label>
                    <Textarea
                      rows={6}
                      value={activePost.excerpt}
                      onChange={(e) => updatePost("excerpt", e.target.value)}
                      className="bg-white border-[#eadfca] min-h-36 text-stone-700 resize-none focus:border-amber-400 transition-all text-sm leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex w-full flex-col items-stretch justify-between gap-3 rounded-sm border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center">
                  <Label className="text-stone-600 text-[10px] uppercase font-bold tracking-wider">Featured</Label>
                  <div className="w-full flex items-center justify-end gap-2">
                    <Star
                      size={16}
                      className={
                        activePost.featured ? "text-amber-600 fill-amber-500 transition-colors" : "text-stone-400"
                      }
                    />
                    <Switch
                      checked={activePost.featured ?? false}
                      onCheckedChange={(checked) => updatePost("featured", checked)}
                      className="data-[state=checked]:bg-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-stone-600 text-xs uppercase font-bold tracking-wider flex items-center gap-2">
                  <ImageIcon size={14} /> Cover Image
                </Label>
                <div className="aspect-video w-full rounded-sm border border-[#eadfca] bg-amber-50 overflow-hidden relative group">
                  {activePost.coverImage ? (
                    <Image
                      alt={activePost.title || "Cover image preview"}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, 66vw"
                      src={activePost.coverImage}
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-sm text-stone-500">No cover image selected</div>
                  )}
                  <div className="absolute inset-x-3 bottom-3 flex justify-end">
                    <Button
                      className="shrink-0 bg-amber-100 text-amber-950 hover:bg-amber-200"
                      onClick={() => setMediaTarget("cover")}
                      type="button"
                    >
                      <ImageIcon size={14} /> Media
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-5 rounded-sm border border-[#eadfca] bg-white p-6 shadow-sm"
              >
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 pb-3">
                  <Tag size={16} className="text-amber-700" /> Post Details
                </h3>

                <div className="grid gap-4">
                  <div className="space-y-2 text-stone-800">
                    <Label className="text-stone-600 text-xs uppercase tracking-wider font-bold">Category</Label>
                    <Select value={activePost.category} onValueChange={(val) => updatePost("category", val)}>
                      <SelectTrigger className="cursor-pointer border-amber-300 bg-amber-50 text-xs text-amber-950 focus:border-amber-400">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="border-amber-200 bg-[#fffaf0] text-stone-700">
                        {sectionData.categories
                          .filter((c) => c !== "All")
                          .map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-stone-600 text-xs uppercase tracking-wider font-bold">Read Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={14} />
                      <Input
                        value={activePost.readTime}
                        onChange={(e) => updatePost("readTime", e.target.value)}
                        className="bg-white border-[#eadfca] pl-9 h-9 text-xs focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-stone-600 text-xs uppercase tracking-wider font-bold">Publish Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={14} />
                    <Input
                      value={activePost.publishedAt}
                      onChange={(e) => updatePost("publishedAt", e.target.value)}
                      className="bg-white border-[#eadfca] pl-9 h-9 text-xs focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-stone-600 text-xs uppercase tracking-wider font-bold">Tags</Label>
                  <Input
                    value={activePost.tags.join(", ")}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    className="bg-white border-[#eadfca] h-9 text-xs focus:border-amber-400"
                    placeholder="React, CSS, Design..."
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-5 rounded-sm border border-[#eadfca] bg-white p-6 shadow-sm"
              >
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 pb-3">
                  <User size={16} className="text-amber-700" /> Author Info
                </h3>

                <div className="space-y-4">
                  <div className="relative h-40 w-40 overflow-hidden rounded-full border border-[#eadfca] bg-amber-50">
                    {activePost.author.avatar ? (
                      <Image
                        alt={`${activePost.author.name} avatar preview`}
                        className="object-cover"
                        fill
                        sizes="160px"
                        src={activePost.author.avatar}
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-center text-xs text-stone-500">
                        No avatar selected
                      </div>
                    )}
                  </div>
                  <div className="flex justify-start">
                    <Button
                      className="shrink-0 bg-amber-100 text-amber-950 hover:bg-amber-200"
                      onClick={() => setMediaTarget("avatar")}
                      type="button"
                    >
                      <ImageIcon size={14} /> Media
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <Input
                      value={activePost.author.name}
                      onChange={(e) => updateAuthor("name", e.target.value)}
                      className="bg-white border-[#eadfca] h-9 text-sm focus:border-amber-400"
                      placeholder="Author Name"
                    />
                    <Input
                      value={activePost.author.role}
                      onChange={(e) => updateAuthor("role", e.target.value)}
                      className="bg-white border-[#eadfca] h-9 text-xs focus:border-amber-400"
                      placeholder="Role / Title"
                    />
                  </div>
                </div>

                <div className="rounded-sm border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
                  Tip: Use high-quality avatars. The author name will appear on the article card and detailed view.
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {mediaTarget && (
        <ImagePickerModal
          close={() => setMediaTarget(null)}
          onSelect={(url) => {
            if (mediaTarget === "cover") updatePost("coverImage", url);
            else updateAuthor("avatar", url);
            setMediaTarget(null);
          }}
          title={mediaTarget === "cover" ? "Choose cover image" : "Choose author avatar"}
          uploadLabel={mediaTarget === "cover" ? "Upload cover image" : "Upload avatar"}
        />
      )}
    </div>
  );
};

export default MutationSection5;
