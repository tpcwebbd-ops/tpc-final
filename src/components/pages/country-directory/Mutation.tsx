/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons";
import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import {
  CountryItem,
  defaultDataCountryDirectory,
  defaultLayout,
  getDefaultCountryDescription,
  getFlagImageFromEmoji,
  ICountryDirectoryData,
  CountryDirectoryPayload,
  COUNTRY_DIRECTORY_REGIONS,
  Region,
} from "./data";

export interface CountryDirectoryFormProps {
  data?: ICountryDirectoryData | CountryDirectoryPayload;
  onChange?: (values: CountryDirectoryPayload) => void;
}

const cloneData = (data: ICountryDirectoryData): ICountryDirectoryData => ({
  ...data,
  countries: data.countries.map((country) => ({ ...country })),
});

const normalizeData = (data?: ICountryDirectoryData | CountryDirectoryPayload): CountryDirectoryPayload => {
  if (!data || !Array.isArray(data.countries)) return { ...cloneData(defaultDataCountryDirectory), ...defaultLayout };
  return {
    ...cloneData({
      ...defaultDataCountryDirectory,
      ...data,
      countries: data.countries.map((country, index) => {
        const name = country.name || "New Country";
        const flag = country.flag || "🏳️";
        const region = COUNTRY_DIRECTORY_REGIONS.includes(country.region) ? country.region : "Asia";

        return {
          id: country.id || `country-${index + 1}`,
          name,
          flag,
          flagImage: country.flagImage || getFlagImageFromEmoji(flag),
          region,
          description: country.description || getDefaultCountryDescription(name, region),
        };
      }),
    }),
    ...defaultLayout,
    ...(data || {}),
  };
};

