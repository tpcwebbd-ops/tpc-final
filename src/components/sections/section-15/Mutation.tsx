/*
|-----------------------------------------
| setting up Mutation for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

import { iconMap } from "@/components/all-icons/all-icons-jsx";
import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { OfficeLocation, Section15Payload, defaultDataSection15, defaultLayout } from "./data";
import QuerySection15 from "./Query";

const iconComponent = (icon: keyof typeof iconMap) => {
  const IconComponent = iconMap[icon];
  const Icon = (props: { className?: string; size?: number }) => <IconComponent {...props} />;
  Icon.displayName = `SectionIcon(${icon})`;
  return Icon;
};
const MapPin = iconComponent("MapPin");
const Plus = iconComponent("Plus");
const Trash2 = iconComponent("Trash2");
const Edit3 = iconComponent("Edit2");
const Eye = iconComponent("Eye");
const Phone = iconComponent("Phone");
const Mail = iconComponent("Mail");
const User = iconComponent("User");
const Clock = iconComponent("Clock");
const Layers = iconComponent("FolderKanban");
const X = iconComponent("X");
const Crosshair = iconComponent("Target");

export interface Section15FormProps {
  data?: OfficeLocation[] | Section15Payload;
  onChange?: (values: OfficeLocation[] | Section15Payload) => void;
}

const MutationSection15 = ({ data, onChange }: Section15FormProps) => {
  const onChangeRef = useRef(onChange);
  const initialPayload = Array.isArray(data) ? { ...defaultLayout, locations: data } : data;
  const [locations, setLocations] = useState<OfficeLocation[]>(() =>
    initialPayload?.locations?.length ? initialPayload.locations : defaultDataSection15,
  );
  const [paddingX, setPaddingX] = useState(initialPayload?.paddingX ?? defaultLayout.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload?.paddingY ?? defaultLayout.paddingY);
  const [activeId, setActiveId] = useState<string>(
    () => initialPayload?.locations?.[0]?.id || defaultDataSection15[0].id,
  );
  const [newFeature, setNewFeature] = useState("");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.({ locations, paddingX, paddingY });
  }, [locations, paddingX, paddingY]);

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };

  const activeLocation = locations.find((l) => l.id === activeId) || locations[0];
  const activeIndex = locations.findIndex((l) => l.id === activeId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateField = (field: keyof OfficeLocation, value: any) => {
    const updated = [...locations];
    updated[activeIndex] = { ...updated[activeIndex], [field]: value };
    setLocations(updated);
  };

  const updateContact = (field: keyof OfficeLocation["contact"], value: string) => {
    const updated = [...locations];
    updated[activeIndex] = {
      ...updated[activeIndex],
      contact: { ...updated[activeIndex].contact, [field]: value },
    };
    setLocations(updated);
  };

  const updateCoords = (field: "lat" | "lng", value: string) => {
    const numValue = parseFloat(value);
    const updated = [...locations];
    updated[activeIndex] = {
      ...updated[activeIndex],
      coordinates: { ...updated[activeIndex].coordinates, [field]: isNaN(numValue) ? 0 : numValue },
    };
    setLocations(updated);
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    const updated = [...locations];
    updated[activeIndex] = {
      ...updated[activeIndex],
      features: [...updated[activeIndex].features, newFeature.trim()],
    };
    setLocations(updated);
    setNewFeature("");
  };

  const removeFeature = (featureIndex: number) => {
    const updated = [...locations];
    const newFeatures = updated[activeIndex].features.filter((_, i) => i !== featureIndex);
    updated[activeIndex] = { ...updated[activeIndex], features: newFeatures };
    setLocations(updated);
  };

  const handleAddLocation = () => {
    const newLoc: OfficeLocation = {
      sectionUid: "section-uid-15",
      id: `loc-${Date.now()}`,
      name: "New Location",
      type: "Headquarters",
      address: "Address Line",
      city: "City",
      country: "Country",
      coordinates: { lat: 0, lng: 0 },
      contact: { email: "", phone: "", manager: "" },
      image: "",
      description: "Location description...",
      features: [],
      schedule: "Mon-Fri, 9am - 5pm",
    };
    setLocations([...locations, newLoc]);
    setActiveId(newLoc.id);
  };

  const handleDeleteLocation = (id: string) => {
    if (locations.length <= 1) return;
    const filtered = locations.filter((l) => l.id !== id);
    setLocations(filtered);
    if (activeId === id) setActiveId(filtered[0].id);
  };

  if (!activeLocation) return <div className="bg-white p-8 text-slate-700">Loading editor...</div>;

  return (
    <div className="custom-parent-border min-h-screen w-full max-w-7xl mx-auto bg-white text-stone-800 font-sans pb-32 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute left-[-5%] top-[-10%] h-[40vw] w-[40vw] rounded-full bg-blue-100/60 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[40vw] w-[40vw] rounded-full bg-indigo-100/60 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        <div className="grid gap-4 rounded-sm border border-[#eadfca] bg-slate-50 p-4">
          <div className="border-l-2 border-amber-300 pl-4">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Layout spacing</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Adjust the horizontal and vertical breathing room for the public locations section.
            </p>
          </div>
          <div className="grid gap-4">
            {(["paddingX", "paddingY"] as const).map((field) => {
              const value = field === "paddingX" ? paddingX : paddingY;
              const label = field === "paddingX" ? "Padding X" : "Padding Y";
              return (
                <div className="rounded-sm border border-slate-200 bg-white p-3" key={field}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <Label className="text-sm font-medium text-slate-700">{label}</Label>
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
          <div className="space-y-4">
            <div className="flex h-[calc(100vh-200px)] flex-col gap-3 rounded-sm border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <Button
                onClick={handleAddLocation}
                size="sm"
                className="w-full border border-blue-200 bg-blue-50 text-blue-900 shadow-sm hover:bg-blue-100"
              >
                <Plus size={16} className="mr-2" /> Add Location
              </Button>

              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {locations.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => setActiveId(loc.id)}
                    className={`group relative cursor-pointer rounded-sm border p-3 transition-all ${
                      activeId === loc.id
                        ? "bg-blue-500/10 border-blue-500/50 shadow-md"
                        : "bg-white border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className={`text-sm font-bold ${activeId === loc.id ? "text-blue-700" : "text-slate-700"}`}>
                          {loc.city}
                        </h4>
                        <p className="text-xs text-zinc-500">{loc.name}</p>
                      </div>
                      <Badge variant="outline" className="border-slate-200 bg-slate-50 text-[10px] text-slate-500">
                        {loc.type}
                      </Badge>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLocation(loc.id);
                      }}
                      className="absolute bottom-2 right-2 p-1.5 rounded-full text-zinc-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Tabs defaultValue="edit" className="w-full">
              <div className="flex justify-center md:justify-start mb-6">
                <TabsList className="inline-flex h-auto rounded-sm border border-slate-200 bg-slate-100 p-1">
                  <TabsTrigger
                    value="edit"
                    className="gap-2 rounded-sm px-6 py-2.5 text-slate-500 transition-all data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
                  >
                    <Edit3 size={14} /> Edit Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className="gap-2 rounded-sm px-6 py-2.5 text-slate-500 transition-all data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
                  >
                    <Eye size={14} /> Live Preview
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="edit" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-4 rounded-sm border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <Label className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Location Image</Label>
                    <div className="flex flex-col gap-3 rounded-sm border border-slate-200 bg-white p-3">
                      <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-slate-50">
                        {activeLocation.image ? (
                          <Image
                            alt={activeLocation.name || "Location preview"}
                            className="object-cover"
                            fill
                            src={activeLocation.image}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-500">
                            <MapPin size={30} />
                          </div>
                        )}
                      </div>
                      <Button
                        className="border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100"
                        onClick={() => setMediaPickerOpen(true)}
                        type="button"
                        variant="outline"
                      >
                        Edit image
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-5 rounded-sm border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <div className="space-y-2">
                      <Label className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Internal Name</Label>
                      <Input
                        value={activeLocation.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className="h-10 border-slate-200 bg-white text-slate-800 focus:border-blue-500/50"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label className="text-zinc-500 text-xs uppercase font-bold tracking-wider">City</Label>
                        <Input
                          value={activeLocation.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          className="h-10 border-slate-200 bg-white text-slate-800 focus:border-blue-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Country</Label>
                        <Input
                          value={activeLocation.country}
                          onChange={(e) => updateField("country", e.target.value)}
                          className="h-10 border-slate-200 bg-white text-slate-800 focus:border-blue-500/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-500 text-xs uppercase font-bold tracking-wider">Facility Type</Label>
                      <Select value={activeLocation.type} onValueChange={(val) => updateField("type", val)}>
                        <SelectTrigger className="h-10 border-slate-200 bg-white text-slate-800 focus:border-blue-500/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-slate-200 bg-white">
                          <SelectItem value="Headquarters">Headquarters</SelectItem>
                          <SelectItem value="Research Lab">Research Lab</SelectItem>
                          <SelectItem value="Data Center">Data Center</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-4 rounded-sm border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <h3 className="flex items-center gap-2 border-b border-slate-200 pb-3 text-sm font-bold text-slate-800">
                      <MapPin size={14} className="text-blue-500" /> Location Data
                    </h3>
                    <div className="space-y-2">
                      <Label className="text-zinc-500 text-xs tracking-wider font-bold">Full Address</Label>
                      <Textarea
                        value={activeLocation.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        className="min-h-36 resize-y border-slate-200 bg-white text-xs text-slate-800 focus:border-blue-500/50"
                        rows={6}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="space-y-2">
                        <Label className="text-zinc-500 text-xs flex gap-1 font-mono">
                          <Crosshair size={10} /> LAT
                        </Label>
                        <Input
                          type="number"
                          value={activeLocation.coordinates.lat}
                          onChange={(e) => updateCoords("lat", e.target.value)}
                          className="h-8 border-slate-200 bg-white text-xs font-mono text-slate-800 focus:border-blue-500/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-zinc-500 text-xs flex gap-1 font-mono">
                          <Crosshair size={10} /> LNG
                        </Label>
                        <Input
                          type="number"
                          value={activeLocation.coordinates.lng}
                          onChange={(e) => updateCoords("lng", e.target.value)}
                          className="h-8 border-slate-200 bg-white text-xs font-mono text-slate-800 focus:border-blue-500/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-sm border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <h3 className="flex items-center gap-2 border-b border-slate-200 pb-3 text-sm font-bold text-slate-800">
                      <User size={14} className="text-blue-500" /> Contact Person
                    </h3>
                    <div className="space-y-2">
                      <Label className="text-zinc-500 text-xs tracking-wider font-bold">Manager Name</Label>
                      <Input
                        value={activeLocation.contact.manager}
                        onChange={(e) => updateContact("manager", e.target.value)}
                        className="h-9 border-slate-200 bg-white text-slate-800 focus:border-blue-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-500 text-xs flex gap-1 tracking-wider font-bold">
                        <Mail size={12} /> Email
                      </Label>
                      <Input
                        value={activeLocation.contact.email}
                        onChange={(e) => updateContact("email", e.target.value)}
                        className="h-9 border-slate-200 bg-white text-slate-800 focus:border-blue-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-500 text-xs flex gap-1 tracking-wider font-bold">
                        <Phone size={12} /> Phone
                      </Label>
                      <Input
                        value={activeLocation.contact.phone}
                        onChange={(e) => updateContact("phone", e.target.value)}
                        className="h-9 border-slate-200 bg-white text-slate-800 focus:border-blue-500/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 rounded-sm border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <h3 className="flex items-center gap-2 border-b border-slate-200 pb-3 text-sm font-bold text-slate-800">
                      <Layers size={14} className="text-blue-500" /> Additional Info
                    </h3>
                    <div className="space-y-2">
                      <Label className="text-zinc-500 text-xs flex gap-1 tracking-wider font-bold">
                        <Clock size={12} /> Hours / Schedule
                      </Label>
                      <Input
                        value={activeLocation.schedule}
                        onChange={(e) => updateField("schedule", e.target.value)}
                        className="h-9 border-slate-200 bg-white text-slate-800 focus:border-blue-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-500 text-xs tracking-wider font-bold">Description</Label>
                      <Textarea
                        value={activeLocation.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        className="min-h-36 resize-y border-slate-200 bg-white text-sm text-slate-800 focus:border-blue-500/50"
                        rows={6}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-sm border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3 text-sm font-bold text-slate-800">
                    <Layers size={14} className="text-blue-500" /> Key Features
                  </h3>
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a facility feature (e.g. 'Rooftop Helipad')"
                      className="h-10 max-w-sm border-slate-200 bg-white text-slate-800 focus:border-blue-500/50"
                      onKeyDown={(e) => e.key === "Enter" && addFeature()}
                    />
                    <Button
                      onClick={addFeature}
                      size="icon"
                      className="h-10 w-10 border border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeLocation.features.map((feature, i) => (
                      <Badge
                        key={i}
                        className="flex items-center gap-2 border-blue-200 bg-blue-50 px-3 py-1.5 text-blue-800 transition-colors hover:bg-blue-100"
                      >
                        {feature}
                        <button onClick={() => removeFeature(i)} className="transition-colors hover:text-red-600">
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                    {activeLocation.features.length === 0 && (
                      <span className="text-zinc-500 text-xs italic py-2">No features added yet.</span>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="relative overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm">
                  <QuerySection15 data={JSON.stringify({ locations, paddingX, paddingY })} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {mediaPickerOpen && (
        <ImagePickerModal
          close={() => setMediaPickerOpen(false)}
          description="Select an existing location image or upload a new one."
          onSelect={(url) => {
            updateField("image", url);
            setMediaPickerOpen(false);
          }}
          title="Choose location image"
          uploadLabel="Upload location image"
        />
      )}
    </div>
  );
};

export default MutationSection15;
