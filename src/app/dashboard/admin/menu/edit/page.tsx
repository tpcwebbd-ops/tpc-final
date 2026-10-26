/*
|-----------------------------------------
| setting up page.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: NexaMart, August, 2026
|-----------------------------------------
*/

"use client";

import {
  ArrowDown,
  ArrowUp,
  Check,
  Image,
  LayoutList,
  MousePointer2,
  Palette,
  Pencil,
  Plus,
  Smartphone,
  Trash2,
  Type,
  X,
} from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type PointerEvent as ReactPointerEvent,
  type SetStateAction,
} from "react";
import { genUploader } from "uploadthing/client";

import { authClient } from "@/app/api/lib/auth-client";
import type { OurFileRouter } from "@/app/api/uploadthing/v1/core";
import LogoMediaPicker from "@/app/dashboard/admin/footer/assets/LogoMediaPicker";
import type { MenuData, MenuLink } from "@/app/dashboard/admin/menu/data";
import { iconMap, iconOptions } from "@/components/all-icons/all-icons";
import type { MenuButton } from "@/components/menu/menu-1/data";
import MenuOneQuery from "@/components/menu/menu-1/Query";
import MenuTwoQuery from "@/components/menu/menu-2/Query";
import MenuThreeQuery from "@/components/menu/menu-3/Query";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { Switch } from "@/components/ui/switch";
import { useCreateMediaMutation } from "@/redux/features/dashboard/media/mediaSlice";

type Tab = "main" | "logo" | "brand" | "theme" | "button" | "mobile";
type LogoAspect = NonNullable<MenuData["logoAspect"]>;
type LogoCrop = NonNullable<MenuData["logoCrop"]>;
const emptyLogoCrop: LogoCrop = { left: 0, right: 0, top: 0, bottom: 0 };
const { uploadFiles } = genUploader<OurFileRouter>({ url: "/api/uploadthing/v1" });
const tabs = [
  { id: "main", label: "Main Menu", icon: LayoutList },
  { id: "logo", label: "Logo", icon: Image },
  { id: "brand", label: "Brand Name", icon: Type },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "button", label: "Button", icon: MousePointer2 },
  { id: "mobile", label: "Mobile", icon: Smartphone },
] as const;
const sizes = [
  [12, "xs"],
  [14, "sm"],
  [16, "md"],
  [20, "XL"],
  [24, "2XL"],
  [30, "3XL"],
  [36, "4XL"],
] as const;
const field =
  "mt-1 h-9 w-full rounded-sm border border-stone-200 bg-white px-3 text-sm outline-none focus:border-amber-400";
