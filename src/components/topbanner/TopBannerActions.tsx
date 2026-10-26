/*
|-----------------------------------------
| setting up TopBannerActions.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

import { authClient } from "@/app/api/lib/auth-client";
import { useConfirmDelete } from "@/components/confirm-delete-provider";
import { Button } from "@/components/ui/button";
import { useDeleteTopBannerMutation } from "@/redux/features/dashboard/topbanner/topBannerSlice";

export default function TopBannerActions() {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const confirmDelete = useConfirmDelete();
  const router = useRouter();
  const [deleteBanner, { isLoading }] = useDeleteTopBannerMutation();
  if (!session || pathname !== "/") return null;
  return (
    <div className="flex justify-end gap-2 border-t border-amber-900/10 bg-white/70 px-3 py-2">
      <Button
        className="cursor-pointer transition duration-700"
        onClick={() => router.push("/dashboard/admin/topbanner")}
        size="sm"
        variant="outline"
      >
        Edit
      </Button>
      <Button
        className="cursor-pointer transition duration-700"
        disabled={isLoading}
        onClick={async () => {
          if (!(await confirmDelete("Delete the top banner from the home page?"))) return;
          await deleteBanner().unwrap();
          router.refresh();
        }}
        size="sm"
        variant="destructive"
      >
        {isLoading ? "Deleting…" : "Delete"}
      </Button>
    </div>
  );
}