const createCountry = (region: Region): CountryItem => ({
  id: `country-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: "New Country",
  flag: "🏳️",
  flagImage: "",
  region,
  description: getDefaultCountryDescription("New Country", region),
});

const MutationCountryDirectory = ({ data, onChange }: CountryDirectoryFormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload = normalizeData(data);
  const [formData, setFormData] = useState<ICountryDirectoryData>(initialPayload);
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [activeRegion, setActiveRegion] = useState<Region>("Asia");
  const [countryQuery, setCountryQuery] = useState("");
  const [imagePickerCountryId, setImagePickerCountryId] = useState<string | null>(null);

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
    onChangeRef.current?.({ ...formData, paddingX, paddingY });
  }, [formData, paddingX, paddingY]);

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };

  const visibleCountries = useMemo(() => {
    const query = countryQuery.trim().toLowerCase();
    return formData.countries.filter(
      (country) => country.region === activeRegion && (!query || country.name.toLowerCase().includes(query)),
    );
  }, [activeRegion, countryQuery, formData.countries]);

  const updateField = (
    field: "pageName" | "searchPlaceholder" | "viewAllLabel" | "sectionTitlePrefix" | "emptyMessage",
    value: string,
  ) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const updateCountry = (
    id: string,
    field: "name" | "flag" | "flagImage" | "region" | "description",
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      countries: current.countries.map((country) => {
        if (country.id !== id) return country;
        const updated = { ...country, [field]: value } as CountryItem;
        if (field === "flag" && (!country.flagImage || country.flagImage === getFlagImageFromEmoji(country.flag))) {
          updated.flagImage = getFlagImageFromEmoji(value);
        }
        return updated;
      }),
    }));
  };

  const removeCountry = (id: string) => {
    setFormData((current) => ({ ...current, countries: current.countries.filter((country) => country.id !== id) }));
  };

  const addCountry = () => {
    setFormData((current) => ({ ...current, countries: [...current.countries, createCountry(activeRegion)] }));
    setCountryQuery("");
  };

  return (
    <div className="custom-parent-border bg-white text-stone-800">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-sm border-x border-[#eadfca] bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-[#eadfca] p-4">
          <div className="rounded-sm bg-amber-100 p-2 text-amber-800">{iconMap.Globe}</div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">Edit Embassy Countries Page</h2>
            <p className="text-sm text-stone-600">Edit country names, flag images, regions, and popup descriptions.</p>
          </div>
        </div>

        <section className="grid gap-4 border-b border-slate-200 bg-slate-50 p-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Page Name</Label>
            <Input
              value={formData.pageName}
              onChange={(event) => updateField("pageName", event.target.value)}
              className="border-slate-200 bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label>Search Placeholder</Label>
            <Input
              value={formData.searchPlaceholder}
              onChange={(event) => updateField("searchPlaceholder", event.target.value)}
              className="border-slate-200 bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label>View All Label</Label>
            <Input
              value={formData.viewAllLabel}
              onChange={(event) => updateField("viewAllLabel", event.target.value)}
              className="border-slate-200 bg-white"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Region Heading Prefix</Label>
            <Input
              value={formData.sectionTitlePrefix}
              onChange={(event) => updateField("sectionTitlePrefix", event.target.value)}
              className="border-slate-200 bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label>Empty Result Message</Label>
            <Input
              value={formData.emptyMessage}
              onChange={(event) => updateField("emptyMessage", event.target.value)}
              className="border-slate-200 bg-white"
            />
          </div>
        </section>

        <section className="grid gap-4 border-b border-cyan-100 bg-cyan-50/60 p-6 md:grid-cols-2">
          {(
            [
              ["paddingX", "Padding X", paddingX],
              ["paddingY", "Padding Y", paddingY],
            ] as const
          ).map(([field, label, value]) => (
            <div key={field} className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Label>{label}</Label>
                <span className="rounded-full bg-cyan-600 px-2.5 py-1 text-xs font-semibold text-white">{value}px</span>
              </div>
              <Slider
                min={-300}
                max={300}
                step={1}
                value={[value]}
                onValueChange={([nextValue]) => updateSpacing(field, nextValue)}
                aria-label={label}
              />
              <div className="flex justify-between text-[11px] font-medium text-slate-500">
                <span>-300px</span>
                <span>0px</span>
                <span>+300px</span>
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900">Countries</h3>
              <p className="mt-1 text-xs text-slate-500">
                {formData.countries.length} countries across {COUNTRY_DIRECTORY_REGIONS.length} regions.
              </p>
            </div>
            <Button type="button" onClick={addCountry} variant="outline" size="sm">
              {iconMap.Plus} Add to {activeRegion}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {COUNTRY_DIRECTORY_REGIONS.map((region) => {
              const count = formData.countries.filter((country) => country.region === region).length;
              return (
                <Button
                  key={region}
                  type="button"
                  size="sm"
                  variant={activeRegion === region ? "default" : "outline"}
                  onClick={() => {
                    setActiveRegion(region);
                    setCountryQuery("");
                  }}
                  className={activeRegion === region ? "bg-blue-700 hover:bg-blue-600" : ""}
                >
                  {region} ({count})
                </Button>
              );
            })}
          </div>

          <div className="relative max-w-sm">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">
              {iconMap.Search}
            </span>
            <Input
              value={countryQuery}
              onChange={(event) => setCountryQuery(event.target.value)}
              placeholder={`Search ${activeRegion}`}
              className="border-slate-200 bg-white pl-9"
            />
          </div>

          <div className="grid gap-3">
            {visibleCountries.map((country) => (
              <div
                key={country.id}
                className="grid gap-3 rounded-sm border border-slate-200 bg-slate-50 p-3 lg:grid-cols-[100px_minmax(0,1fr)_180px_40px]"
              >
                <div className="space-y-2">
                  <Label>Flag</Label>
                  <div className="relative flex h-16 items-center justify-center overflow-hidden rounded-sm border border-slate-200 bg-white">
                    <span className="text-2xl">{country.flag}</span>
                    {country.flagImage && (
                      <Image
                        src={country.flagImage}
                        alt={`${country.name} flag`}
                        className="absolute inset-0 h-full w-full object-cover"
                        fill
                        sizes="256px"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    )}
                  </div>
                  <Input
                    value={country.flag}
                    onChange={(event) => updateCountry(country.id, "flag", event.target.value)}
                    className="border-slate-200 bg-white text-center text-lg"
                  />
                </div>
                <div className="grid content-start gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="space-y-2">
                    <Label>Country Name</Label>
                    <Input
                      value={country.name}
                      onChange={(event) => updateCountry(country.id, "name", event.target.value)}
                      className="border-slate-200 bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Flag image</Label>
                    <Button
                      className="w-full"
                      onClick={() => setImagePickerCountryId(country.id)}
                      type="button"
                      variant="outline"
                    >
                      Edit image
                    </Button>
                  </div>
                  <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                    <Label>Country Popup Description</Label>
                    <textarea
                      value={country.description}
                      onChange={(event) => updateCountry(country.id, "description", event.target.value)}
                      rows={6}
                      className="min-h-36 w-full resize-y rounded-sm border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                      placeholder="Add useful country, embassy, visa, or consular information..."
                    />
                  </div>
                </div>
                <div className="space-y-2 lg:self-start">
                  <Label>Region</Label>
                  <select
                    value={country.region}
                    onChange={(event) => updateCountry(country.id, "region", event.target.value)}
                    className="h-10 w-full rounded-sm border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                  >
                    {COUNTRY_DIRECTORY_REGIONS.map((region) => (
                      <option key={region}>{region}</option>
                    ))}
                  </select>
                </div>
                <Button
                  type="button"
                  onClick={() => removeCountry(country.id)}
                  variant="destructive"
                  size="sm"
                  className="h-10 w-10 p-0 lg:self-start lg:mt-6"
                >
                  {iconMap.Trash2}
                </Button>
              </div>
            ))}
          </div>

          {visibleCountries.length === 0 && (
            <p className="rounded-sm border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              No countries found in this editor view.
            </p>
          )}
        </section>
      </div>
      {imagePickerCountryId ? (
        <ImagePickerModal
          close={() => setImagePickerCountryId(null)}
          description="Select a flag image from media or upload a new one."
          onSelect={(url) => {
            updateCountry(imagePickerCountryId, "flagImage", url);
            setImagePickerCountryId(null);
          }}
          title="Choose country flag image"
          uploadLabel="Upload flag image"
        />
      ) : null}
    </div>
  );
};

export default MutationCountryDirectory;