const api = async <T,>(url: string, init?: RequestInit) => {
  const response = await fetch(url, { cache: "no-store", ...init });
  const value = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(value.error || "Request failed.");
  return value;
};
function Render({ data }: { data: MenuData }) {
  return data.variant === "menu-2" ? (
    <MenuTwoQuery data={data} pending={false} />
  ) : data.variant === "menu-3" ? (
    <MenuThreeQuery data={data} pending={false} />
  ) : (
    <MenuOneQuery data={data} pending={false} />
  );
}
function Select({
  value,
  onChange,
  options,
}: {
  value: string | number;
  onChange: (value: string) => void;
  options: readonly (readonly [string | number, string])[];
}) {
  return (
    <select className={field} value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map(([id, label]) => (
        <option key={id} value={id}>
          {label}
        </option>
      ))}
    </select>
  );
}
function RangeInput({
  value,
  onChange,
  min,
  max,
  unit = "px",
}: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit?: string;
}) {
  return (
    <div className="mt-1 flex items-center gap-3">
      <input
        className="h-2 min-w-0 flex-1 accent-amber-700"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        type="range"
        value={value}
      />
      <output className="w-16 text-right text-xs text-stone-600">
        {value}
        {unit}
      </output>
    </div>
  );
}
function ValueRangeInput({
  value,
  onChange,
  min = -350,
  max = 350,
  unit = "px",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
}) {
  return (
    <div className="mt-2 flex items-center">
      <input
        className="h-2 min-w-0 flex-1 accent-amber-700"
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        type="range"
        value={value}
      />
      <div className="relative ml-3 w-14 border-l border-amber-200 pl-3 text-xs font-medium tabular-nums text-amber-950">
        <input
          aria-label={`Value in ${unit}`}
          className="w-full bg-transparent pr-3 text-right outline-none"
          max={max}
          min={min}
          onChange={(event) => onChange(Number(event.target.value))}
          type="number"
          value={value}
        />
        <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 text-[10px] text-amber-800">
          {unit}
        </span>
      </div>
    </div>
  );
}
function transparentBackground(color: string, transparency: number) {
  const hex = color.replace("#", "");
  if (hex.length !== 6) return color;
  const value = Number.parseInt(hex, 16);
  return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${transparency / 100})`;
}
function ActionButtonPreview({ button }: { button: MenuButton }) {
  const Icon = button.showIcon && button.icon ? iconMap[button.icon] : null;
  const radius = {
    none: "rounded-none",
    xs: "rounded-sm",
    sm: "rounded",
    md: "rounded-md",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  }[button.radius];
  const border = { none: "border-0", xs: "border", sm: "border", md: "border-2", xl: "border-4" }[
    button.border ?? "none"
  ];
  const label = button.type === "continue" || button.type === "custom" ? button.label || "Custom" : "Login / Dashboard";
  return (
    <div className="grid min-h-52 place-items-center bg-[radial-gradient(circle_at_top,#fef3c7,white_65%)] p-5">
      <button
        className={`menu-action-button inline-flex items-center gap-1 px-[var(--button-padding-x-mobile)] py-[var(--button-padding-y-mobile)] mx-[var(--button-margin-x-mobile)] my-[var(--button-margin-y-mobile)] md:px-[var(--button-padding-x-desktop)] md:py-[var(--button-padding-y-desktop)] md:mx-[var(--button-margin-x-desktop)] md:my-[var(--button-margin-y-desktop)] ${border} ${radius}`}
        style={
          {
            "--button-padding-x-mobile": `${button.mobilePaddingX ?? button.paddingX}px`,
            "--button-padding-y-mobile": `${button.mobilePaddingY ?? button.paddingY}px`,
            "--button-margin-x-mobile": `${button.mobileMarginX ?? button.marginX ?? 0}px`,
            "--button-margin-y-mobile": `${button.mobileMarginY ?? button.marginY ?? 0}px`,
            "--button-padding-x-desktop": `${button.desktopPaddingX ?? button.paddingX}px`,
            "--button-padding-y-desktop": `${button.desktopPaddingY ?? button.paddingY}px`,
            "--button-margin-x-desktop": `${button.desktopMarginX ?? button.marginX ?? 0}px`,
            "--button-margin-y-desktop": `${button.desktopMarginY ?? button.marginY ?? 0}px`,
            background: button.transparentBackground
              ? transparentBackground(button.background, button.transparency)
              : button.background,
            borderColor: button.foreground,
            color: button.foreground,
          } as CSSProperties
        }
        type="button"
      >
        {Icon}
        {label}
      </button>
    </div>
  );
}

export default function MenuEditPage() {
  const menuItem = useSearchParams().get("menuItem");
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [open, setOpen] = useState<Tab | null>("main");
  const [visual, setVisual] = useState(false);
  const [picker, setPicker] = useState(false);
  const [logoEditor, setLogoEditor] = useState(false);
  const [logoAspect, setLogoAspect] = useState<LogoAspect>("full");
  const [logoCrop, setLogoCrop] = useState<LogoCrop>(emptyLogoCrop);
  const [buttonIconPicker, setButtonIconPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [createMedia] = useCreateMediaMutation();
  useEffect(() => {
    if (sessionPending) {
      setLoading(true);
      return;
    }
    if (!session) {
      setMessage("Sign in required.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setMessage("");
    void api<{ menus: { menuItem: string; data: MenuData }[] }>("/api/dashboard/menu/v1")
      .then((result) => setMenu(result.menus.find((item) => item.menuItem === menuItem)?.data ?? null))
      .catch((cause) => setMessage(cause instanceof Error ? cause.message : "Could not load menu."))
      .finally(() => setLoading(false));
  }, [menuItem, session, sessionPending]);
  const update = (patch: Partial<MenuData>) => setMenu((current) => (current ? { ...current, ...patch } : current));
  const openLogoEditor = () => {
    setLogoAspect(menu?.logoAspect ?? "full");
    setLogoCrop(menu?.logoCrop ?? emptyLogoCrop);
    setLogoEditor(true);
  };
  const updateButtonSpacing = (field: keyof MenuButton, value: number) =>
    setMenu((current) => (current ? { ...current, button: { ...current.button, [field]: value } } : current));
  const persist = async (dataToSave: MenuData, successMessage = "Saved.") => {
    if (!menuItem) return;
    await api("/api/dashboard/menu/v1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menuItem, data: dataToSave }),
    });
    setMessage(successMessage);
    window.dispatchEvent(new Event("webapps-menu-updated"));
    localStorage.setItem("webapps-menu-updated", String(Date.now()));
    new BroadcastChannel("webapps-menu").postMessage("updated");
  };
  const createCroppedMedia = async (
    data: MenuData,
    crop = data.logoCrop ?? emptyLogoCrop,
    aspect = data.logoAspect ?? "full",
  ) => {
    const file = await createCroppedLogoFile(data.logoUrl, crop, aspect, data.logoZoom ?? 100);
    const [uploaded] = await uploadFiles("imageUploader", { files: [file] });
    if (!uploaded?.ufsUrl || !uploaded.key) throw new Error("Could not upload the cropped logo.");
    await createMedia({
      name: file.name,
      url: uploaded.ufsUrl,
      type: "picture",
      uploadPlane: "Uploadthings",
      fileKey: uploaded.key,
    }).unwrap();
    return { ...data, logoUrl: uploaded.ufsUrl, logoAspect: "full" as const, logoCrop: emptyLogoCrop, logoZoom: 100 };
  };
  const save = async () => {
    if (!menu) return;
    setSaving(true);
    try {
      const nextMenu = (menu.logoZoom ?? 100) !== 100 ? await createCroppedMedia(menu) : menu;
      setMenu(nextMenu);
      await persist(nextMenu, nextMenu === menu ? "Saved." : "Zoomed logo saved.");
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };
  const applyLogoCrop = async () => {
    if (!menu) return;
    setSaving(true);
    try {
      const nextMenu = await createCroppedMedia(menu, logoCrop, logoAspect);
      setMenu(nextMenu);
      await persist(nextMenu, "Cropped logo saved.");
      setLogoEditor(false);
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : "Could not save cropped logo.");
    } finally {
      setSaving(false);
    }
  };
  if (loading) return <LoadingState label={sessionPending ? "Checking access" : "Loading menu"} />;
  if (!menu)
    return (
      <main className="grid flex-1 place-items-center bg-[#fffaf0] p-6">
        <p className="rounded-sm border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {message || "Menu not found."}
        </p>
      </main>
    );
  const spacingControls = (
    device: "Mobile" | "Desktop",
    fields: { paddingX: keyof MenuData; paddingY: keyof MenuData; marginX: keyof MenuData; marginY: keyof MenuData },
  ) => (
    <fieldset className="grid gap-4 rounded-sm border border-stone-200 bg-[#fffdf8] p-4 sm:grid-cols-2">
      <legend className="rounded-sm bg-amber-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-amber-950">
        {device}
      </legend>
      <div className="flex justify-end sm:col-span-2">
        <Button
          onClick={() =>
            update({
              [fields.paddingX]: 0,
              [fields.paddingY]: 0,
              [fields.marginX]: 0,
              [fields.marginY]: 0,
            })
          }
          size="sm"
          type="button"
          variant="outline"
        >
          Reset {device}
        </Button>
      </div>
      <label className="text-sm text-stone-700">
        Padding X
        <ValueRangeInput
          max={350}
          min={-350}
          onChange={(value) => update({ [fields.paddingX]: value })}
          value={(menu[fields.paddingX] as number | undefined) ?? 0}
        />
      </label>
      <label className="text-sm text-stone-700">
        Padding Y
        <ValueRangeInput
          max={350}
          min={-350}
          onChange={(value) => update({ [fields.paddingY]: value })}
          value={(menu[fields.paddingY] as number | undefined) ?? 0}
        />
      </label>
      <label className="text-sm text-stone-700">
        Margin X
        <ValueRangeInput
          max={350}
          min={-350}
          onChange={(value) => update({ [fields.marginX]: value })}
          value={(menu[fields.marginX] as number | undefined) ?? 0}
        />
      </label>
      <label className="text-sm text-stone-700">
        Margin Y
        <ValueRangeInput
          max={350}
          min={-350}
          onChange={(value) => update({ [fields.marginY]: value })}
          value={(menu[fields.marginY] as number | undefined) ?? 0}
        />
      </label>
    </fieldset>
  );
  const buttonSpacingControls = (
    device: "Mobile" | "Desktop",
    fields: {
      paddingX: keyof MenuData["button"];
      paddingY: keyof MenuData["button"];
      marginX: keyof MenuData["button"];
      marginY: keyof MenuData["button"];
    },
  ) => (
    <fieldset className="grid gap-4 rounded-sm border border-amber-100 bg-[#fffdf8] p-4 sm:grid-cols-2">
      <legend className="rounded-sm bg-amber-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-amber-950">
        {device}
      </legend>
      <div className="flex justify-end sm:col-span-2">
        <Button
          onClick={() =>
            update({
              button: {
                ...menu.button,
                [fields.paddingX]: 0,
                [fields.paddingY]: 0,
                [fields.marginX]: 0,
                [fields.marginY]: 0,
              },
            })
          }
          size="sm"
          type="button"
          variant="outline"
        >
          Reset {device}
        </Button>
      </div>
      <label className="text-sm text-stone-700">
        Padding X
        <ValueRangeInput
          onChange={(value) => updateButtonSpacing(fields.paddingX, value)}
          value={(menu.button[fields.paddingX] as number | undefined) ?? 0}
        />
      </label>
      <label className="text-sm text-stone-700">
        Padding Y
        <ValueRangeInput
          onChange={(value) => updateButtonSpacing(fields.paddingY, value)}
          value={(menu.button[fields.paddingY] as number | undefined) ?? 0}
        />
      </label>
      <label className="text-sm text-stone-700">
        Margin X
        <ValueRangeInput
          onChange={(value) => updateButtonSpacing(fields.marginX, value)}
          value={(menu.button[fields.marginX] as number | undefined) ?? 0}
        />
      </label>
      <label className="text-sm text-stone-700">
        Margin Y
        <ValueRangeInput
          onChange={(value) => updateButtonSpacing(fields.marginY, value)}
          value={(menu.button[fields.marginY] as number | undefined) ?? 0}
        />
      </label>
    </fieldset>
  );
  const logo = (
    <div className="grid gap-5">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <h2 className="font-medium">Logo</h2>
        <label className="flex items-center gap-2 text-sm">
          Visible
          <Switch checked={menu.showLogo} onCheckedChange={(showLogo) => update({ showLogo })} />
        </label>
      </div>
      <div className="grid gap-5">
        <div className="relative grid min-h-56 place-items-center overflow-hidden rounded-sm border border-stone-200 bg-stone-50 p-5">
          <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
            <Button onClick={() => setPicker(true)} size="sm" type="button">
              Upload
            </Button>
            {menu.logoUrl ? (
              <Button onClick={openLogoEditor} size="sm" type="button" variant="outline">
                Edit
              </Button>
            ) : null}
            <Button
              aria-label="Remove logo"
              disabled={!menu.logoUrl}
              onClick={() => update({ logoUrl: "" })}
              size="icon"
              title="Remove logo"
              type="button"
              variant="outline"
            >
              <X className="size-4" />
            </Button>
          </div>
          {menu.logoUrl ? (
            <NextImage
              alt={menu.logoAlt}
              className="h-auto max-h-64 w-full object-contain transition-transform duration-300"
              height={512}
              src={menu.logoUrl}
              style={{ transform: `scale(${(menu.logoZoom ?? 100) / 100})` }}
              width={512}
            />
          ) : (
            <span className="text-sm text-stone-500">No logo</span>
          )}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label>
            Logo alt
            <input className={field} value={menu.logoAlt} onChange={(e) => update({ logoAlt: e.target.value })} />
          </label>
          {menu.logoUrl ? (
            <label>
              Zoom
              <ValueRangeInput
                max={200}
                min={10}
                onChange={(logoZoom) => update({ logoZoom })}
                unit="%"
                value={menu.logoZoom ?? 100}
              />
            </label>
          ) : null}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {spacingControls("Mobile", {
            paddingX: "logoMobilePaddingX",
            paddingY: "logoMobilePaddingY",
            marginX: "logoMobileMarginX",
            marginY: "logoMobileMarginY",
          })}
          {spacingControls("Desktop", {
            paddingX: "logoDesktopPaddingX",
            paddingY: "logoDesktopPaddingY",
            marginX: "logoDesktopMarginX",
            marginY: "logoDesktopMarginY",
          })}
        </div>
      </div>
    </div>
  );
  const brandFonts = ["Arial", "Georgia", "Verdana", "Poppins", "Courier New"];
  const brand = (
    <div className="grid gap-5">
      <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
        <div>
          <h2 className="font-medium">Brand Name</h2>
          <p
            className="mt-2"
            style={{ color: menu.brandColor, fontFamily: menu.brandFontFamily, fontSize: menu.brandFontSize }}
          >
            {menu.brand || "Preview Text"}
          </p>
        </div>
        <label className="flex shrink-0 items-center gap-2 text-sm">
          Display Brand Name
          <Switch checked={menu.showBrand} onCheckedChange={(showBrand) => update({ showBrand })} />
        </label>
      </div>
      <div className="grid gap-5">
        <div>
          <span className="text-sm">Font Family</span>
          <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {brandFonts.map((font) => (
              <button
                className={`rounded-sm border p-3 text-left text-sm transition ${menu.brandFontFamily === font ? "border-amber-500 bg-amber-50" : "border-stone-200 bg-white hover:border-amber-300"}`}
                key={font}
                onClick={() => update({ brandFontFamily: font })}
                type="button"
              >
                <span className="block text-xs text-stone-500">{font}</span>
                <span className="mt-1 block" style={{ fontFamily: font }}>
                  Preview Text
                </span>
              </button>
            ))}
          </div>
        </div>
        <label>
          Brand Name
          <input className={field} onChange={(e) => update({ brand: e.target.value })} value={menu.brand} />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label>
            Font Size
            <Select
              onChange={(brandFontSize) => update({ brandFontSize: Number(brandFontSize) })}
              options={sizes}
              value={menu.brandFontSize}
            />
          </label>
          <div>
            <span className="text-sm">Text Color</span>
            <input
              aria-label="Brand text color"
              className="mt-1 block h-10 w-16 cursor-pointer rounded-sm border border-stone-200 bg-white p-1"
              onChange={(e) => update({ brandColor: e.target.value })}
              type="color"
              value={menu.brandColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
  const themeFonts = ["Arial", "Georgia", "Verdana", "Poppins", "Courier New"];
  const themeSizes = [
    [12, "xs"],
    [14, "sm"],
    [20, "XL"],
    [24, "2XL"],
    [30, "3XL"],
  ] as const;
  const theme = (
    <div className="grid gap-5">
      <div>
        <span className="text-sm">Menu Position</span>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(["fixed", "sticky", "scroll"] as const).map((position) => (
            <button
              className={`rounded-sm border px-3 py-3 text-sm font-medium capitalize transition ${menu.position === position ? "border-amber-500 bg-amber-50 text-amber-950" : "border-stone-200 bg-white hover:border-amber-300"}`}
              key={position}
              onClick={() => update({ position })}
              type="button"
            >
              {position}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label>
          Background Color
          <input
            className={field}
            onChange={(e) => update({ background: e.target.value })}
            type="color"
            value={menu.background}
          />
        </label>
        <label>
          Text Color
          <input
            className={field}
            onChange={(e) => update({ foreground: e.target.value })}
            type="color"
            value={menu.foreground}
          />
        </label>
        <label>
          Background Transparency
          <RangeInput
            max={100}
            min={0}
            onChange={(transparency) => update({ transparency })}
            unit="%"
            value={menu.transparency}
          />
        </label>
        <label>
          Font Size
          <Select
            onChange={(fontSize) => update({ fontSize: Number(fontSize) })}
            options={themeSizes}
            value={menu.fontSize}
          />
        </label>
        <div className="sm:col-span-2">
          <span className="text-sm">Font Family</span>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {themeFonts.map((font) => (
              <button
                className={`rounded-sm border p-3 text-left text-sm transition ${menu.fontFamily === font ? "border-amber-500 bg-amber-50" : "border-stone-200 bg-white hover:border-amber-300"}`}
                key={font}
                onClick={() => update({ fontFamily: font })}
                type="button"
              >
                <span className="block text-xs text-stone-500">{font}</span>
                <span className="mt-1 block" style={{ fontFamily: font }}>
                  Preview Text
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  const button = (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="grid gap-4 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <span className="text-sm">Action Button</span>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <button
                className={`rounded-sm border px-4 py-3 text-sm font-medium transition duration-700 ${menu.button.type !== "continue" && menu.button.type !== "custom" ? "border-amber-500 bg-amber-50 text-amber-950" : "border-stone-200 bg-white text-stone-600 hover:border-amber-300"}`}
                onClick={() => update({ button: { ...menu.button, type: "dashboard" } })}
                type="button"
              >
                Login / Dashboard
              </button>
              <button
                className={`rounded-sm border px-4 py-3 text-sm font-medium transition duration-700 ${menu.button.type === "continue" || menu.button.type === "custom" ? "border-amber-500 bg-amber-50 text-amber-950" : "border-stone-200 bg-white text-stone-600 hover:border-amber-300"}`}
                onClick={() => update({ button: { ...menu.button, type: "continue" } })}
                type="button"
              >
                Custom
              </button>
            </div>
          </div>
          <div>
            <span className="text-sm">Icon</span>
            <div className="mt-1 flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-sm border border-stone-200 bg-white text-stone-700">
                {menu.button.icon ? iconMap[menu.button.icon] : "—"}
              </span>
              <Button onClick={() => setButtonIconPicker(true)} size="sm" type="button" variant="outline">
                Choose Icon
              </Button>
            </div>
          </div>
          {menu.button.type === "continue" || menu.button.type === "custom" ? (
            <>
              <label>
                Name
                <input
                  className={field}
                  value={menu.button.label}
                  onChange={(e) => update({ button: { ...menu.button, label: e.target.value } })}
                />
              </label>
              <label>
                Path
                <input
                  className={field}
                  value={menu.button.url}
                  onChange={(e) => update({ button: { ...menu.button, url: e.target.value } })}
                />
              </label>
            </>
          ) : null}
          <label className="flex items-center justify-between">
            <span>
              <span className="block">Visible in menu</span>
              <span className="block text-xs text-stone-500">Show this action button in the published menu.</span>
            </span>
            <Switch
              checked={menu.button.visible !== false}
              onCheckedChange={(visible) => update({ button: { ...menu.button, visible } })}
            />
          </label>
          <label className="flex items-center justify-between">
            Display icon
            <Switch
              checked={Boolean(menu.button.showIcon)}
              onCheckedChange={(showIcon) => update({ button: { ...menu.button, showIcon } })}
            />
          </label>
          <label className="flex items-center justify-between">
            Transparent background
            <Switch
              checked={Boolean(menu.button.transparentBackground)}
              onCheckedChange={(transparentBackground) => update({ button: { ...menu.button, transparentBackground } })}
            />
          </label>
          {menu.button.transparentBackground ? (
            <label className="text-sm text-stone-700">
              Transparency
              <ValueRangeInput
                max={100}
                min={0}
                onChange={(transparency) => update({ button: { ...menu.button, transparency } })}
                unit="%"
                value={menu.button.transparency}
              />
            </label>
          ) : (
            <label>
              Solid color
              <input
                className={field}
                type="color"
                value={menu.button.background}
                onChange={(e) => update({ button: { ...menu.button, background: e.target.value } })}
              />
            </label>
          )}
          <div className="grid gap-4 sm:col-span-2 sm:grid-cols-3">
            <label>
              Text color
              <input
                className={field}
                type="color"
                value={menu.button.foreground}
                onChange={(e) => update({ button: { ...menu.button, foreground: e.target.value } })}
              />
            </label>

            <label>
              Border
              <Select
                value={menu.button.border ?? "none"}
                onChange={(border) =>
                  update({ button: { ...menu.button, border: border as NonNullable<MenuData["button"]["border"]> } })
                }
                options={[
                  ["none", "None"],
                  ["xs", "xs"],
                  ["sm", "sm"],
                  ["md", "md"],
                  ["xl", "xl"],
                ]}
              />
            </label>
            <label>
              Border radius
              <Select
                value={menu.button.radius}
                onChange={(radius) =>
                  update({ button: { ...menu.button, radius: radius as MenuData["button"]["radius"] } })
                }
                options={[
                  ["none", "None"],
                  ["xs", "xs"],
                  ["sm", "sm"],
                  ["md", "md"],
                  ["xl", "xl"],
                  ["2xl", "2xl"],
                  ["full", "Full"],
                ]}
              />
            </label>
          </div>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {buttonSpacingControls("Mobile", {
            paddingX: "mobilePaddingX",
            paddingY: "mobilePaddingY",
            marginX: "mobileMarginX",
            marginY: "mobileMarginY",
          })}
          {buttonSpacingControls("Desktop", {
            paddingX: "desktopPaddingX",
            paddingY: "desktopPaddingY",
            marginX: "desktopMarginX",
            marginY: "desktopMarginY",
          })}
        </div>
      </div>
      <aside className="min-w-0 overflow-hidden rounded-sm border border-amber-200 bg-amber-50/50 p-3">
        <p className="mb-3 text-sm font-medium text-amber-950">Live preview</p>
        <div className="overflow-hidden rounded-sm border border-[#eadfca] bg-white">
          {menu.button.visible !== false ? (
            <ActionButtonPreview button={menu.button} />
          ) : (
            <p className="p-4 text-sm text-stone-500">The action button is hidden in the menu.</p>
          )}
        </div>
      </aside>
    </div>
  );
  const mobile = (
    <div className="grid gap-5">
      <div className="flex items-center justify-between gap-4 rounded-sm border border-amber-200 bg-amber-50/60 p-4">
        <div>
          <h2 className="font-medium text-amber-950">Enable custom Mobile Menu</h2>
          <p className="mt-1 text-sm text-stone-600">
            When enabled, these items render only below the mobile breakpoint.
          </p>
        </div>
        <Switch
          checked={menu.mobile.enabled}
          onCheckedChange={(enabled) => update({ mobile: { ...menu.mobile, enabled } })}
        />
      </div>
      <MobileMenuPanel mobile={menu.mobile} onChange={(mobile) => update({ mobile })} />
    </div>
  );
  const main = <MainMenuPanel links={menu.links} onChange={(links) => update({ links })} />;
  const section =
    open === "main"
      ? main
      : open === "logo"
        ? logo
        : open === "brand"
          ? brand
          : open === "theme"
            ? theme
            : open === "button"
              ? button
              : mobile;
  return (
    <main className="min-w-0 flex-1 bg-[#fffaf0] p-4 sm:p-6 lg:p-10">
      <div className="mx-auto grid w-full min-w-0 max-w-6xl gap-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Link className="text-sm text-stone-500 hover:text-stone-800" href="/dashboard/admin/menu">
              ← Menu
            </Link>
            <h1 className="mt-1 text-lg font-semibold">Edit Menu {menu.variant.replace("menu-", "")}</h1>
          </div>
          <Button disabled={saving} onClick={() => void save()}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
        {message ? <p className="rounded-sm bg-amber-100 p-3 text-sm text-amber-950">{message}</p> : null}
        <section className="min-w-0 overflow-hidden rounded-sm border border-[#eadfca] bg-white">
          <Render data={menu} />
        </section>
        <section className="min-w-0 rounded-sm border border-[#eadfca] bg-white p-3 shadow-[0_18px_45px_-34px_rgba(120,53,15,.55)] sm:p-5">
          <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const active = open === tab.id;
              return (
                <button
                  aria-pressed={active}
                  className={`group relative flex min-h-24 flex-col items-center justify-center gap-2 overflow-hidden rounded-sm border px-3 py-3 text-center text-sm font-medium transition duration-700 ${active ? "border-amber-500 bg-gradient-to-br from-amber-100 via-amber-50 to-white text-amber-950 shadow-sm" : "border-stone-200 bg-white text-stone-600 hover:-translate-y-0.5 hover:border-amber-300 hover:bg-amber-50/60 hover:text-stone-900"}`}
                  key={tab.id}
                  onClick={() => setOpen(tab.id)}
                  type="button"
                >
                  <span
                    className={`grid size-9 place-items-center rounded-full transition duration-700 ${active ? "bg-amber-600 text-white shadow-md" : "bg-stone-100 text-stone-500 group-hover:bg-amber-100 group-hover:text-amber-800"}`}
                  >
                    <TabIcon className="size-4" />
                  </span>
                  <span>{tab.label}</span>
                  {active ? <span className="absolute inset-x-4 bottom-0 h-0.5 bg-amber-600" /> : null}
                </button>
              );
            })}
          </div>
          {open ? (
            <div className="mt-5 min-w-0 border-t border-stone-100 pt-5">
              <div className="mb-4 flex items-center justify-end">
                {open !== "main" &&
                open !== "logo" &&
                open !== "brand" &&
                open !== "theme" &&
                open !== "button" &&
                open !== "mobile" ? (
                  <label className="flex items-center gap-2 text-sm">
                    Visual option
                    <Switch checked={visual} onCheckedChange={setVisual} />
                  </label>
                ) : null}
              </div>
              {section}
              {visual &&
              open !== "main" &&
              open !== "logo" &&
              open !== "brand" &&
              open !== "theme" &&
              open !== "button" &&
              open !== "mobile" ? (
                <div className="mt-5 overflow-hidden rounded-sm border border-dashed border-amber-300">
                  <Render data={menu} />
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
      {buttonIconPicker ? (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-stone-950/35 p-4 backdrop-blur-sm">
          <section
            aria-modal="true"
            className="w-full max-w-3xl overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffaf0] shadow-2xl"
            role="dialog"
          >
            <header className="flex items-center justify-between border-b border-[#eadfca] p-5">
              <h2 className="font-semibold text-stone-900">Choose Icon</h2>
              <Button
                aria-label="Close icon picker"
                onClick={() => setButtonIconPicker(false)}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X className="size-4" />
              </Button>
            </header>
            <div className="grid max-h-[65vh] grid-cols-3 gap-2 overflow-y-auto p-5 sm:grid-cols-5 md:grid-cols-7">
              {iconOptions.map((icon) => (
                <button
                  aria-label={icon}
                  className={`grid min-h-20 place-items-center gap-2 rounded-sm border p-2 text-xs transition ${menu.button.icon === icon ? "border-amber-500 bg-amber-50 text-amber-950" : "border-stone-200 bg-white text-stone-700 hover:border-amber-300"}`}
                  key={icon}
                  onClick={() => {
                    update({ button: { ...menu.button, icon, showIcon: true } });
                    setButtonIconPicker(false);
                  }}
                  type="button"
                >
                  <span>{iconMap[icon]}</span>
                  <span className="w-full truncate">{icon}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : null}
      {picker ? (
        <LogoMediaPicker
          close={() => setPicker(false)}
          onSelect={(logoUrl) => {
            update({ logoUrl, showLogo: true, logoAspect: "full", logoCrop: emptyLogoCrop, logoZoom: 100 });
            setPicker(false);
          }}
        />
      ) : null}
      {logoEditor ? (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-stone-950/35 p-4 backdrop-blur-sm">
          <section
            aria-modal="true"
            className="w-full max-w-2xl overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffaf0] shadow-2xl"
            role="dialog"
          >
            <header className="flex items-center justify-between border-b border-[#eadfca] p-5">
              <div>
                <h2 className="font-semibold text-stone-900">Edit logo</h2>
                <p className="mt-1 text-xs text-stone-500">Drag any crop border to choose the visible logo area.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button disabled={saving} onClick={() => void applyLogoCrop()} size="sm" type="button">
                  {saving ? (
                    <span
                      aria-hidden="true"
                      className="size-4 animate-spin rounded-full border-2 border-amber-100 border-t-amber-700"
                    />
                  ) : (
                    <Check className="size-4" />
                  )}
                  {saving ? "Cropping…" : "Apply"}
                </Button>
                <Button onClick={() => setLogoEditor(false)} size="sm" type="button" variant="outline">
                  <X className="size-4" />
                  Cancel
                </Button>
              </div>
            </header>
            <div className="grid gap-5 p-5">
              <LogoCropCanvas
                aspect={logoAspect}
                crop={logoCrop}
                onChange={setLogoCrop}
                onStartCrop={(nextCrop) => {
                  setLogoCrop(nextCrop);
                  setLogoAspect("custom");
                }}
                src={menu.logoUrl}
              />
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(["19:6", "1:1", "full", "custom"] as const).map((aspect) => (
                  <Button
                    className={logoAspect === aspect ? "border-amber-500 bg-amber-100 text-amber-950" : ""}
                    key={aspect}
                    onClick={() => {
                      setLogoAspect(aspect);
                      if (aspect !== "custom") setLogoCrop(emptyLogoCrop);
                    }}
                    size="sm"
                    type="button"
                    variant="outline"
                  >
                    {aspect === "full" ? "Full Size" : aspect === "custom" ? "Custom" : aspect}
                  </Button>
                ))}
              </div>
              {logoAspect === "custom" ? (
                <div className="rounded-sm border border-amber-100 bg-amber-50/50 p-4 text-sm text-amber-950">
                  Drag the left, right, top, or bottom border in the image above. Each border crops that side
                  independently.
                </div>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}
      {saving ? <LoadingState label="Saving menu" overlay /> : null}
    </main>
  );
}

async function createCroppedLogoFile(sourceUrl: string, crop: LogoCrop, aspect: LogoAspect, zoom: number) {
  const image = new window.Image();
  image.crossOrigin = "anonymous";
  image.src = sourceUrl;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Could not load the selected logo for cropping."));
  });
  const left = clampCrop(crop.left);
  const right = clampCrop(crop.right, 99 - left);
  const top = clampCrop(crop.top);
  const bottom = clampCrop(crop.bottom, 99 - top);
  let sourceX = (image.naturalWidth * left) / 100;
  let sourceY = (image.naturalHeight * top) / 100;
  let sourceWidth = (image.naturalWidth * (100 - left - right)) / 100;
  let sourceHeight = (image.naturalHeight * (100 - top - bottom)) / 100;
  const ratio = aspect === "19:6" ? 19 / 6 : aspect === "1:1" ? 1 : null;
  if (ratio && sourceWidth / sourceHeight > ratio) {
    const width = sourceHeight * ratio;
    sourceX += (sourceWidth - width) / 2;
    sourceWidth = width;
  } else if (ratio) {
    const height = sourceWidth / ratio;
    sourceY += (sourceHeight - height) / 2;
    sourceHeight = height;
  }
  const zoomScale = Math.min(2, Math.max(0.1, zoom / 100));
  if (zoomScale > 1) {
    const zoomedWidth = sourceWidth / zoomScale;
    const zoomedHeight = sourceHeight / zoomScale;
    sourceX += (sourceWidth - zoomedWidth) / 2;
    sourceY += (sourceHeight - zoomedHeight) / 2;
    sourceWidth = zoomedWidth;
    sourceHeight = zoomedHeight;
  }
  let scale = Math.min(1, 1600 / Math.max(sourceWidth, sourceHeight));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not prepare the cropped logo.");
  let blob: Blob | null = null;
  do {
    canvas.width = Math.max(1, Math.round(sourceWidth * scale));
    canvas.height = Math.max(1, Math.round(sourceHeight * scale));
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    const destinationWidth = canvas.width * Math.min(zoomScale, 1);
    const destinationHeight = canvas.height * Math.min(zoomScale, 1);
    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      (canvas.width - destinationWidth) / 2,
      (canvas.height - destinationHeight) / 2,
      destinationWidth,
      destinationHeight,
    );
    blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
    scale *= 0.75;
  } while (blob && blob.size > 3_500_000 && canvas.width > 1 && canvas.height > 1);
  if (!blob) throw new Error("Could not create the cropped logo image.");
  if (blob.size > 3_500_000) throw new Error("The cropped logo is too large to upload. Please crop a smaller area.");
  return new File([blob], `logo-crop-${Date.now()}.jpg`, { type: "image/jpeg" });
}

function clampCrop(value: number, max = 90) {
  return Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), max);
}

function MenuItemImagePreview({
  crop,
  radius,
  src,
}: {
  crop: NonNullable<MenuLink["imageCrop"]>;
  radius: NonNullable<MenuLink["imageRadius"]>;
  src: string;
}) {
  const dimensions =
    crop === "16:9" ? "aspect-video w-full max-w-sm" : crop === "full" ? "h-40 w-full max-w-sm" : "aspect-square h-40";
  const radiusClass = {
    none: "rounded-none",
    xs: "rounded-xs",
    sm: "rounded-sm",
    md: "rounded-md",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  }[radius];
  return (
    <div className={`${dimensions} overflow-hidden ${radiusClass}`}>
      <NextImage
        alt="Menu item preview"
        className={`h-full w-full ${crop === "full" ? "object-contain" : "object-cover"}`}
        height={160}
        src={src}
        width={320}
      />
    </div>
  );
}

async function createMenuItemImageFile(
  sourceUrl: string,
  crop: NonNullable<MenuLink["imageCrop"]>,
  radius: NonNullable<MenuLink["imageRadius"]>,
) {
  const image = new window.Image();
  image.crossOrigin = "anonymous";
  image.src = sourceUrl;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Could not load the selected menu image."));
  });
  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;
  const ratio = crop === "16:9" ? 16 / 9 : crop === "1:1" ? 1 : null;
  if (ratio && sourceWidth / sourceHeight > ratio) {
    const width = sourceHeight * ratio;
    sourceX = (sourceWidth - width) / 2;
    sourceWidth = width;
  } else if (ratio) {
    const height = sourceWidth / ratio;
    sourceY = (sourceHeight - height) / 2;
    sourceHeight = height;
  }
  let scale = Math.min(1, 1200 / Math.max(sourceWidth, sourceHeight));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not prepare the menu image.");
  const mimeType = radius === "none" ? "image/jpeg" : "image/png";
  let blob: Blob | null = null;
  do {
    canvas.width = Math.max(1, Math.round(sourceWidth * scale));
    canvas.height = Math.max(1, Math.round(sourceHeight * scale));
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (radius !== "none") {
      context.save();
      roundedCanvasPath(context, 0, 0, canvas.width, canvas.height, radiusPixels(radius, canvas.width, canvas.height));
      context.clip();
    }
    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
    if (radius !== "none") context.restore();
    blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mimeType, 0.86));
    scale *= 0.75;
  } while (blob && blob.size > 3_500_000 && canvas.width > 1 && canvas.height > 1);
  if (!blob || blob.size > 3_500_000)
    throw new Error("The edited image is too large to upload. Please use a smaller image.");
  const extension = radius === "none" ? "jpg" : "png";
  return new File([blob], `menu-image-${Date.now()}.${extension}`, { type: mimeType });
}

function radiusPixels(radius: NonNullable<MenuLink["imageRadius"]>, width: number, height: number) {
  const value = { none: 0, xs: 2, sm: 4, md: 6, xl: 12, "2xl": 16, full: Math.min(width, height) / 2 }[radius];
  return Math.min(value, Math.min(width, height) / 2);
}

function roundedCanvasPath(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function cropForAspect(crop: LogoCrop, aspect: LogoAspect, stageRatio: number): LogoCrop {
  const targetRatio = aspect === "19:6" ? 19 / 6 : aspect === "1:1" ? 1 : null;
  if (!targetRatio) return crop;
  if (stageRatio > targetRatio) {
    const width = (targetRatio / stageRatio) * 100;
    const inset = (100 - width) / 2;
    return { bottom: 0, left: inset, right: inset, top: 0 };
  }
  const height = (stageRatio / targetRatio) * 100;
  const inset = (100 - height) / 2;
  return { bottom: inset, left: 0, right: 0, top: inset };
}

function LogoCropCanvas({
  aspect,
  crop,
  onChange,
  onStartCrop,
  src,
}: {
  aspect: LogoAspect;
  crop: LogoCrop;
  onChange: Dispatch<SetStateAction<LogoCrop>>;
  onStartCrop: (crop: LogoCrop) => void;
  src: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageRatio, setStageRatio] = useState(16 / 9);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const updateRatio = () => setStageRatio(stage.clientWidth / stage.clientHeight || 16 / 9);
    updateRatio();
    const observer = new ResizeObserver(updateRatio);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);
  const visibleCrop = cropForAspect(crop, aspect, stageRatio);
  const beginCrop = (edge: keyof LogoCrop) => (event: ReactPointerEvent<HTMLDivElement>) => {
    const handle = event.currentTarget;
    const stage = handle.closest("[data-logo-crop-stage]");
    if (!(stage instanceof HTMLElement)) return;
    handle.setPointerCapture(event.pointerId);
    onStartCrop(visibleCrop);
    const bounds = stage.getBoundingClientRect();
    const updateFromPointer = (pointer: ReactPointerEvent<HTMLDivElement>) => {
      const horizontal = edge === "left" || edge === "right";
      const position = horizontal
        ? ((pointer.clientX - bounds.left) / bounds.width) * 100
        : ((pointer.clientY - bounds.top) / bounds.height) * 100;
      onChange(() => {
        const next = { ...visibleCrop };
        const paired = edge === "left" ? "right" : edge === "right" ? "left" : edge === "top" ? "bottom" : "top";
        next[edge] = Math.round(
          Math.min(
            95 - visibleCrop[paired],
            Math.max(0, edge === "left" || edge === "top" ? position : 100 - position),
          ),
        );
        return next;
      });
    };
    updateFromPointer(event);
    handle.onpointermove = (moveEvent) => updateFromPointer(moveEvent as unknown as ReactPointerEvent<HTMLDivElement>);
    handle.onpointerup = () => {
      handle.onpointermove = null;
      handle.onpointerup = null;
    };
  };

  const selection = {
    bottom: `${visibleCrop.bottom}%`,
    left: `${visibleCrop.left}%`,
    right: `${visibleCrop.right}%`,
    top: `${visibleCrop.top}%`,
  };
  return (
    <div
      className="relative h-72 touch-none select-none overflow-hidden rounded-sm border border-stone-200 bg-stone-900"
      data-logo-crop-stage
      ref={stageRef}
    >
      <NextImage
        alt="Logo crop preview"
        className="pointer-events-none h-full w-full object-contain"
        height={288}
        src={src}
        width={512}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 bg-stone-950/55"
        style={{ height: `${visibleCrop.top}%` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 bg-stone-950/55"
        style={{ height: `${visibleCrop.bottom}%` }}
      />
      <div
        aria-hidden="true"
        className="absolute left-0 bg-stone-950/55"
        style={{ bottom: `${visibleCrop.bottom}%`, top: `${visibleCrop.top}%`, width: `${visibleCrop.left}%` }}
      />
      <div
        aria-hidden="true"
        className="absolute right-0 bg-stone-950/55"
        style={{ bottom: `${visibleCrop.bottom}%`, top: `${visibleCrop.top}%`, width: `${visibleCrop.right}%` }}
      />
      <div className="absolute border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,.5)]" style={selection}>
        <div className="absolute -left-2 inset-y-0 w-4 cursor-ew-resize" onPointerDown={beginCrop("left")} />
        <div className="absolute -right-2 inset-y-0 w-4 cursor-ew-resize" onPointerDown={beginCrop("right")} />
        <div className="absolute -top-2 inset-x-0 h-4 cursor-ns-resize" onPointerDown={beginCrop("top")} />
        <div className="absolute -bottom-2 inset-x-0 h-4 cursor-ns-resize" onPointerDown={beginCrop("bottom")} />
        <span aria-hidden="true" className="absolute -left-1.5 -top-1.5 size-3 border-2 border-white bg-stone-900" />
        <span aria-hidden="true" className="absolute -right-1.5 -top-1.5 size-3 border-2 border-white bg-stone-900" />
        <span aria-hidden="true" className="absolute -bottom-1.5 -left-1.5 size-3 border-2 border-white bg-stone-900" />
        <span
          aria-hidden="true"
          className="absolute -bottom-1.5 -right-1.5 size-3 border-2 border-white bg-stone-900"
        />
      </div>
    </div>
  );
}

function MainMenuPanel({
  links,
  onChange,
  nested = false,
}: {
  links: MenuLink[];
  onChange: (links: MenuLink[]) => void;
  nested?: boolean;
}) {
  const [editing, setEditing] = useState<MenuLink | null>(null);
  const [deleting, setDeleting] = useState<MenuLink | null>(null);
  const [picker, setPicker] = useState(false);
  const [iconPicker, setIconPicker] = useState(false);
  const [imageEditor, setImageEditor] = useState(false);
  const [imageCrop, setImageCrop] = useState<NonNullable<MenuLink["imageCrop"]>>("1:1");
  const [imageRadius, setImageRadius] = useState<NonNullable<MenuLink["imageRadius"]>>("none");
  const [updatingImage, setUpdatingImage] = useState(false);
  const [imageError, setImageError] = useState("");
  const [createMedia] = useCreateMediaMutation();
  const patch = (index: number, update: Partial<MenuLink>) =>
    onChange(links.map((link, item) => (item === index ? { ...link, ...update } : link)));
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= links.length) return;
    const next = [...links];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((item, position) => ({ ...item, position })));
  };
  const add = () =>
    onChange([
      ...links,
      {
        id: crypto.randomUUID(),
        label: "New menu item",
        url: "/",
        visible: true,
        position: links.length,
        children: [],
      },
    ]);
  const addSub = (index: number) =>
    patch(index, {
      children: [
        ...(links[index].children ?? []),
        {
          id: crypto.randomUUID(),
          label: "New sub-item",
          url: "/",
          visible: true,
          position: links[index].children?.length ?? 0,
          children: [],
        },
      ],
    });
  const saveEdit = () => {
    if (!editing) return;
    const index = links.findIndex((link) => link.id === editing.id);
    if (index >= 0) patch(index, editing);
    setEditing(null);
  };
  const openImageEditor = () => {
    if (!editing?.imageUrl) return;
    setImageCrop(editing.imageCrop ?? "1:1");
    setImageRadius(editing.imageRadius ?? "none");
    setImageError("");
    setImageEditor(true);
  };
  const saveImageEdit = async () => {
    if (!editing?.imageUrl) return;
    setUpdatingImage(true);
    setImageError("");
    try {
      const file = await createMenuItemImageFile(editing.imageUrl, imageCrop, imageRadius);
      const [uploaded] = await uploadFiles("imageUploader", { files: [file] });
      if (!uploaded?.ufsUrl || !uploaded.key) throw new Error("Could not upload the edited image.");
      await createMedia({
        name: file.name,
        url: uploaded.ufsUrl,
        type: "picture",
        uploadPlane: "Uploadthings",
        fileKey: uploaded.key,
      }).unwrap();
      setEditing({ ...editing, imageUrl: uploaded.ufsUrl, imageCrop, imageRadius, showImage: true });
      setImageEditor(false);
    } catch (cause) {
      // Keep the editor open so its existing image and settings can be retried.
      setImageError(cause instanceof Error ? cause.message : "Could not update the menu image.");
    } finally {
      setUpdatingImage(false);
    }
  };
  const deleteItem = () => {
    if (!deleting) return;
    onChange(links.filter((link) => link.id !== deleting.id).map((link, position) => ({ ...link, position })));
    setDeleting(null);
  };
  return (
    <div className={nested ? "ml-5 mt-3 min-w-0 border-l border-stone-200 pl-3" : "grid min-w-0 gap-3"}>
      {!nested ? (
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Main Menu</h2>
          <Button onClick={add} size="sm" type="button" variant="outline">
            Add new item
          </Button>
        </div>
      ) : null}
      {links.map((link, index) => {
        const Icon = link.showIcon && link.icon ? iconMap[link.icon] : null;
        const imageCrop = link.imageCrop ?? "1:1";
        const imageRadius = {
          none: "rounded-none",
          xs: "rounded-xs",
          sm: "rounded-sm",
          md: "rounded-md",
          xl: "rounded-xl",
          "2xl": "rounded-2xl",
          full: "rounded-full",
        }[link.imageRadius ?? "none"];
        const imageFrame = imageCrop === "16:9" ? "h-9 w-16" : "size-9";
        return (
          <div className="min-w-0 rounded-sm border border-stone-200 bg-white" key={link.id}>
            <div className="flex min-w-0 flex-col items-stretch gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`grid shrink-0 place-items-center overflow-hidden bg-amber-50 text-amber-900 ${link.showImage && link.imageUrl ? `${imageFrame} ${imageRadius}` : "size-9 rounded-sm"}`}
                >
                  {link.showImage && link.imageUrl ? (
                    <NextImage
                      alt=""
                      className={`h-full w-full ${imageCrop === "full" ? "object-contain" : "object-cover"}`}
                      height={56}
                      src={link.imageUrl}
                      width={56}
                    />
                  ) : (
                    (Icon ?? "—")
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-stone-800">{link.label}</p>
                  <p className="truncate text-xs text-stone-500">{link.url}</p>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-1">
                <Button
                  aria-label="Move item up"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                  size="icon"
                  title="Move up"
                  type="button"
                  variant="ghost"
                >
                  <ArrowUp className="size-4" />
                </Button>
                <Button
                  aria-label="Move item down"
                  disabled={index === links.length - 1}
                  onClick={() => move(index, 1)}
                  size="icon"
                  title="Move down"
                  type="button"
                  variant="ghost"
                >
                  <ArrowDown className="size-4" />
                </Button>
                <Button
                  aria-label="Edit menu item"
                  onClick={() => setEditing(structuredClone(link))}
                  size="icon"
                  title="Edit"
                  type="button"
                  variant="ghost"
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  aria-label="Add sub-item"
                  onClick={() => addSub(index)}
                  size="icon"
                  title="Add sub-item"
                  type="button"
                  variant="ghost"
                >
                  <Plus className="size-4" />
                </Button>
                <Button
                  aria-label="Delete menu item"
                  onClick={() => setDeleting(link)}
                  size="icon"
                  title="Delete"
                  type="button"
                  variant="ghost"
                >
                  <Trash2 className="size-4 text-red-600" />
                </Button>
              </div>
            </div>
            {link.children?.length ? (
              <MainMenuPanel links={link.children} nested onChange={(children) => patch(index, { children })} />
            ) : null}
          </div>
        );
      })}
      {editing ? (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-stone-950/35 p-4 backdrop-blur-sm">
          <section
            aria-modal="true"
            className="w-full max-w-2xl overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffaf0] shadow-2xl"
            role="dialog"
          >
            <header className="flex items-center justify-between border-b border-[#eadfca] p-5">
              <h2 className="font-semibold text-stone-900">Edit menu item</h2>
              <Button aria-label="Close" onClick={() => setEditing(null)} size="icon" type="button" variant="ghost">
                <X className="size-4" />
              </Button>
            </header>
            <div className="grid max-h-[70vh] gap-4 overflow-y-auto p-5 sm:grid-cols-2">
              <label>
                Name
                <input
                  className={field}
                  onChange={(event) => setEditing({ ...editing, label: event.target.value })}
                  value={editing.label}
                />
              </label>
              <label>
                Path
                <input
                  className={field}
                  onChange={(event) => setEditing({ ...editing, url: event.target.value })}
                  value={editing.url}
                />
              </label>
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between">
                  Display Icon
                  <Switch
                    checked={Boolean(editing.showIcon)}
                    onCheckedChange={(showIcon) => setEditing({ ...editing, showIcon })}
                  />
                </div>
                {editing.showIcon ? (
                  <div className="mt-3 flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-sm border border-stone-200 bg-white text-stone-700">
                      {editing.icon ? iconMap[editing.icon] : "—"}
                    </span>
                    <Button onClick={() => setIconPicker(true)} size="sm" type="button" variant="outline">
                      Choose Icon
                    </Button>
                  </div>
                ) : null}
              </div>
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span>Display Image</span>
                  <Switch
                    checked={Boolean(editing.showImage)}
                    onCheckedChange={(showImage) => setEditing({ ...editing, showImage })}
                  />
                </div>
                {editing.showImage ? (
                  <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-sm border border-stone-200 bg-white">
                        {editing.imageUrl ? (
                          <NextImage
                            alt="Selected menu item"
                            className="h-full w-full object-cover"
                            height={56}
                            src={editing.imageUrl}
                            width={56}
                          />
                        ) : (
                          "No image"
                        )}
                      </div>
                      <span className="truncate text-xs text-stone-500">
                        {editing.imageUrl || "Choose an image from media or upload one."}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => setPicker(true)} size="sm" type="button" variant="outline">
                        Choose/Upload Image
                      </Button>
                      {editing.imageUrl ? (
                        <Button onClick={openImageEditor} size="sm" type="button" variant="outline">
                          Edit
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
              {editing.showImage && editing.imageUrl ? (
                <div className="sm:col-span-2">
                  <span className="text-sm font-medium text-stone-800">Preview image</span>
                  <div className="mt-2 grid min-h-44 place-items-center overflow-hidden rounded-sm border border-[#eadfca] bg-white p-4">
                    <MenuItemImagePreview
                      crop={editing.imageCrop ?? "1:1"}
                      radius={editing.imageRadius ?? "none"}
                      src={editing.imageUrl}
                    />
                  </div>
                </div>
              ) : null}
            </div>
            <footer className="flex justify-end gap-2 border-t border-[#eadfca] p-5">
              <Button onClick={() => setEditing(null)} type="button" variant="outline">
                Cancel
              </Button>
              <Button onClick={saveEdit} type="button">
                Save item
              </Button>
            </footer>
          </section>
        </div>
      ) : null}
      {imageEditor && editing?.imageUrl ? (
        <div className="fixed inset-0 z-[110] grid place-items-center bg-stone-950/35 p-4 backdrop-blur-sm">
          <section
            aria-modal="true"
            className="w-full max-w-xl overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffaf0] shadow-2xl"
            role="dialog"
          >
            <header className="flex items-center justify-between border-b border-[#eadfca] p-5">
              <div>
                <h2 className="font-semibold text-stone-900">Edit image</h2>
                <p className="mt-1 text-xs text-stone-500">
                  Crop and radius are baked into a new Media image when saved.
                </p>
              </div>
              <Button
                aria-label="Close image editor"
                disabled={updatingImage}
                onClick={() => setImageEditor(false)}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X className="size-4" />
              </Button>
            </header>
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              <label>
                Crop image
                <Select
                  onChange={(value) => setImageCrop(value as NonNullable<MenuLink["imageCrop"]>)}
                  options={[
                    ["1:1", "1:1"],
                    ["16:9", "16:9"],
                    ["full", "Full"],
                  ]}
                  value={imageCrop}
                />
              </label>
              <label>
                Border radius
                <Select
                  onChange={(value) => setImageRadius(value as NonNullable<MenuLink["imageRadius"]>)}
                  options={[
                    ["none", "None"],
                    ["xs", "xs"],
                    ["sm", "sm"],
                    ["md", "md"],
                    ["xl", "XL"],
                    ["2xl", "2XL"],
                    ["full", "Full"],
                  ]}
                  value={imageRadius}
                />
              </label>
              <div className="sm:col-span-2">
                <span className="text-sm font-medium text-stone-800">Preview image</span>
                <div className="mt-2 grid min-h-52 place-items-center overflow-hidden rounded-sm border border-[#eadfca] bg-white p-4">
                  <MenuItemImagePreview crop={imageCrop} radius={imageRadius} src={editing.imageUrl} />
                </div>
              </div>
              {imageError ? (
                <p className="sm:col-span-2 rounded-sm bg-red-100 p-3 text-sm text-red-900">{imageError}</p>
              ) : null}
            </div>
            <footer className="flex justify-end gap-2 border-t border-[#eadfca] p-5">
              <Button disabled={updatingImage} onClick={() => setImageEditor(false)} type="button" variant="outline">
                Cancel
              </Button>
              <Button disabled={updatingImage} onClick={() => void saveImageEdit()} type="button">
                {updatingImage ? (
                  <span
                    aria-hidden="true"
                    className="size-4 animate-spin rounded-full border-2 border-amber-100 border-t-amber-700"
                  />
                ) : null}
                {updatingImage ? "Updating image…" : "Update image"}
              </Button>
            </footer>
          </section>
        </div>
      ) : null}
      {iconPicker && editing ? (
        <div className="fixed inset-0 z-[120] grid place-items-center bg-stone-950/35 p-4 backdrop-blur-sm">
          <section
            aria-modal="true"
            className="w-full max-w-3xl overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffaf0] shadow-2xl"
            role="dialog"
          >
            <header className="flex items-center justify-between border-b border-[#eadfca] p-5">
              <h3 className="font-semibold text-stone-900">Choose Icon</h3>
              <Button
                aria-label="Close icon picker"
                onClick={() => setIconPicker(false)}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X className="size-4" />
              </Button>
            </header>
            <div className="grid max-h-[65vh] grid-cols-3 gap-2 overflow-y-auto p-5 sm:grid-cols-5 md:grid-cols-7">
              {iconOptions.map((icon) => (
                <button
                  aria-label={icon}
                  className={`grid min-h-20 place-items-center gap-2 rounded-sm border p-2 text-xs transition ${editing.icon === icon ? "border-amber-500 bg-amber-50 text-amber-950" : "border-stone-200 bg-white text-stone-700 hover:border-amber-300"}`}
                  key={icon}
                  onClick={() => {
                    setEditing({ ...editing, icon, showIcon: true });
                    setIconPicker(false);
                  }}
                  type="button"
                >
                  <span>{iconMap[icon]}</span>
                  <span className="w-full truncate">{icon}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : null}
      {deleting ? (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-stone-950/35 p-4 backdrop-blur-sm">
          <section
            aria-modal="true"
            className="w-full max-w-md rounded-sm border border-[#eadfca] bg-[#fffaf0] p-5 shadow-2xl"
            role="alertdialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-stone-900">Delete menu item?</h2>
                <p className="mt-2 text-sm text-stone-600">
                  “{deleting.label}” and any of its sub-items will be removed.
                </p>
              </div>
              <Button aria-label="Close" onClick={() => setDeleting(null)} size="icon" type="button" variant="ghost">
                <X className="size-4" />
              </Button>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button onClick={() => setDeleting(null)} type="button" variant="outline">
                Cancel
              </Button>
              <Button onClick={deleteItem} type="button" variant="destructive">
                Delete
              </Button>
            </div>
          </section>
        </div>
      ) : null}
      {picker && editing ? (
        <LogoMediaPicker
          close={() => setPicker(false)}
          onSelect={(imageUrl) => {
            setEditing({ ...editing, imageUrl, showImage: true, imageCrop: editing.imageCrop ?? "1:1" });
            setPicker(false);
          }}
        />
      ) : null}
    </div>
  );
}

function NestedMenu({
  links,
  onChange,
  title,
}: {
  links: MenuLink[];
  onChange: (links: MenuLink[]) => void;
  title: string;
}) {
  const add = () =>
    onChange([
      ...links,
      {
        id: crypto.randomUUID(),
        label: "New menu item",
        url: "/",
        visible: true,
        position: links.length,
        children: [],
      },
    ]);
  const patch = (index: number, update: Partial<MenuLink>) =>
    onChange(links.map((link, item) => (item === index ? { ...link, ...update } : link)));
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= links.length) return;
    const next = [...links];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next.map((item, position) => ({ ...item, position })));
  };
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">{title}</h2>
        <Button onClick={add} size="sm" type="button" variant="outline">
          Add new item
        </Button>
      </div>
      {links.map((link, index) => (
        <div className="rounded-sm border border-stone-200 p-3" key={link.id}>
          <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <input
              className={field.replace("mt-1 ", "")}
              value={link.label}
              onChange={(e) => patch(index, { label: e.target.value })}
            />
            <input
              className={field.replace("mt-1 ", "")}
              value={link.url}
              onChange={(e) => patch(index, { url: e.target.value })}
            />
            <div className="flex flex-wrap gap-1">
              <Button onClick={() => move(index, -1)} size="sm" type="button" variant="outline">
                Up
              </Button>
              <Button onClick={() => move(index, 1)} size="sm" type="button" variant="outline">
                Down
              </Button>
              <Button
                onClick={() => patch(index, { visible: !link.visible })}
                size="sm"
                type="button"
                variant="outline"
              >
                {link.visible ? "Hide" : "View"}
              </Button>
              <Button
                onClick={() => onChange(links.filter((_, item) => item !== index))}
                size="sm"
                type="button"
                variant="destructive"
              >
                Delete
              </Button>
            </div>
          </div>
          <div className="mt-3">
            <NestedMenu
              links={link.children ?? []}
              onChange={(children) => patch(index, { children })}
              title="Sub-items"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

const mobileItemDefaults = [
  ["Home", "/", "House"],
  ["Menu", "/menu", "Menu"],
  ["Search", "/search", "Search"],
  ["Cart", "/cart", "ShoppingCart"],
  ["Profile", "/dashboard", "User"],
  ["Contact", "/contact", "Phone"],
  ["Favorites", "/favorites", "Heart"],
  ["Settings", "/settings", "Settings"],
  ["More", "/more", "MoreHorizontal"],
] as const;

const mobileItemCount = (layout: MenuData["mobile"]["layout"]) =>
  layout === "grid-2-2" ? 4 : layout === "grid-2-3" || layout === "grid-3-2" ? 6 : layout === "grid-3-3" ? 9 : 4;

function withMobileDefaults(links: MenuLink[], count: number) {
  return Array.from({ length: count }, (_, position) => {
    const current = links[position];
    if (current) return { ...current, position };
    const [label, url, icon] = mobileItemDefaults[position] ?? [`Item ${position + 1}`, "/", "Circle"];
    return { id: crypto.randomUUID(), label, url, icon, showIcon: true, visible: true, position };
  });
}

function MobileMenuPanel({
  mobile,
  onChange,
}: {
  mobile: MenuData["mobile"];
  onChange: (mobile: MenuData["mobile"]) => void;
}) {
  const [editing, setEditing] = useState<MenuLink | null>(null);
  const [iconPicker, setIconPicker] = useState(false);
  const gridLayouts = [
    ["grid-2-2", "2 × 2"],
    ["grid-2-3", "2 × 3"],
    ["grid-3-2", "3 × 2"],
    ["grid-3-3", "3 × 3"],
  ] as const;
  const changeLayout = (layout: Exclude<MenuData["mobile"]["layout"], "flex">) =>
    onChange({ ...mobile, layout, links: withMobileDefaults(mobile.links, mobileItemCount(layout)) });
  const saveItem = () => {
    if (!editing) return;
    const index = mobile.links.findIndex((item) => item.id === editing.id);
    const links =
      index < 0
        ? [...mobile.links, { ...editing, position: mobile.links.length }]
        : mobile.links.map((item, itemIndex) => (itemIndex === index ? { ...editing, position: itemIndex } : item));
    onChange({ ...mobile, links });
    setEditing(null);
  };
  const removeItem = (id: string) =>
    onChange({
      ...mobile,
      links: mobile.links.filter((item) => item.id !== id).map((item, position) => ({ ...item, position })),
    });
  const previewColumns = mobile.layout === "grid-3-2" || mobile.layout === "grid-3-3" ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-sm border border-stone-200 p-4">
        <h2 className="font-medium">View Style</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(
            [
              ["grid", "Grid View"],
              ["flex", "Flex View"],
            ] as const
          ).map(([view, label]) => {
            const active = view === "flex" ? mobile.layout === "flex" : mobile.layout !== "flex";
            return (
              <button
                className={`rounded-sm border p-3 text-sm font-medium ${active ? "border-amber-500 bg-amber-50 text-amber-950" : "border-stone-200 hover:border-amber-300"}`}
                key={view}
                onClick={() =>
                  onChange({
                    ...mobile,
                    layout: view === "flex" ? "flex" : "grid-2-2",
                    links: withMobileDefaults(mobile.links, view === "flex" ? (mobile.flexItems ?? 4) : 4),
                  })
                }
                type="button"
              >
                {label}
              </button>
            );
          })}
        </div>
      </section>
      {mobile.layout === "flex" ? (
        <section className="rounded-sm border border-stone-200 p-4">
          <h2 className="font-medium">Flex Items</h2>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              Items
              <Select
                onChange={(value) =>
                  onChange({
                    ...mobile,
                    flexItems: Number(value) as 2 | 3 | 4 | 5 | 6,
                    links: withMobileDefaults(mobile.links, Number(value)),
                  })
                }
                options={[
                  [2, "2 items"],
                  [3, "3 items"],
                  [4, "4 items"],
                  [5, "5 items"],
                  [6, "6 items"],
                ]}
                value={mobile.flexItems ?? 4}
              />
            </label>
            <label className="block text-sm">
              Text align
              <Select
                onChange={(flexTextAlign) =>
                  onChange({ ...mobile, flexTextAlign: flexTextAlign as "left" | "center" | "right" })
                }
                options={[
                  ["left", "Left"],
                  ["center", "Center"],
                  ["right", "Right"],
                ]}
                value={mobile.flexTextAlign ?? "center"}
              />
            </label>
          </div>
        </section>
      ) : (
        <section className="rounded-sm border border-stone-200 p-4">
          <h2 className="font-medium">Grid Layout</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {gridLayouts.map(([layout, label]) => (
              <button
                className={`rounded-sm border p-3 text-sm font-medium ${mobile.layout === layout ? "border-amber-500 bg-amber-50 text-amber-950" : "border-stone-200 hover:border-amber-300"}`}
                key={layout}
                onClick={() => changeLayout(layout)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      )}
      <section className="rounded-sm border border-stone-200 p-4 lg:col-span-2">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-medium">Mobile Menu</h2>
            <p className="mt-1 text-xs text-stone-500">Manage the items shown in the selected mobile layout.</p>
          </div>
          <Button
            onClick={() =>
              setEditing({ id: crypto.randomUUID(), label: "", url: "/", icon: "House", showIcon: true, visible: true })
            }
            size="sm"
            type="button"
          >
            <Plus className="size-4" />
            Add
          </Button>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {mobile.links.map((item) => {
            const Icon = item.showIcon && item.icon ? iconMap[item.icon] : null;
            return (
              <div
                className="flex items-center justify-between gap-2 rounded-sm border border-stone-200 p-3"
                key={item.id}
              >
                <div className="flex min-w-0 items-center gap-2">
                  {Icon ? <span>{Icon}</span> : null}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.label || "Untitled item"}</p>
                    <p className="truncate text-xs text-stone-500">{item.url}</p>
                  </div>
                </div>
                <div className="flex">
                  <Button
                    aria-label="Edit mobile item"
                    onClick={() => setEditing(structuredClone(item))}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    aria-label="Delete mobile item"
                    onClick={() => removeItem(item.id)}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <Trash2 className="size-4 text-red-600" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="rounded-sm border border-amber-200 bg-amber-50/40 p-4 lg:col-span-2">
        <h2 className="font-medium text-amber-950">Preview</h2>
        <div className="mx-auto mt-4 max-w-sm overflow-hidden rounded-[2rem] border-8 border-stone-800 bg-white p-3 shadow-lg">
          <p className="mb-3 text-center text-xs font-medium text-stone-500">Mobile layout preview</p>
          <div className={`gap-2 ${mobile.layout === "flex" ? "flex flex-col" : `grid ${previewColumns}`}`}>
            {mobile.links
              .filter((item) => item.visible)
              .slice(0, mobile.layout === "flex" ? (mobile.flexItems ?? 4) : undefined)
              .map((item) => {
                const Icon = item.showIcon && item.icon ? iconMap[item.icon] : null;
                const flexAlign = {
                  left: "justify-start text-left",
                  center: "justify-center text-center",
                  right: "justify-end text-right",
                }[mobile.flexTextAlign ?? "center"];
                return (
                  <div
                    className={`flex min-h-16 rounded-sm bg-amber-50 px-3 text-xs text-amber-950 ${mobile.layout === "flex" ? `flex-row items-center gap-2 ${flexAlign}` : "flex-col items-center justify-center gap-1 text-center"}`}
                    key={item.id}
                  >
                    {Icon ? <span className="shrink-0 text-base">{Icon}</span> : null}
                    <span className="min-w-0 truncate">{item.label || "Item"}</span>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
      {editing ? (
        <div className="fixed inset-0 z-[130] grid place-items-center bg-stone-950/35 p-4 backdrop-blur-sm">
          <section
            aria-modal="true"
            className="w-full max-w-lg overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffaf0] shadow-2xl"
            role="dialog"
          >
            <header className="flex items-center justify-between border-b border-[#eadfca] p-5">
              <h2 className="font-semibold text-stone-900">
                {mobile.links.some((item) => item.id === editing.id) ? "Edit" : "Add"} Mobile Item
              </h2>
              <Button aria-label="Close" onClick={() => setEditing(null)} size="icon" type="button" variant="ghost">
                <X className="size-4" />
              </Button>
            </header>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <label>
                Name
                <input
                  className={field}
                  onChange={(event) => setEditing({ ...editing, label: event.target.value })}
                  value={editing.label}
                />
              </label>
              <label>
                Path
                <input
                  className={field}
                  onChange={(event) => setEditing({ ...editing, url: event.target.value })}
                  value={editing.url}
                />
              </label>
              <div className="sm:col-span-2">
                <span className="text-sm">Icon</span>
                <div className="mt-1 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-sm border border-stone-200 bg-white">
                    {editing.icon ? iconMap[editing.icon] : "—"}
                  </span>
                  <Button onClick={() => setIconPicker(true)} size="sm" type="button" variant="outline">
                    Choose Icon
                  </Button>
                </div>
              </div>
              <label className="flex items-center justify-between sm:col-span-2">
                <span>Hide Icon</span>
                <Switch
                  checked={!editing.showIcon}
                  onCheckedChange={(hideIcon) => setEditing({ ...editing, showIcon: !hideIcon })}
                />
              </label>
            </div>
            <footer className="flex justify-end gap-2 border-t border-[#eadfca] p-5">
              <Button onClick={() => setEditing(null)} type="button" variant="outline">
                Cancel
              </Button>
              <Button disabled={!editing.label.trim()} onClick={saveItem} type="button">
                Save Item
              </Button>
            </footer>
          </section>
        </div>
      ) : null}
      {iconPicker && editing ? (
        <div className="fixed inset-0 z-[140] grid place-items-center bg-stone-950/35 p-4 backdrop-blur-sm">
          <section
            aria-modal="true"
            className="w-full max-w-3xl overflow-hidden rounded-sm border border-[#eadfca] bg-[#fffaf0] shadow-2xl"
            role="dialog"
          >
            <header className="flex items-center justify-between border-b border-[#eadfca] p-5">
              <h2 className="font-semibold">Choose Icon</h2>
              <Button
                aria-label="Close icon picker"
                onClick={() => setIconPicker(false)}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X className="size-4" />
              </Button>
            </header>
            <div className="grid max-h-[65vh] grid-cols-3 gap-2 overflow-y-auto p-5 sm:grid-cols-5 md:grid-cols-7">
              {iconOptions.map((icon) => (
                <button
                  aria-label={icon}
                  className={`grid min-h-20 place-items-center gap-2 rounded-sm border p-2 text-xs ${editing.icon === icon ? "border-amber-500 bg-amber-50" : "border-stone-200 bg-white hover:border-amber-300"}`}
                  key={icon}
                  onClick={() => {
                    setEditing({ ...editing, icon, showIcon: true });
                    setIconPicker(false);
                  }}
                  type="button"
                >
                  <span>{iconMap[icon]}</span>
                  <span className="w-full truncate">{icon}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
