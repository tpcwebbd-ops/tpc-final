/*
|-----------------------------------------
| setting up Mutation.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 30 August, 2026
|-----------------------------------------
*/

"use client";

import { MoveHorizontal, Plus, Trash2, UsersRound } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import ImagePickerModal from "@/components/dashboard-ui/ImagePickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  defaultDataPage8,
  defaultLayout,
  defaultTeamMember,
  defaultTeamRow,
  IPage8Data,
  Page8Payload,
  TeamMember,
  TeamRow,
} from "./data";

export interface Page8FormProps {
  data?: IPage8Data | Page8Payload;
  onSubmit: (values: Page8Payload) => void;
}

type ImagePickerTarget = { kind: "ceo" } | { kind: "member"; rowIndex: number; memberIndex: number };

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const normalizeImage = (value: unknown) => (typeof value === "string" && value.trim() ? value : "");

const createEmptyMember = (): TeamMember => ({
  id: createId("member"),
  ...defaultTeamMember,
});

const createEmptyRow = (): TeamRow => ({
  id: createId("row"),
  ...defaultTeamRow,
  members: [createEmptyMember()],
});

const cloneData = (data: IPage8Data): IPage8Data => ({
  ...data,
  ceo: { ...data.ceo, image: normalizeImage(data.ceo.image) },
  rows: data.rows.map((row) => ({
    ...row,
    showEyebrow: row.showEyebrow ?? true,
    members: row.members.map((member) => ({
      ...member,
      image: normalizeImage(member.image),
    })),
  })),
});

const normalizeData = (data?: IPage8Data | Page8Payload): Page8Payload => {
  if (!data?.ceo || !Array.isArray(data.rows)) return { ...cloneData(defaultDataPage8), ...defaultLayout };
  return {
    ...cloneData({
      ...defaultDataPage8,
      ...data,
      showEyebrow: data.showEyebrow ?? true,
      showFounderLabel: data.showFounderLabel ?? true,
      ceo: { ...defaultDataPage8.ceo, ...data.ceo },
      rows: data.rows.map((row, rowIndex) => ({
        id: row.id || `row-${rowIndex + 1}`,
        label: row.label || `Team Group ${rowIndex + 1}`,
        showEyebrow: row.showEyebrow ?? true,
        members: Array.isArray(row.members)
          ? row.members.map((member, memberIndex) => ({
              ...member,
              id: member.id || `member-${rowIndex + 1}-${memberIndex + 1}`,
              image: normalizeImage(member.image),
            }))
          : [],
      })),
    }),
    ...defaultLayout,
    ...(data || {}),
  };
};

