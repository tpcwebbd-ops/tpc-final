# TestPrep Center Website Content Brief

## 1. Company Information

- Company name: TestPrep Center
- Short name: TPC
- Business description: TestPrep Center is an online education platform in Bangladesh. It provides IELTS preparation, study-abroad guidance, and Kids Spoken English courses.
- Service delivery: Online across Bangladesh
- Mobile number: 01786558855
- WhatsApp number: 01786558855
- Facebook page: https://www.facebook.com/TestPrepCenter.BD/
- TPC Kids Facebook group: https://www.facebook.com/groups/tpckids

### Content rules

- Use TestPrep Center as the full brand name and TPC only where a short name is appropriate.
- Use the confirmed phone and WhatsApp number above in all public contact areas.
- Link the Kids Spoken English programme to the TPC Kids Facebook group where a group link is needed.
- Do not invent an email address, street address, course price, instructor name, approval guarantee, university partnership, or visa outcome.
- Study-abroad and visa content must say that requirements vary and visitors should confirm current information through official sources.

## 2. Pages and Components List to Update

This is the complete public-content inventory. Update the visible copy, images, links, contact details, calls to action, social links, and metadata where relevant. Do not change dashboard, authentication, database, or shared technical UI components merely for branding.

### Site-wide public components

- `src/app/layout.tsx` — site metadata, title, description, and shared layout.
- `src/app/page.tsx` — homepage fallback content.
- `src/app/[...pagePath]/page.tsx` — published CMS page rendering.
- `src/components/whatsapp/WhatsAppButton.tsx` — confirm the Dashboard WhatsApp setting uses `01786558855`.

### Top-banner variants

- `src/components/topbanner/topbanner-1/`
- `src/components/topbanner/topbanner-2/`
- `src/components/topbanner/topbanner-3/`

### Menu variants

- `src/components/menu/menu-1/`
- `src/components/menu/menu-2/`
- `src/components/menu/menu-3/`

Update logo/brand text, programme labels, navigation URLs, Facebook links, phone/WhatsApp actions, and consultation calls to action.

### Footer variants

- `src/components/footer/footer-1/`
- `src/components/footer/footer-2/`
- `src/components/footer/footer-3/`

Update the business name, programme links, contact number, WhatsApp action, Facebook links, legal-page links, and copyright text.

### Form and container variants

- `src/components/form/form-1/`
- `src/components/form/form-2/`
- `src/components/form/form-3/`
- `src/components/container/container-1/`
- `src/components/container/container-2/`

Review contact labels, field placeholders, form calls to action, and any business information shown inside these reusable blocks.

### Section variants

- `src/components/sections/section-1/`, `section-2/`, `section-3/`, `section-4/`, `section-5/`, `section-6/`, `section-7/`, `section-8/`
- `src/components/sections/section-9/`, `section-10/`, `section-11/`, `section-12/`, `section-13/`, `section-14/`, `section-15/`, `section-16/`
- `src/components/sections/section-17/`, `section-18/`, `section-19/`, `section-20/`, `section-21/`, `section-22/`, `section-23/`, `section-24/`
- `src/components/sections/section-25/`, `section-26/`, `section-27/`, `section-28/`, `section-29/`, `section-30/`, `section-31/`, `section-32/`
- `src/components/sections/section-33/`, `section-34/`, `section-35/`, `section-36/`, `section-37/`, `section-38/`, `section-39/`, `section-40/`
- `src/components/sections/section-41/`, `section-42/`, `section-43/`, `section-44/`, `section-45/`, `section-46/`, `section-47/`, `section-48/`

Each section may be used on a public CMS page. Review its title, description, image alt text, programme/service claims, CTA label, CTA URL, contact information, and social links before publishing it.

### Page templates

#### Core brand and programme pages

- `src/components/pages/home/` — TestPrep Center homepage.
- `src/components/pages/about-us/` — company overview.
- `src/components/pages/company-story/` — TestPrep Center story and approach.
- `src/components/pages/about-the-country/` — flexible programmes/services landing page.
- `src/components/pages/contact-us/` — contact details and enquiry form.
- `src/components/pages/program-pages/data.ts` — reusable defaults for:
  - IELTS Preparation
  - TPC Kids Spoken English

#### Study-abroad pages

- `src/components/pages/country-directory/` — study-destination directory.
- `src/components/pages/visa-requirements/` — student-visa requirements and checklist.
- `src/components/pages/visa-services/` — study-abroad services.
- `src/components/pages/visa-service-catalogue/` — study-abroad support catalogue.
- `src/components/pages/visa-consultancy/` — study-abroad guidance.
- `src/components/pages/visa-application-support/` — student-visa preparation.
- `src/components/pages/visa-insights/` — IELTS and study-abroad guides.

#### Help, people, and legal pages

- `src/components/pages/frequently-ask-questions/`
- `src/components/pages/whatsapp-faq/`
- `src/components/pages/leadership-team/`
- `src/components/pages/team-member/`
- `src/components/pages/privacy-policy/`
- `src/components/pages/refund-policy/`
- `src/components/pages/cookie-policy/`
- `src/components/pages/security/`
- `src/components/pages/delivery-policy/`
- `src/components/pages/site-terms-and-conditions/`
- `src/components/pages/terms-and-condition/`

Legal, policy, team, testimonial, instructor, and leadership pages require particular care: publish only confirmed business information, people, policies, and claims.

### CMS template and default-page registrations

- `src/components/pages/PageIndex.tsx` — registers all page templates shown in the CMS.
- `src/components/pages/PageBlocks.tsx` — renders CMS page blocks.
- `src/redux/features/dashboard/pages/pagesSlice.ts` — registers valid page-block variants.
- `src/lib/defaults/import-data.ts` — defines default pages, including the IELTS Preparation and TPC Kids Spoken English pages.

When a new template is added or renamed, update these registrations as well. Existing published CMS records keep their saved content, so review and republish those records after changing a template.
