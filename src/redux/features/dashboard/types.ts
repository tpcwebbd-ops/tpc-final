/*
|-----------------------------------------
| setting up dashboard types for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August, 2026
|-----------------------------------------
*/

export type Permission = { read: boolean; create: boolean; update: boolean; delete: boolean };
export type SidebarItem = {
  id: string;
  name: string;
  url: string;
  icon: string;
  parentId: string | null;
  position: number;
};
export type RoleItem = {
  id: string;
  name: string;
  responsible: string;
  icon: string;
  position: number;
  permissions: Record<string, Permission>;
};
export type AccessItem = {
  roleMissing?: boolean;
  suggestedRoleName?: string | null;
  id: string;
  email: string;
  roleId: string;
  roleName: string;
  blocked: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};
export type MediaItem = {
  id: string;
  name: string;
  author: string;
  url: string;
  uploadPlane: "imageBB" | "Youtube" | "Uploadthings";
  type: "picture" | "video" | "audio" | "zip" | "doc" | "pdf" | "txt";
  fileKey?: string;
  createdAt: string;
};
