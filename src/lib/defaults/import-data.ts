/*
|-----------------------------------------
| setting up defaults.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
|-----------------------------------------
*/

export type ImportPageVariant =
  | "all-home"
  | "all-about-us"
  | "all-contact-us"
  | "all-frequently-ask-questions"
  | "all-privacy"
  | "all-refund"
  | "all-team-member"
  | "all-terms"
  | "security"
  | "cookie-policy";
export type ImportSidebarDefault = { name: string; url: string; icon: string; children?: ImportSidebarDefault[] };
export type ImportPageDefault = { title: string; path: string; description: string; variant: ImportPageVariant };

export const sidebarDefaults: ImportSidebarDefault[] = [
  {
    name: "Developer",
    url: "/dashboard/developer",
    icon: "Wrench",
    children: [
      { name: "Users", url: "/dashboard/developer/users", icon: "Users" },
      { name: "Account", url: "/dashboard/developer/account", icon: "CreditCard" },
      { name: "Session", url: "/dashboard/developer/session", icon: "Lock" },
      { name: "Verification", url: "/dashboard/developer/verification", icon: "ShieldCheck" },
      { name: "Sidebar", url: "/dashboard/developer/sidebar", icon: "Menu" },
      { name: "Navigation", url: "/dashboard/developer/navigation", icon: "Navigation" },
    ],
  },
  {
    name: "Admin",
    url: "/dashboard/admin",
    icon: "Settings",
    children: [
      { name: "Access", url: "/dashboard/admin/access", icon: "Lock" },
      { name: "Users", url: "/dashboard/admin/users", icon: "Users" },
      { name: "Role", url: "/dashboard/admin/role", icon: "ShieldCheck" },
      { name: "Footer", url: "/dashboard/admin/footer", icon: "FileText" },
      { name: "Menu", url: "/dashboard/admin/menu", icon: "Menu" },
      { name: "Pages", url: "/dashboard/admin/pages", icon: "FileText" },
      { name: "SEO Settings", url: "/dashboard/admin/seo", icon: "Search" },
      { name: "Top Banner", url: "/dashboard/admin/topbanner", icon: "FileBadge" },
      { name: "Build", url: "/dashboard/admin/build", icon: "BiSolidHourglassBottom" },
      { name: "Tracking", url: "/dashboard/admin/tracking", icon: "Activity" },
      { name: "WhatsApp", url: "/dashboard/admin/whatsapp", icon: "MessageCircle" },
    ],
  },
  {
    name: "Leads",
    url: "/dashboard/leads",
    icon: "Users",
    children: [
      { name: "Overview", url: "/dashboard/leads/overview", icon: "BarChart" },
      { name: "Funnels", url: "/dashboard/leads/funnels", icon: "Filter" },
      { name: "Customers", url: "/dashboard/leads/customers", icon: "Users" },
      { name: "Councilors", url: "/dashboard/leads/councilors", icon: "User" },
      { name: "My Leads", url: "/dashboard/leads/my-leads", icon: "FileText" },
    ],
  },
  { name: "Media", url: "/dashboard/media", icon: "Image" },
  { name: "Profile", url: "/dashboard/profile", icon: "User" },
  { name: "Products", url: "/dashboard/products", icon: "Package" },
  { name: "Category", url: "/dashboard/category", icon: "ShoppingCart" },
  { name: "Orders", url: "/dashboard/orders", icon: "FileText" },
  { name: "Coupons", url: "/dashboard/coupon", icon: "Tag" },
  { name: "Install", url: "/dashboard/install", icon: "Download" },
];
export const pageDefaults: ImportPageDefault[] = [
  { title: "Home", path: "/", description: "A flexible home page.", variant: "all-home" },
  { title: "About us", path: "/about-us", description: "Learn about our team and purpose.", variant: "all-about-us" },
  {
    title: "Contact us",
    path: "/contact-us",
    description: "Contact details, map, and message form.",
    variant: "all-contact-us",
  },
  {
    title: "Frequently Asked Questions",
    path: "/frequently-ask-questions",
    description: "Answers to frequently asked questions.",
    variant: "all-frequently-ask-questions",
  },
  { title: "Privacy Policy", path: "/privacy-policy", description: "Our privacy policy.", variant: "all-privacy" },
  { title: "Refund Policy", path: "/refund-policy", description: "Our refund policy.", variant: "all-refund" },
  {
    title: "Security",
    path: "/security",
    description: "How we protect our website and services.",
    variant: "security",
  },
  {
    title: "Cookie Policy",
    path: "/cookie-policy",
    description: "How we use cookies and your choices.",
    variant: "cookie-policy",
  },
  {
    title: "Team Members",
    path: "/team-member",
    description: "Meet the people behind NexaMart.",
    variant: "all-team-member",
  },
  {
    title: "Terms and Conditions",
    path: "/terms-and-condition",
    description: "Our terms and conditions.",
    variant: "all-terms",
  },
];
