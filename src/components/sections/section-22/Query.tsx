/*
|-----------------------------------------
| setting up Query for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import { defaultDataSection22, Section22Payload, Section22Props } from "./data";

const QuerySection22 = ({ data }: Section22Props) => {
  let finalData = { ...defaultDataSection22, ...(typeof data === "object" ? data : {}) };
  let paddingX = 0;
  let paddingY = 0;
  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data) as Partial<Section22Payload>;
      finalData = { ...defaultDataSection22, ...parsed };
      paddingX = Math.max(0, Number(parsed.paddingX) || 0);
      paddingY = Math.max(0, Number(parsed.paddingY) || 0);
    } catch (error) {
      console.error("Error parsing section-22 data:", error);
    }
  }
  if (data && typeof data === "object") {
    if ("paddingX" in data) paddingX = Math.max(0, Number(data.paddingX) || 0);
    if ("paddingY" in data) paddingY = Math.max(0, Number(data.paddingY) || 0);
  }
  const { height, width, background, display } = finalData;

  return (
    <div
      style={{ paddingInline: `${paddingX}px`, paddingBlock: `${paddingY}px` }}
      className="mx-auto w-full max-w-7xl rounded-sm bg-white custom-parent-border"
    >
      <div
        className={`
          ${height}
          ${width}
          ${background === "transparent" ? "bg-transparent" : background}
          ${display}
        `}
      />
    </div>
  );
};

export default QuerySection22;
