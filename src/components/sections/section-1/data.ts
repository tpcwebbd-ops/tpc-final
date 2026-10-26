/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 22 August, 2026
|-----------------------------------------
*/

export type RichTextData = Record<"content" | "paddingX" | "paddingY", string>;

export const defaultDataSection1: RichTextData & { id: string } = {
  id: "section-uid-1",
  paddingX: "0",
  paddingY: "0",
  content: JSON.stringify({
    root: {
      children: [
        {
          children: [
            { detail: 0, format: 0, mode: "normal", style: "", text: "Rich Text Editor", type: "text", version: 1 },
          ],
          direction: null,
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
        },
      ],
      direction: null,
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  }),
};

export type Section1Data = typeof defaultDataSection1;
