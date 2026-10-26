/*
|-----------------------------------------
| setting up Mutation.tsx for Container 2
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import {
  ArrowUpDown,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  EyeOff,
  GripVertical,
  LayoutGrid,
  Loader2,
  PackagePlus,
  RotateCcw,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Star,
  Trash2,
  Type,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AlertDialog } from "@/components/ui/alert-dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Toast } from "@/components/ui/toast";

import {
  ContainerGridLayout,
  ContainerMobileGridLayout,
  ContainerSortMode,
  defaultDataContainer2,
  IContainerData,
  TemplateItem,
  templateImagePlaceholder,
} from "./data";

export interface ContainerFormProps {
  data?: IContainerData;
  onChange?: (values: IContainerData) => void;
  onSubmit?: (values: IContainerData) => void;
}

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  realPrice: number;
  discountPrice: number;
  primaryImage: string;
  star?: number;
  categories?: string[];
}

interface ProductsResponse {
  items?: ProductItem[];
  total?: number;
}

interface CategoryItem {
  id: string;
  name: string;
}

interface CategoriesResponse {
  items?: CategoryItem[];
}

const inputClass =
  "w-full rounded-sm border border-[#eadfca] bg-white px-3 py-2 text-sm text-stone-800 outline-none transition duration-700 placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100";
const labelClass = "text-[11px] font-semibold uppercase tracking-[0.08em] text-stone-600";
const panelClass =
  "rounded-sm border border-[#eadfca] bg-white p-4 text-stone-800 shadow-[0_14px_35px_-28px_rgba(120,53,15,.35)] sm:p-5";
const amberButtonClass =
  "inline-flex h-9 cursor-pointer items-center gap-2 rounded-sm border border-[#eadfca] bg-amber-100 px-3 text-sm font-semibold text-amber-950 transition duration-700 hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50";
const destructiveButtonClass =
  "inline-flex h-9 cursor-pointer items-center gap-2 rounded-sm border border-red-200 bg-red-50 px-3 text-sm font-semibold text-red-700 transition duration-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50";

const clampSpacing = (value: number | string | undefined) => Math.max(-300, Math.min(300, Number(value) || 0));

const fontFamilies = [
  { label: "Default (Inherit)", value: "inherit" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Poppins", value: "Poppins, sans-serif" },
  { label: "Outfit", value: "Outfit, sans-serif" },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
];

const fontWeights = [
  { label: "300 - Light", value: "300" },
  { label: "400 - Normal", value: "400" },
  { label: "500 - Medium", value: "500" },
  { label: "600 - Semi Bold", value: "600" },
  { label: "700 - Bold", value: "700" },
  { label: "800 - Extra Bold", value: "800" },
  { label: "900 - Black", value: "900" },
];

const legacyDemoProductUids = new Set(["THEME-001", "THEME-002", "THEME-003", "THEME-004"]);

const normalizeSettings = (data?: IContainerData): IContainerData => ({
  ...defaultDataContainer2,
  ...data,
  title: data?.title || data?.sectionTitle || defaultDataContainer2.title,
  sortMode: data?.sortMode || defaultDataContainer2.sortMode,
  gridLayout: data?.gridLayout || defaultDataContainer2.gridLayout,
  mobileGridLayout: data?.mobileGridLayout || defaultDataContainer2.mobileGridLayout,
  showSeeMore: data?.showSeeMore ?? defaultDataContainer2.showSeeMore,
  showBottomNavigation: data?.showBottomNavigation ?? defaultDataContainer2.showBottomNavigation,
  paddingX: String(data?.paddingX ?? defaultDataContainer2.paddingX),
  paddingY: String(data?.paddingY ?? defaultDataContainer2.paddingY),
  titleFontFamily: data?.titleFontFamily || defaultDataContainer2.titleFontFamily,
  titleFontSize: data?.titleFontSize || defaultDataContainer2.titleFontSize,
  titleFontColor: data?.titleFontColor || defaultDataContainer2.titleFontColor,
  titleFontWeight: data?.titleFontWeight || defaultDataContainer2.titleFontWeight,
  seeMore: {
    ...defaultDataContainer2.seeMore,
    ...(data?.seeMore || {}),
    name: data?.seeMore?.name || data?.viewMoreText || defaultDataContainer2.seeMore.name,
  },
  templates: (data?.templates?.length ? data.templates : defaultDataContainer2.templates)
    .filter((template) => !legacyDemoProductUids.has(template.productUID || ""))
    .map((template) => ({
      ...template,
      visible: template.visible ?? true,
    })),
});

const nextId = (items: TemplateItem[]) => Math.max(0, ...items.map((item) => Number(item.id) || 0)) + 1;

const getProductPrice = (product: ProductItem) => {
  const value = Number(product.discountPrice || product.realPrice || 0);
  return value ? `${value.toLocaleString()}৳` : "0৳";
};

const getProductImage = (product: ProductItem) => product.primaryImage || templateImagePlaceholder;

const getProductKey = (product: ProductItem) => product.id;

const productToTemplate = (product: ProductItem, id: number): TemplateItem => ({
  id,
  sourceProductId: product.id,
  productUID: product.sku || product.id,
  title: product.name || "Untitled Product",
  price: getProductPrice(product),
  views: "0",
  rating: Math.min(5, Math.max(0, Number(product.star) || 5)),
  image: getProductImage(product),
  url: product.slug ? `/products/${product.slug}` : "",
});

const sortTemplates = (templates: TemplateItem[], sortMode: ContainerSortMode) => {
  if (sortMode === "custom") return templates;
  return [...templates].sort((a, b) => {
    const result = a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: "base" });
    return sortMode === "ascending" ? result : -result;
  });
};

const mutationGridLayoutClasses: Record<ContainerGridLayout, string> = {
  "1x1": "grid-cols-1",
  "1x2": "grid-cols-1 sm:grid-cols-2",
  "1x3": "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
};

const cardImageSizeClasses: Record<ContainerGridLayout, string> = {
  "1x1": "aspect-square w-24 shrink-0 sm:w-28",
  "1x2": "aspect-[4/3] w-full",
  "1x3": "aspect-[4/3] w-full",
};

const RatingStars = ({ rating }: { rating: number }) => (
  <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={11}
        className={index < Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-300"}
      />
    ))}
  </span>
);

const MutationContainer2 = ({ data, onChange }: ContainerFormProps) => {
  const [settings, setSettings] = useState<IContainerData>(() => normalizeSettings(data));
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState("");
  const [isRemoveAllOpen, setIsRemoveAllOpen] = useState(false);
  const [toast, setToast] = useState<{ error?: boolean; message: string } | null>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.(settings);
  }, [settings]);

  const sortedTemplates = useMemo(
    () => sortTemplates(settings.templates, settings.sortMode),
    [settings.sortMode, settings.templates],
  );
  const importedProductsGridClassName =
    mutationGridLayoutClasses[settings.gridLayout] || mutationGridLayoutClasses[defaultDataContainer2.gridLayout];
  const importedProductKeys = useMemo(() => {
    const keys = new Set<string>();
    settings.templates.forEach((item) => {
      if (item.sourceProductId) keys.add(item.sourceProductId);
      if (item.productUID) keys.add(item.productUID);
      if (item.title) keys.add(item.title);
    });
    return keys;
  }, [settings.templates]);

  const isProductAlreadyAdded = useCallback(
    (product: ProductItem) =>
      Boolean(
        importedProductKeys.has(product.id) ||
        importedProductKeys.has(product.sku) ||
        importedProductKeys.has(product.name),
      ),
    [importedProductKeys],
  );

  const categoryOptions = useMemo(
    () => categories.filter((category) => products.some((product) => product.categories?.includes(category.id))),
    [categories, products],
  );
  const visibleProducts = useMemo(
    () =>
      selectedCategoryId === "all"
        ? products
        : products.filter((product) => product.categories?.includes(selectedCategoryId)),
    [products, selectedCategoryId],
  );
  const visibleProductKeys = useMemo(() => visibleProducts.map(getProductKey).filter(Boolean), [visibleProducts]);
  const allProductsChecked =
    visibleProductKeys.length > 0 && visibleProductKeys.every((key) => selectedProductIds.includes(key));
  const newSelectedProductCount = products.filter((product) => {
    const key = getProductKey(product);
    return key && selectedProductIds.includes(key) && !isProductAlreadyAdded(product);
  }).length;

  useEffect(() => {
    if (!isImportOpen || products.length > 0) return;

    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      setProductsError("");
      try {
        const [productResponse, categoryResponse] = await Promise.all([
          fetch("/api/dashboard/products/v1?page=1&limit=100", { credentials: "same-origin" }),
          fetch("/api/dashboard/categories/v1", { credentials: "same-origin" }),
        ]);
        const result = (await productResponse.json()) as ProductsResponse;
        const categoryResult = (await categoryResponse.json()) as CategoriesResponse;
        if (!productResponse.ok || !categoryResponse.ok) throw new Error("Could not load dashboard products.");
        const remainingProducts = await Promise.all(
          Array.from({ length: Math.max(0, Math.ceil((result.total || 0) / 100) - 1) }, (_, index) =>
            fetch(`/api/dashboard/products/v1?page=${index + 2}&limit=100`, { credentials: "same-origin" }).then(
              async (pageResponse) => {
                if (!pageResponse.ok) throw new Error("Could not load dashboard products.");
                return (await pageResponse.json()) as ProductsResponse;
              },
            ),
          ),
        );
        setProducts([...(result.items || []), ...remainingProducts.flatMap((page) => page.items || [])]);
        setCategories(categoryResult.items || []);
      } catch {
        setProducts([]);
        setCategories([]);
        setProductsError("Could not load dashboard products. Please try again.");
      } finally {
        setIsLoadingProducts(false);
      }
    };

    void fetchProducts();
  }, [isImportOpen, products.length]);

  const updateSettings = (patch: Partial<IContainerData>) => setSettings((prev) => ({ ...prev, ...patch }));

  const openImporter = () => {
    setSelectedProductIds(
      products.map((product) => (isProductAlreadyAdded(product) ? getProductKey(product) : "")).filter(Boolean),
    );
    setIsImportOpen(true);
  };

  const updateSortMode = (sortMode: ContainerSortMode) => {
    setSettings((prev) => ({
      ...prev,
      sortMode,
      templates: sortTemplates(prev.templates, sortMode),
    }));
  };

  const moveTemplate = (fromId: number, toId: number) => {
    if (fromId === toId) return;
    setSettings((prev) => {
      const next = [...prev.templates];
      const fromIndex = next.findIndex((item) => item.id === fromId);
      const toIndex = next.findIndex((item) => item.id === toId);
      if (fromIndex < 0 || toIndex < 0) return prev;
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return { ...prev, sortMode: "custom", templates: next };
    });
  };

  const moveTemplateByOffset = (id: number, offset: number) => {
    setSettings((prev) => {
      const current = sortTemplates(prev.templates, prev.sortMode);
      const fromIndex = current.findIndex((item) => item.id === id);
      const toIndex = fromIndex + offset;
      if (fromIndex < 0 || toIndex < 0 || toIndex >= current.length) return prev;
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return { ...prev, sortMode: "custom", templates: next };
    });
  };

  const toggleTemplateVisibility = (id: number) => {
    setSettings((prev) => ({
      ...prev,
      templates: prev.templates.map((item) => (item.id === id ? { ...item, visible: !(item.visible ?? true) } : item)),
    }));
  };

  const removeTemplate = (id: number) => {
    setSettings((prev) => ({ ...prev, templates: prev.templates.filter((template) => template.id !== id) }));
    setToast({ message: "Product removed." });
  };

  const removeAllTemplates = () => {
    setSettings((prev) => ({ ...prev, templates: [] }));
    setIsRemoveAllOpen(false);
    setToast({ message: "All products removed." });
  };

  const toggleProductSelection = (id: string, checked: boolean) => {
    setSelectedProductIds((prev) => (checked ? [...new Set([...prev, id])] : prev.filter((item) => item !== id)));
  };

  const checkAllProducts = () => {
    setSelectedProductIds((previous) => [...new Set([...previous, ...visibleProductKeys])]);
  };

  const uncheckAllProducts = () => {
    setSelectedProductIds([]);
  };

  const importSelectedProducts = () => {
    setSettings((prev) => {
      const existingSourceIds = new Set(prev.templates.map((item) => item.sourceProductId).filter(Boolean));
      const existingProductUids = new Set(prev.templates.map((item) => item.productUID).filter(Boolean));
      const existingTitles = new Set(prev.templates.map((item) => item.title).filter(Boolean));
      const selectedProducts = products.filter((product) => {
        const key = getProductKey(product);
        if (!key || !selectedProductIds.includes(key)) return false;
        return !(
          existingSourceIds.has(product.id) ||
          existingProductUids.has(product.sku) ||
          existingTitles.has(product.name)
        );
      });
      let idSeed = nextId(prev.templates);
      const importedTemplates = selectedProducts.map((product) => productToTemplate(product, idSeed++));
      return { ...prev, templates: [...prev.templates, ...importedTemplates] };
    });
    setSelectedProductIds([]);
    setIsImportOpen(false);
    setToast({ message: "Products imported successfully." });
  };

  return (
    <div className="custom-parent-border mx-auto w-full max-w-7xl bg-white px-0 py-5 text-stone-800 sm:px-6">
      <div className={panelClass}>
        {/* Section 1: Main Container Header & Title */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-amber-100 text-amber-900">
                <SlidersHorizontal size={13} />
              </span>
              <label className={labelClass}>Section Title</label>
            </div>
            <input
              value={settings.title}
              onChange={(event) => updateSettings({ title: event.target.value })}
              className={`${inputClass} mt-1.5`}
              placeholder="e.g. All Theme, Carousel Highlights"
            />
          </div>
          <div className="flex items-end">
            <button type="button" onClick={openImporter} className={amberButtonClass}>
              <PackagePlus size={16} />
              <span>Import Product</span>
              {settings.templates.length > 0 && (
                <span className="rounded-sm bg-amber-200/80 px-1.5 py-0.5 text-xs font-bold text-amber-950">
                  {settings.templates.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Title Typography & Design */}
        <div className="mt-5 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-amber-100 text-amber-900">
                <Type size={14} />
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Title Design & Typography</h4>
                <p className="text-[11px] font-medium text-stone-500">
                  Customize font family, size, color, and weight for the container title
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                updateSettings({
                  titleFontFamily: defaultDataContainer2.titleFontFamily,
                  titleFontSize: defaultDataContainer2.titleFontSize,
                  titleFontColor: defaultDataContainer2.titleFontColor,
                  titleFontWeight: defaultDataContainer2.titleFontWeight,
                })
              }
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-sm border border-[#eadfca] bg-white px-2.5 text-xs font-semibold text-stone-700 transition duration-700 hover:bg-amber-100"
            >
              <RotateCcw size={12} /> Reset Title Style
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Font Family */}
            <div>
              <label className={labelClass}>Font Family</label>
              <select
                value={settings.titleFontFamily || "inherit"}
                onChange={(event) => updateSettings({ titleFontFamily: event.target.value })}
                className={`${inputClass} mt-1.5 cursor-pointer`}
              >
                {fontFamilies.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size */}
            <div>
              <div className="flex items-center justify-between">
                <label className={labelClass}>Font Size</label>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-950">
                  {settings.titleFontSize || "24"}px
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="number"
                  min={10}
                  max={100}
                  value={settings.titleFontSize || "24"}
                  onChange={(event) => updateSettings({ titleFontSize: event.target.value })}
                  className={`${inputClass} w-20 shrink-0 text-center`}
                />
                <Slider
                  aria-label="Font size"
                  min={10}
                  max={80}
                  step={1}
                  value={[Number(settings.titleFontSize) || 24]}
                  onValueChange={([nextValue]) => updateSettings({ titleFontSize: String(nextValue ?? 24) })}
                  className="accent-amber-600"
                />
              </div>
            </div>

            {/* Font Color */}
            <div>
              <label className={labelClass}>Font Color</label>
              <div className="mt-1.5 flex items-center gap-2">
                <input
                  type="color"
                  value={settings.titleFontColor || "#2563eb"}
                  onChange={(event) => updateSettings({ titleFontColor: event.target.value })}
                  className="h-[42px] w-12 shrink-0 cursor-pointer rounded-sm border border-[#eadfca] bg-white p-1"
                />
                <input
                  type="text"
                  value={settings.titleFontColor || "#2563eb"}
                  onChange={(event) => updateSettings({ titleFontColor: event.target.value })}
                  className={inputClass}
                  placeholder="#2563eb"
                />
              </div>
            </div>

            {/* Font Width / Weight */}
            <div>
              <label className={labelClass}>Font Width / Weight</label>
              <select
                value={settings.titleFontWeight || "700"}
                onChange={(event) => updateSettings({ titleFontWeight: event.target.value })}
                className={`${inputClass} mt-1.5 cursor-pointer`}
              >
                {fontWeights.map((weight) => (
                  <option key={weight.value} value={weight.value}>
                    {weight.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Live Title Preview */}
          <div className="mt-4 rounded-sm border border-[#eadfca] bg-white p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Live Title Preview</span>
            <div className="mt-1 overflow-x-auto py-1">
              <span
                style={{
                  fontFamily:
                    settings.titleFontFamily && settings.titleFontFamily !== "inherit"
                      ? settings.titleFontFamily
                      : undefined,
                  fontSize: `${settings.titleFontSize || 24}px`,
                  color: settings.titleFontColor || "#2563eb",
                  fontWeight: settings.titleFontWeight || "700",
                }}
              >
                {settings.title || "Section Title"}
              </span>
            </div>
          </div>
        </div>

        {/* Section Spacing (Padding X & Padding Y) */}
        <div className="mt-5 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-amber-100 text-amber-900">
                <SlidersHorizontal size={14} />
              </span>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Section Spacing (Padding)</h4>
                <p className="text-[11px] font-medium text-stone-500">
                  Tune the container horizontal and vertical breathing room
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                updateSettings({
                  paddingX: defaultDataContainer2.paddingX,
                  paddingY: defaultDataContainer2.paddingY,
                })
              }
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-sm border border-[#eadfca] bg-white px-2.5 text-xs font-semibold text-stone-700 transition duration-700 hover:bg-amber-100"
            >
              <RotateCcw size={12} /> Reset Spacing
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {(["paddingX", "paddingY"] as const).map((field) => {
              const value = clampSpacing(settings[field]);
              const label = field === "paddingX" ? "Padding X" : "Padding Y";
              return (
                <div key={field} className="rounded-sm border border-[#eadfca] bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label className="text-xs font-semibold text-stone-800">{label}</label>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold tabular-nums text-blue-700">
                      {value}px
                    </span>
                  </div>
                  <Slider
                    aria-label={label}
                    min={-300}
                    max={300}
                    step={1}
                    value={[value]}
                    onValueChange={([nextValue]) => updateSettings({ [field]: String(nextValue ?? 0) })}
                    className="accent-blue-600"
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
          <p className="mt-3 border-l-2 border-amber-300 pl-3 text-[11px] leading-4 text-stone-500">
            Negative padding values are accepted for editing, but the live preview clamps them to 0px because CSS
            padding cannot be negative.
          </p>
        </div>

        {/* Section 2: Navigation & "See More" Configuration */}
        <div className="mt-5 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ExternalLink size={14} className="text-stone-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Section Navigation & Carousel
              </h4>
            </div>
            <span className="text-[11px] font-medium text-stone-500">Carousel controls & link settings</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className={labelClass}>See More Name</label>
              <input
                value={settings.seeMore.name}
                onChange={(event) => updateSettings({ seeMore: { ...settings.seeMore, name: event.target.value } })}
                className={`${inputClass} mt-1.5`}
                placeholder="See More"
              />
            </div>
            <div>
              <label className={labelClass}>See More URL</label>
              <input
                value={settings.seeMore.url}
                onChange={(event) => updateSettings({ seeMore: { ...settings.seeMore, url: event.target.value } })}
                className={`${inputClass} mt-1.5`}
                placeholder="/all-container"
              />
            </div>
            <div className="flex items-end">
              <label className="flex h-[42px] w-full cursor-pointer items-center justify-between gap-3.5 rounded-sm border border-[#eadfca] bg-white px-3.5 shadow-sm transition duration-700 hover:border-amber-400">
                <span className="text-xs font-semibold text-stone-800">Show See More</span>
                <Switch
                  checked={settings.showSeeMore}
                  onCheckedChange={(checked) => updateSettings({ showSeeMore: checked })}
                />
              </label>
            </div>
            <div className="flex items-end">
              <label className="flex h-[42px] w-full cursor-pointer items-center justify-between gap-3.5 rounded-sm border border-[#eadfca] bg-white px-3.5 shadow-sm transition duration-700 hover:border-amber-400">
                <span className="text-xs font-semibold text-stone-800">Bottom Dots Nav</span>
                <Switch
                  checked={settings.showBottomNavigation}
                  onCheckedChange={(checked) => updateSettings({ showBottomNavigation: checked })}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Product Management & Display Toolbar */}
        <div className="mt-5 flex flex-col gap-4 border-t border-[#eadfca] pt-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-amber-100 text-amber-900">
              <Sparkles size={16} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold leading-tight text-stone-800">Products in Carousel</h3>
                <span className="rounded-sm border border-[#eadfca] bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-950">
                  {settings.templates.length} item{settings.templates.length === 1 ? "" : "s"}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {settings.sortMode === "custom"
                  ? "Drag cards or use arrows to reorder in custom sort"
                  : `Sorted ${settings.sortMode === "ascending" ? "A-Z" : "Z-A"}`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Sort Mode Dropdown */}
            <div className="flex items-center gap-1.5 rounded-sm border border-[#eadfca] bg-[#fffaf0] px-2.5 py-1.5">
              <ArrowUpDown size={13} className="text-stone-500" />
              <select
                value={settings.sortMode}
                onChange={(event) => updateSortMode(event.target.value as ContainerSortMode)}
                className="bg-transparent text-xs font-semibold text-stone-800 outline-none cursor-pointer"
                aria-label="Product sort order"
              >
                <option value="custom">Custom Order</option>
                <option value="ascending">Title: A to Z</option>
                <option value="descending">Title: Z to A</option>
              </select>
            </div>

            {/* Desktop Grid Layout Selector */}
            <div className="flex items-center gap-1 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-1">
              <LayoutGrid size={13} className="ml-1 text-stone-500" />
              {(["1x1", "1x2", "1x3"] as ContainerGridLayout[]).map((layout) => (
                <button
                  key={layout}
                  type="button"
                  onClick={() => updateSettings({ gridLayout: layout })}
                  title={`Desktop Grid: ${layout.replace("x", " × ")}`}
                  className={`flex h-7 min-w-8 cursor-pointer items-center justify-center rounded-sm px-2 text-xs transition duration-700 ${
                    settings.gridLayout === layout
                      ? "border border-amber-400 bg-amber-100 font-bold text-amber-950"
                      : "border border-transparent text-stone-600 hover:bg-white"
                  }`}
                  aria-label={`Set desktop grid ${layout.replace("x", " by ")}`}
                  aria-pressed={settings.gridLayout === layout}
                >
                  {layout}
                </button>
              ))}
            </div>

            {/* Mobile Grid Layout Selector */}
            <div className="flex items-center gap-1 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-1">
              <Smartphone size={13} className="ml-1 text-stone-500" />
              {(["1x1", "1x2"] as ContainerMobileGridLayout[]).map((layout) => (
                <button
                  key={layout}
                  type="button"
                  onClick={() => updateSettings({ mobileGridLayout: layout })}
                  title={`Mobile Grid: ${layout.replace("x", " × ")}`}
                  className={`flex h-7 min-w-8 cursor-pointer items-center justify-center rounded-sm px-2 text-xs transition duration-700 ${
                    settings.mobileGridLayout === layout
                      ? "border border-amber-400 bg-amber-100 font-bold text-amber-950"
                      : "border border-transparent text-stone-600 hover:bg-white"
                  }`}
                  aria-label={`Set mobile grid ${layout.replace("x", " by ")}`}
                  aria-pressed={settings.mobileGridLayout === layout}
                >
                  {layout}
                </button>
              ))}
            </div>

            {/* Remove All Button */}
            <button
              type="button"
              onClick={() => setIsRemoveAllOpen(true)}
              disabled={settings.templates.length === 0}
              className={destructiveButtonClass}
            >
              <Trash2 size={14} />
              <span>Remove All</span>
            </button>
          </div>
        </div>

        {/* Section 4: Products Cards List / Grid */}
        {settings.templates.length === 0 ? (
          <div className="mt-5 flex flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-[#eadfca] bg-[#fffaf0] p-8 text-center text-stone-500">
            <PackagePlus size={24} className="text-amber-800" />
            <div>
              <p className="text-sm font-semibold text-stone-800">No products added yet</p>
              <p className="text-xs text-stone-500">Import products from dashboard to populate this carousel.</p>
            </div>
            <button type="button" onClick={openImporter} className={`${amberButtonClass} mt-1`}>
              <PackagePlus size={16} /> Import Product
            </button>
          </div>
        ) : (
          <div className={`mt-5 grid auto-rows-fr items-stretch gap-4 ${importedProductsGridClassName}`}>
            {sortedTemplates.map((item, index) => {
              const isCustomSort = settings.sortMode === "custom";
              const itemIndex = sortedTemplates.findIndex((template) => template.id === item.id);
              const isDragging = draggedId === item.id;
              const isDragTarget = dragOverId === item.id && draggedId !== item.id;
              const isCompact = settings.gridLayout === "1x1";

              return (
                <div
                  key={item.id}
                  draggable={isCustomSort}
                  onDragStart={() => setDraggedId(item.id)}
                  onDragEnter={() => isCustomSort && setDragOverId(item.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDragEnd={() => {
                    setDraggedId(null);
                    setDragOverId(null);
                  }}
                  onDrop={() => {
                    if (draggedId) moveTemplate(draggedId, item.id);
                    setDraggedId(null);
                    setDragOverId(null);
                  }}
                  className={`group relative min-w-0 overflow-hidden rounded-sm border bg-white transition-all duration-700 ${
                    isCompact ? "flex min-h-28 items-center gap-3 p-2.5" : "flex h-full flex-col"
                  } ${
                    isDragging
                      ? "scale-[0.97] border-amber-300/40 opacity-50"
                      : isDragTarget
                        ? "border-amber-300/60 ring-2 ring-amber-300/30"
                        : "border-[#eadfca] hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
                  }`}
                >
                  {/* Floating Action Controls */}
                  <div className="absolute right-2 top-2 z-10 flex gap-1 rounded-sm bg-white/95 p-0.5 border border-[#eadfca] backdrop-blur-sm">
                    <button
                      aria-label={`Move ${item.title} up`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-stone-700 transition duration-700 hover:bg-amber-50 disabled:opacity-40"
                      disabled={itemIndex === 0}
                      onClick={() => moveTemplateByOffset(item.id, -1)}
                      type="button"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      aria-label={`Move ${item.title} down`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-stone-700 transition duration-700 hover:bg-amber-50 disabled:opacity-40"
                      disabled={itemIndex === sortedTemplates.length - 1}
                      onClick={() => moveTemplateByOffset(item.id, 1)}
                      type="button"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      aria-label={`${(item.visible ?? true) ? "Hide" : "Show"} ${item.title}`}
                      aria-pressed={item.visible ?? true}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-sm text-stone-700 transition duration-700 hover:bg-amber-50"
                      onClick={() => toggleTemplateVisibility(item.id)}
                      type="button"
                    >
                      {(item.visible ?? true) ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                  </div>

                  {/* Product Image Box */}
                  <div
                    className={`relative shrink-0 overflow-hidden bg-[#fffaf0] ${
                      isCompact
                        ? `${cardImageSizeClasses["1x1"]} rounded-sm border border-[#eadfca]`
                        : cardImageSizeClasses[settings.gridLayout]
                    }`}
                  >
                    <Image
                      src={item.image || templateImagePlaceholder}
                      alt={item.title || "Product image"}
                      fill
                      className="object-contain p-2 transition duration-300 group-hover:scale-105"
                      priority={index === 0}
                      loading={index < 4 ? "eager" : "lazy"}
                    />

                    {/* Drag Handle Tag */}
                    {isCustomSort && (
                      <span
                        className={`absolute flex items-center justify-center rounded-sm bg-stone-900/10 text-stone-700 backdrop-blur-sm cursor-grab active:cursor-grabbing ${
                          isCompact ? "left-1 top-1 h-5 w-5" : "left-2 top-2 h-7 w-7"
                        }`}
                        title="Drag to reorder"
                      >
                        <GripVertical size={isCompact ? 11 : 14} />
                      </span>
                    )}

                    {/* Non-compact Image Badges */}
                    {!isCompact && (
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <span className="rounded-sm border border-[#eadfca] bg-amber-100/95 px-2 py-0.5 text-xs font-bold text-amber-950 backdrop-blur-sm">
                          {item.price}
                        </span>
                        <span className="flex items-center gap-1 rounded-sm border border-[#eadfca] bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-stone-700 shadow-sm">
                          <Eye size={11} /> {item.views}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content & Details */}
                  {isCompact ? (
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-semibold leading-snug text-stone-800">
                          {item.title || "Untitled Product"}
                        </h4>
                        <div className="mt-1 flex items-center gap-2">
                          <RatingStars rating={item.rating} />
                          <span className="rounded-sm border border-[#eadfca] bg-[#fffaf0] px-1.5 py-0.5 text-[10px] font-medium text-stone-600">
                            {item.productUID || "N/A"}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-stone-500">
                            <Eye size={11} /> {item.views}
                          </span>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2.5">
                        <span className="rounded-sm border border-[#eadfca] bg-amber-100 px-2 py-1 text-xs font-bold text-amber-950">
                          {item.price}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeTemplate(item.id)}
                          className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-sm border border-red-200 bg-red-50 px-2.5 text-xs font-semibold text-red-700 transition duration-700 hover:bg-red-100"
                          aria-label={`Remove ${item.title}`}
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-1 flex-col justify-between p-3">
                      <div>
                        <h4 className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-stone-800">
                          {item.title || "Untitled Product"}
                        </h4>
                        <div className="mt-2 flex items-center justify-between">
                          <RatingStars rating={item.rating} />
                          <span className="rounded-sm border border-[#eadfca] bg-[#fffaf0] px-1.5 py-0.5 text-[10px] font-medium text-stone-600">
                            {item.productUID || "N/A"}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTemplate(item.id)}
                        className="mt-3 inline-flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 rounded-sm border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-700 transition duration-700 hover:bg-red-100"
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Dialog: Remove All */}
      <AlertDialog
        description={`This will remove all ${settings.templates.length} product${settings.templates.length === 1 ? "" : "s"} from this container.`}
        onCancel={() => setIsRemoveAllOpen(false)}
        onConfirm={removeAllTemplates}
        open={isRemoveAllOpen}
        title="Remove all items?"
      />

      {/* Product Importer Modal - Creamy-White Theme */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/35 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-sm border border-[#eadfca] bg-white text-stone-800 shadow-xl">
            {/* Modal Header */}
            <div className="relative flex items-center justify-between gap-4 border-b border-[#eadfca] bg-[#fffaf0] p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-amber-100 text-amber-950">
                  <PackagePlus size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-800">Import Products</h3>
                  <p className="text-xs text-stone-500">Import every product at once or select a category first.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-[#eadfca] bg-white text-stone-600 transition duration-700 hover:bg-stone-100 hover:text-stone-800"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="relative flex-1 overflow-y-auto p-4 sm:p-5">
              {isLoadingProducts ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2.5 text-stone-500">
                  <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
                  <span className="text-xs font-semibold text-stone-600">Loading store products…</span>
                </div>
              ) : productsError ? (
                <div className="rounded-sm border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
                  {productsError}
                </div>
              ) : products.length === 0 ? (
                <div className="rounded-sm border border-dashed border-[#eadfca] bg-[#fffaf0] p-10 text-center text-stone-500">
                  <p className="text-sm font-semibold text-stone-800">No products found</p>
                  <p className="mt-1 text-xs">Create products in your dashboard first.</p>
                </div>
              ) : (
                <>
                  {/* Selection Actions Bar */}
                  <div className="mb-4 flex flex-col gap-3 rounded-sm border border-[#eadfca] bg-[#fffaf0] p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold text-stone-800">
                        {selectedProductIds.length} of {products.length} products checked
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {newSelectedProductCount} new product{newSelectedProductCount === 1 ? "" : "s"} ready to add
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <select
                        aria-label="Import products by category"
                        className="rounded-sm border border-[#eadfca] bg-white px-2.5 py-1.5 text-xs font-semibold text-stone-700 outline-none focus:border-amber-400"
                        onChange={(event) => setSelectedCategoryId(event.target.value)}
                        value={selectedCategoryId}
                      >
                        <option value="all">All categories</option>
                        {categoryOptions.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={checkAllProducts}
                        disabled={allProductsChecked}
                        className="inline-flex items-center gap-1.5 rounded-sm border border-[#eadfca] bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition duration-700 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <CheckCheck size={14} /> Import All{selectedCategoryId === "all" ? " Products" : " in Category"}
                      </button>
                      <button
                        type="button"
                        onClick={uncheckAllProducts}
                        disabled={selectedProductIds.length === 0}
                        className="inline-flex items-center gap-1.5 rounded-sm border border-[#eadfca] bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition duration-700 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Uncheck All
                      </button>
                    </div>
                  </div>

                  {/* Product Checkboxes Grid */}
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {visibleProducts.map((product, index) => {
                      const productId = getProductKey(product);
                      const isSelected = selectedProductIds.includes(productId);
                      const isAlreadyAdded = isProductAlreadyAdded(product);
                      return (
                        <label
                          key={productId}
                          className={`flex cursor-pointer items-center gap-3 rounded-sm border p-3 transition duration-700 ${
                            isSelected
                              ? "border-amber-400 bg-amber-50 shadow-sm"
                              : "border-[#eadfca] bg-white hover:border-amber-300 hover:bg-[#fffaf0]"
                          }`}
                        >
                          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffaf0]">
                            <Image
                              src={getProductImage(product)}
                              alt={product.name || "Product image"}
                              fill
                              className="object-contain p-1"
                              loading={index < 4 ? "eager" : "lazy"}
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-bold text-stone-800">
                              {product.name || "Untitled Product"}
                            </span>
                            <div className="mt-0.5 flex items-center gap-2">
                              <span className="text-[11px] font-mono text-stone-500">{product.sku || "No SKU"}</span>
                              <span className="rounded-sm border border-[#eadfca] bg-amber-100 px-1.5 py-0.2 text-[10px] font-bold text-amber-950">
                                {getProductPrice(product)}
                              </span>
                            </div>
                            {isAlreadyAdded && (
                              <span className="mt-1 inline-flex items-center gap-1 rounded-sm border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                                <Check size={10} /> Already added
                              </span>
                            )}
                          </span>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(event) => toggleProductSelection(productId, event.target.checked)}
                            className="h-4.5 w-4.5 shrink-0 rounded-sm border-[#eadfca] accent-amber-600"
                          />
                        </label>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="relative flex items-center justify-between gap-3 border-t border-[#eadfca] bg-[#fffaf0] p-4 sm:p-5">
              <span className="text-xs font-medium text-stone-500">
                {selectedProductIds.length} checked · {newSelectedProductCount} new
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportOpen(false)}
                  className="rounded-sm border border-[#eadfca] bg-white px-4 py-2 text-xs font-semibold text-stone-700 transition duration-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={importSelectedProducts}
                  disabled={newSelectedProductCount === 0}
                  className={amberButtonClass}
                >
                  Import {newSelectedProductCount > 0 ? `(${newSelectedProductCount})` : ""}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Toast */}
      {toast ? <Toast error={toast.error} message={toast.message} onDismiss={() => setToast(null)} /> : null}
    </div>
  );
};

export default MutationContainer2;
