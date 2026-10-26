/*
|-----------------------------------------
| setting up role-description.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 26 September, 2026
|-----------------------------------------
*/

import "server-only";

import sanitizeHtml from "sanitize-html";

const roleDescriptionOptions: sanitizeHtml.IOptions = {
  allowedTags: ["b", "strong", "i", "em", "u", "br", "p", "div", "ul", "ol", "li"],
  allowedAttributes: {},
  disallowedTagsMode: "discard",
};

export function sanitizeRoleDescription(value: unknown) {
  return sanitizeHtml(typeof value === "string" ? value : "", roleDescriptionOptions);
}