const MutationPage8 = ({ data, onSubmit }: Page8FormProps) => {
  const onSubmitRef = useRef(onSubmit);
  const initialPayload = normalizeData(data);
  const [formData, setFormData] = useState<IPage8Data>(initialPayload);
  const [paddingX, setPaddingX] = useState(initialPayload.paddingX);
  const [paddingY, setPaddingY] = useState(initialPayload.paddingY);
  const [imagePickerTarget, setImagePickerTarget] = useState<ImagePickerTarget | null>(null);

  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  useEffect(() => {
    const nextData = normalizeData(data);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((current) => (JSON.stringify(current) === JSON.stringify(nextData) ? current : nextData));
    setPaddingX((current) => (current === nextData.paddingX ? current : nextData.paddingX));
    setPaddingY((current) => (current === nextData.paddingY ? current : nextData.paddingY));
  }, [data]);

  useEffect(() => {
    onSubmitRef.current({ ...formData, paddingX, paddingY });
  }, [formData, paddingX, paddingY]);

  const updateSpacing = (field: "paddingX" | "paddingY", value: number) => {
    const nextValue = Math.min(300, Math.max(-300, value));
    if (field === "paddingX") setPaddingX(nextValue);
    else setPaddingY(nextValue);
  };

  const updateField = (field: "pageName" | "eyebrow" | "title" | "description" | "founderLabel", value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const updateVisibility = (field: "showEyebrow" | "showFounderLabel", value: boolean) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const updateCeo = (field: keyof TeamMember, value: string) => {
    setFormData((current) => ({ ...current, ceo: { ...current.ceo, [field]: value } }));
  };

  const updateRowLabel = (rowIndex: number, value: string) => {
    setFormData((current) => ({
      ...current,
      rows: current.rows.map((row, index) => (index === rowIndex ? { ...row, label: value } : row)),
    }));
  };

  const updateRowVisibility = (rowIndex: number, value: boolean) => {
    setFormData((current) => ({
      ...current,
      rows: current.rows.map((row, index) => (index === rowIndex ? { ...row, showEyebrow: value } : row)),
    }));
  };

  const updateMember = (rowIndex: number, memberIndex: number, field: keyof TeamMember, value: string) => {
    setFormData((current) => ({
      ...current,
      rows: current.rows.map((row, index) =>
        index === rowIndex
          ? {
              ...row,
              members: row.members.map((member, position) =>
                position === memberIndex ? { ...member, [field]: value } : member,
              ),
            }
          : row,
      ),
    }));
  };

  const addRow = () => setFormData((current) => ({ ...current, rows: [...current.rows, createEmptyRow()] }));

  const removeRow = (rowIndex: number) => {
    setFormData((current) => ({ ...current, rows: current.rows.filter((_, index) => index !== rowIndex) }));
  };

  const addMember = (rowIndex: number) => {
    setFormData((current) => ({
      ...current,
      rows: current.rows.map((row, index) =>
        index === rowIndex ? { ...row, members: [...row.members, createEmptyMember()] } : row,
      ),
    }));
  };

  const removeMember = (rowIndex: number, memberIndex: number) => {
    setFormData((current) => ({
      ...current,
      rows: current.rows.map((row, index) =>
        index === rowIndex ? { ...row, members: row.members.filter((_, position) => position !== memberIndex) } : row,
      ),
    }));
  };

  const selectImage = (url: string) => {
    if (!imagePickerTarget) return;
    if (imagePickerTarget.kind === "ceo") updateCeo("image", url);
    else updateMember(imagePickerTarget.rowIndex, imagePickerTarget.memberIndex, "image", url);
    setImagePickerTarget(null);
  };

  const memberFields = (
    member: TeamMember,
    onChange: (field: keyof TeamMember, value: string) => void,
    onChooseImage: () => void,
  ) => (
    <div className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={member.name}
            onChange={(event) => onChange("name", event.target.value)}
            className="border-stone-200 bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label>Role / Title</Label>
          <Input
            value={member.title}
            onChange={(event) => onChange("title", event.target.value)}
            className="border-stone-200 bg-white"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Image</Label>
        <div className="flex flex-col gap-3 rounded-sm border border-stone-200 bg-white p-3 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-sm bg-stone-100">
            {member.image ? (
              <Image alt={`${member.name} preview`} className="object-cover" fill sizes="96px" src={member.image} />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs text-stone-500">No image</span>
            )}
          </div>
          <Button type="button" onClick={onChooseImage} variant="outline" size="sm">
            Edit image
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Biography</Label>
        <Textarea
          value={member.bio}
          onChange={(event) => onChange("bio", event.target.value)}
          className="min-h-28 resize-none border-stone-200 bg-white"
        />
      </div>
    </div>
  );

  return (
    <div className="custom-parent-border bg-[#fffaf0] text-stone-800">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-sm border-x border-[#eadfca] bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-[#eadfca] p-4">
          <div className="rounded-sm bg-amber-100 p-2 text-amber-800">
            <UsersRound size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">Edit Team Page</h2>
            <p className="text-sm text-stone-600">
              Edit the page introduction, founder profile, team groups, and every team member.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-4 rounded-sm border border-stone-200 bg-stone-50 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-600">Page Header</h3>
              <label className="flex items-center gap-2 text-xs text-stone-600">
                <Switch
                  checked={formData.showEyebrow ?? true}
                  onCheckedChange={(value) => updateVisibility("showEyebrow", value)}
                />{" "}
                Show eyebrow
              </label>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Page Name</Label>
                  <Input
                    value={formData.pageName}
                    onChange={(event) => updateField("pageName", event.target.value)}
                    className="border-stone-200 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Site Name</Label>
                  <Input
                    value={formData.eyebrow}
                    onChange={(event) => updateField("eyebrow", event.target.value)}
                    className="border-stone-200 bg-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  className="border-stone-200 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  className="min-h-28 resize-none border-stone-200 bg-white"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-sm border border-amber-200 bg-amber-50/60 p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-amber-800">Founder Profile</h3>
              <div className="flex items-center gap-3">
                <Input
                  aria-label="Founder badge label"
                  value={formData.founderLabel}
                  onChange={(event) => updateField("founderLabel", event.target.value)}
                  className="h-9 max-w-32 border-stone-200 bg-white"
                />
                <label className="flex items-center gap-2 text-xs text-stone-600">
                  <Switch
                    checked={formData.showFounderLabel ?? true}
                    onCheckedChange={(value) => updateVisibility("showFounderLabel", value)}
                  />{" "}
                  Show label
                </label>
              </div>
            </div>
            {memberFields(formData.ceo, updateCeo, () => setImagePickerTarget({ kind: "ceo" }))}
          </section>
        </div>

        <section className="mx-6 mb-6 space-y-4 rounded-sm border border-cyan-100 bg-cyan-50/60 p-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-cyan-800">
            <MoveHorizontal size={16} /> Section spacing
          </h3>
          {(
            [
              ["paddingX", "Padding X", paddingX],
              ["paddingY", "Padding Y", paddingY],
            ] as const
          ).map(([field, label, value]) => (
            <div key={field} className="space-y-2">
              <div className="flex items-center justify-between">
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
              <div className="flex justify-between text-[11px] text-stone-500">
                <span>-300px</span>
                <span>0px</span>
                <span>+300px</span>
              </div>
            </div>
          ))}
        </section>

        <div className="space-y-5 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-700">Team Groups</h3>
              <p className="mt-1 text-xs text-stone-500">
                Each group becomes one labeled row with generous spacing in the public team layout.
              </p>
            </div>
            <Button type="button" onClick={addRow} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Group
            </Button>
          </div>

          {formData.rows.map((row, rowIndex) => (
            <section key={row.id} className="space-y-4 rounded-sm border border-stone-200 bg-stone-50 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex-1 space-y-2">
                  <Label>Group Label</Label>
                  <Input
                    value={row.label}
                    onChange={(event) => updateRowLabel(rowIndex, event.target.value)}
                    className="border-stone-200 bg-white"
                  />
                </div>
                <label className="mt-6 flex items-center gap-2 text-xs text-stone-600">
                  <Switch
                    checked={row.showEyebrow ?? true}
                    onCheckedChange={(value) => updateRowVisibility(rowIndex, value)}
                  />{" "}
                  Show eyebrow
                </label>
                <Button
                  type="button"
                  onClick={() => removeRow(rowIndex)}
                  variant="destructive"
                  size="sm"
                  className="mt-6 h-9 w-9 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {row.members.map((member, memberIndex) => (
                  <div key={member.id} className="space-y-3 rounded-sm border border-stone-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-stone-700">Member {memberIndex + 1}</p>
                      <Button
                        type="button"
                        onClick={() => removeMember(rowIndex, memberIndex)}
                        variant="destructive"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {memberFields(
                      member,
                      (field, value) => updateMember(rowIndex, memberIndex, field, value),
                      () => setImagePickerTarget({ kind: "member", rowIndex, memberIndex }),
                    )}
                  </div>
                ))}
              </div>

              <Button type="button" onClick={() => addMember(rowIndex)} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Member
              </Button>
            </section>
          ))}
        </div>
      </div>
      {imagePickerTarget ? (
        <ImagePickerModal
          close={() => setImagePickerTarget(null)}
          description="Select a team photo from media or upload a new one."
          onSelect={selectImage}
          title="Choose team member image"
          uploadLabel="Upload team image"
        />
      ) : null}
    </div>
  );
};

export default MutationPage8;
