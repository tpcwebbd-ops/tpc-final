/*
|-----------------------------------------
| setting up FormIndex.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 19 August, 2026
|-----------------------------------------
*/

import type { ComponentType } from "react";

import { defaultData as one } from "./form-1/data";
import FormOne from "./form-1/FormField";
import M1 from "./form-1/Mutation";
import P1 from "./form-1/Preview";
import { defaultData as two } from "./form-2/data";
import FormTwo from "./form-2/FormField";
import M2 from "./form-2/Mutation";
import P2 from "./form-2/Preview";
import { defaultData as three } from "./form-3/data";
import FormThree from "./form-3/FormField";
import M3 from "./form-3/Mutation";
import P3 from "./form-3/Preview";

export type FormVariant = "form-1" | "form-2" | "form-3";
export type FormData = Record<string, string>;
type Definition = {
  defaultData: FormData;
  title: string;
  description: string;
  FormField: ComponentType<{ data?: FormData; onSubmit?: (values: FormData) => Promise<void> }>;
  Preview: ComponentType<{ data?: FormData }>;
  Mutation: ComponentType<{ data?: FormData; onChange: (data: FormData) => void }>;
};

export const formIndex: Record<FormVariant, Definition> = {
  "form-1": {
    defaultData: one,
    title: "Contact form",
    description: "Name, email, phone number, and message submission",
    FormField: FormOne,
    Preview: P1,
    Mutation: M1,
  },
  "form-2": {
    defaultData: two,
    title: "Callback form",
    description: "Name, email, phone number, education, address, and message request",
    FormField: FormTwo,
    Preview: P2,
    Mutation: M2,
  },
  "form-3": {
    defaultData: three,
    title: "Contact details form",
    description: "Contact information, map, and a message form",
    FormField: FormThree,
    Preview: P3,
    Mutation: M3,
  },
};
export const formAssets = Object.entries(formIndex).map(([variant, form]) => ({
  variant: variant as FormVariant,
  ...form,
}));
export const getFormDefinition = (variant: string) => formIndex[variant as FormVariant];
export const hydrateFormData = (variant: string, data: Record<string, unknown>): FormData | null => {
  const definition = getFormDefinition(variant);
  return definition ? ({ ...definition.defaultData, ...data } as FormData) : null;
};
export const formChoices = formAssets.map(({ variant, title, description }) => ({
  variant,
  label: `${title} · ${description}`,
}));
export const formDefaults = (kind: FormVariant) => ({ ...formIndex[kind].defaultData });

export function FormQuery({
  kind,
  data,
  onSubmit,
}: {
  kind: FormVariant;
  data: FormData;
  onSubmit?: (values: FormData) => Promise<void>;
}) {
  const FormField = getFormDefinition(kind)?.FormField;
  return FormField ? <FormField data={hydrateFormData(kind, data) ?? data} onSubmit={onSubmit} /> : null;
}

export function FormPreview({ kind, data }: { kind: FormVariant; data: FormData }) {
  const Preview = getFormDefinition(kind)?.Preview;
  return Preview ? <Preview data={hydrateFormData(kind, data) ?? data} /> : null;
}

export function FormMutation({
  kind,
  data,
  onChange,
}: {
  kind: FormVariant;
  data: FormData;
  onChange: (data: FormData) => void;
}) {
  const Mutation = getFormDefinition(kind)?.Mutation;
  return Mutation ? <Mutation data={hydrateFormData(kind, data) ?? data} onChange={onChange} /> : null;
}
