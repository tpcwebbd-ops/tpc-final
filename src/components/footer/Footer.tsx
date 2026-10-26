/*
|-----------------------------------------
| setting up Footer.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 16 August 2026
|-----------------------------------------
*/
import { client } from "@/app/api/lib/auth";

import { FooterPreview, hydrateFooter } from "./FooterIndex";
import FooterSignature from "./FooterSignature";
import FooterVisibility from "./FooterVisibility";
type FooterRecord = { key: "site"; variant: string; data: Record<string, unknown> };
export default async function Footer() {
  const saved = await client.db().collection<FooterRecord>("footer").findOne({ key: "site" });
  if (!saved) return null;
  const data = hydrateFooter(saved.variant, saved.data);
  if (!data || !data.isVisible) return null;
  return (
    <>
      <FooterVisibility disabledPaths={data.disabledPaths}>
        <FooterPreview data={data} />
      </FooterVisibility>
      <FooterSignature />
    </>
  );
}
