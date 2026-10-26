/*
|-----------------------------------------
| setting up Leads create and edit dialog
| @author: Codex
|-----------------------------------------
*/

"use client";

import { useState, type FormEvent } from "react";

import { Icon } from "@/components/all-icons/all-icons";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/global-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { parseLeadInput, type LeadItem, type LeadKind } from "@/lib/dashboard/leads";
import { useMutateLeadsMutation } from "@/redux/features/dashboard/leads/leadsSlice";

import { leadInput } from "./presentation";
import { Action, errorMessage, LeadsModal, LeadSelect, RecordSelect } from "./ui";

export default function Mutation({
  kind,
  mine,
  item,
  onClose,
}: {
  kind: LeadKind;
  mine: boolean;
  item?: LeadItem;
  onClose: () => void;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [mobile, setMobile] = useState(item && item.kind !== "funnels" ? item.mobile : "");
  const [email, setEmail] = useState(item && item.kind !== "funnels" ? item.email : "");
  const [status, setStatus] = useState(item?.status ?? "active");
  const [description, setDescription] = useState(item?.kind === "funnels" ? item.description : "");
  const [position, setPosition] = useState(item?.kind === "funnels" ? String(item.position) : "1");
  const [funnelId, setFunnelId] = useState(item?.kind === "customers" ? item.funnelId : "");
  const [blocked, setBlocked] = useState(item?.kind === "customers" ? item.blocked : false);
  const [save, { isLoading }] = useMutateLeadsMutation();
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const data = parseLeadInput(kind, {
        name,
        status,
        ...(kind === "funnels" ? { position: Number(position), description } : { mobile, email }),
        ...(kind === "customers" ? { funnelId, blocked } : {}),
      });
      await save({ operation: item ? "update" : "create", kind, mine, id: item?.id, data }).unwrap();
      toast.success(item ? "Record updated." : "Record created.");
      onClose();
    } catch (failure) {
      const message = errorMessage(failure);
      setError(message);
      toast.error(message);
    }
  }
  return (
    <LeadsModal
      title={`${item ? "Edit" : "Add"} ${kind === "funnels" ? "funnel" : kind === "councilors" ? "councilor" : "customer"}`}
      busy={isLoading}
      onClose={onClose}
    >
      <form className="custom-parent-border grid gap-5 bg-white p-5" onSubmit={submit}>
        <p className="rounded-sm border border-amber-100 bg-amber-50/60 p-3 text-xs leading-5 text-amber-900/80">
          {item
            ? "Update the details below to keep your records current."
            : "Add the details below to create a new record in your workspace."}
        </p>
        <fieldset className="grid min-w-0 gap-4 sm:grid-cols-2" disabled={isLoading}>
          <label className="grid gap-2 text-xs font-semibold text-slate-600 sm:col-span-2">
            Name
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={160}
              required
              className={leadInput}
              placeholder={kind === "funnels" ? "e.g. Initial conversation" : "Full name"}
              autoComplete="name"
            />
          </label>
          {kind === "funnels" ? (
            <>
              <label className="grid gap-2 text-xs font-semibold text-slate-600 sm:col-span-2">
                Unique position
                <Input
                  type="number"
                  min={1}
                  max={1000000}
                  step={1}
                  value={position}
                  onChange={(event) => setPosition(event.target.value)}
                  required
                  className={leadInput}
                />
              </label>
              <p className="-mt-2 text-xs leading-5 text-slate-500 sm:col-span-2">
                Choose an unused position. Funnels are sorted by this number.
              </p>
              <label className="grid gap-2 text-xs font-semibold text-slate-600 sm:col-span-2">
                Description
                <Textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  maxLength={2000}
                  className="min-h-28 rounded-sm border-[#eadfca] bg-white p-3 text-sm font-normal text-slate-700 focus:border-amber-500 focus:ring-amber-100"
                  placeholder="Describe this stage of the customer journey…"
                />
              </label>
            </>
          ) : (
            <>
              <label className="grid gap-2 text-xs font-semibold text-slate-600">
                Mobile
                <Input
                  type="tel"
                  value={mobile}
                  onChange={(event) => setMobile(event.target.value)}
                  maxLength={32}
                  required
                  className={leadInput}
                  placeholder="e.g. 01712345678"
                  autoComplete="tel"
                />
              </label>
              <label className="grid gap-2 text-xs font-semibold text-slate-600">
                Email{kind === "customers" ? " (optional)" : ""}
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  maxLength={254}
                  required={kind === "councilors"}
                  className={leadInput}
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </label>
            </>
          )}
          {kind === "customers" && (
            <>
              <div className="grid gap-2 text-xs font-semibold text-slate-600 sm:col-span-2">
                Funnel
                <RecordSelect
                  area={mine ? "my-leads" : "customers"}
                  kind="funnels"
                  label="Choose funnel"
                  selectedLabel={item?.kind === "customers" ? item.funnelName : undefined}
                  value={funnelId}
                  onChange={setFunnelId}
                  activeOnly
                  disabled={isLoading}
                />
              </div>
              <label className="flex items-center gap-2.5 rounded-sm border border-[#eadfca] bg-[#fffdf7] p-3 text-xs font-semibold text-slate-600 sm:col-span-2">
                <Checkbox checked={blocked} onCheckedChange={setBlocked} disabled={isLoading} />
                Block customer
              </label>
            </>
          )}
          <div className="grid gap-2 text-xs font-semibold text-slate-600 sm:col-span-2">
            Status
            <LeadSelect
              label="Status"
              value={status}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              onChange={(value) => setStatus(value as "active" | "inactive")}
              disabled={isLoading}
            />
          </div>
          {kind === "councilors" && (
            <p className="rounded-sm border border-sky-100 bg-sky-50 p-3 text-xs leading-5 text-sky-800 sm:col-span-2">
              Use the same email as the councilor&apos;s login, and assign their Councilor role in Admin → Access. A
              contact record does not grant account permissions.
            </p>
          )}
          {kind === "customers" && mine && (
            <p className="rounded-sm border border-rose-100 bg-rose-50 p-3 text-xs leading-5 text-rose-800 sm:col-span-2">
              New customers are automatically assigned to your signed-in account.
            </p>
          )}
        </fieldset>
        {error && (
          <p role="alert" className="rounded-sm border border-red-200 bg-red-50 p-3 text-xs leading-5 text-red-700">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2 border-t border-[#eadfca] pt-4">
          <Action disabled={isLoading} onClick={onClose}>
            Cancel
          </Action>
          <Action tone="save" type="submit" disabled={isLoading}>
            <Icon name={isLoading ? "RefreshCw" : "Check"} className={isLoading ? "animate-spin" : ""} />
            {isLoading ? "Saving…" : "Save"}
          </Action>
        </div>
      </form>
    </LeadsModal>
  );
}
