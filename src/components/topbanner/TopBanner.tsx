/*
|-----------------------------------------
| setting up TopBanner.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/

import { client } from "@/app/api/lib/auth";

import { hydrateTopBanner, TopBannerPreview } from "./TopBannerIndex";
import TopBannerVisibility from "./TopBannerVisibility";

type SavedBanner = { key: "site"; variant: string; data: Record<string, unknown> };

const TopBanner = async () => {
  const saved = await client.db().collection<SavedBanner>("topbanner").findOne({ key: "site" });
  if (!saved) return null;
  const data = hydrateTopBanner(saved.variant, saved.data);
  if (!data || data.isVisible === false || data.position === "hide") return null;
  return (
    <TopBannerVisibility excludedPaths={data.excludedPaths}>
      <div className="relative z-40">
        <TopBannerPreview data={data} />
      </div>
    </TopBannerVisibility>
  );
};

export default TopBanner;
