/*
|-----------------------------------------
| setting up PageIndex.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 19 August, 2026
|-----------------------------------------
*/

import type { ComponentType } from "react";

import { defaultDataAboutTheCountry as aboutTheCountry } from "./about-the-country/data";
import AboutTheCountryMutation from "./about-the-country/Mutation";
import AboutTheCountryQuery from "./about-the-country/Query";
import { defaultData as about } from "./about-us/data";
import AboutMutation from "./about-us/Mutation";
import AboutQuery from "./about-us/Query";
import { defaultDataCompanyStory as companyStory } from "./company-story/data";
import CompanyStoryMutation from "./company-story/Mutation";
import CompanyStoryQuery from "./company-story/Query";
import { defaultData as contact } from "./contact-us/data";
import ContactMutation from "./contact-us/Mutation";
import ContactQuery from "./contact-us/Query";
import { defaultDataCountryDirectory as countryDirectory } from "./country-directory/data";
import CountryDirectoryMutation from "./country-directory/Mutation";
import CountryDirectoryQuery from "./country-directory/Query";
import { defaultDataDeliveryPolicy as deliveryPolicy } from "./delivery-policy/data";
import DeliveryPolicyMutation from "./delivery-policy/Mutation";
import DeliveryPolicyQuery from "./delivery-policy/Query";
import { defaultDataDetailsPage as detailsPage } from "./details-page/data";
import DetailsPageMutation from "./details-page/Mutation";
import DetailsPageQuery from "./details-page/Query";
import { defaultData as frequentlyAskQuestions } from "./frequently-ask-questions/data";
import FrequentlyAskQuestionsMutation from "./frequently-ask-questions/Mutation";
import FrequentlyAskQuestionsQuery from "./frequently-ask-questions/Query";
import { defaultData as home } from "./home/data";
import HomeMutation from "./home/Mutation";
import HomeQuery from "./home/Query";
import { defaultDataLeadershipTeam as leadershipTeam } from "./leadership-team/data";
import LeadershipTeamMutation from "./leadership-team/Mutation";
import LeadershipTeamQuery from "./leadership-team/Query";
import { defaultDataPage4 as privacy } from "./privacy-policy/data";
import PrivacyMutation from "./privacy-policy/Mutation";
import PrivacyQuery from "./privacy-policy/Query";
import { defaultDataPage7 as refund } from "./refund-policy/data";
import RefundMutation from "./refund-policy/Mutation";
import RefundQuery from "./refund-policy/Query";
import { defaultDataSecurity as security } from "./security/data";
import SecurityMutation from "./security/Mutation";
import SecurityQuery from "./security/Query";
import { defaultDataCookiePolicy as cookiePolicy } from "./cookie-policy/data";
import CookiePolicyMutation from "./cookie-policy/Mutation";
import CookiePolicyQuery from "./cookie-policy/Query";
import { defaultDataSiteTermsAndConditions as siteTermsAndConditions } from "./site-terms-and-conditions/data";
import SiteTermsAndConditionsMutation from "./site-terms-and-conditions/Mutation";
import SiteTermsAndConditionsQuery from "./site-terms-and-conditions/Query";
import { defaultDataPage8 as teamMember } from "./team-member/data";
import TeamMemberMutation from "./team-member/Mutation";
import TeamMemberQuery from "./team-member/Query";
import { defaultDataPage5 as terms } from "./terms-and-condition/data";
import TermsMutation from "./terms-and-condition/Mutation";
import TermsQuery from "./terms-and-condition/Query";
import { defaultDataVisaApplicationSupport as visaApplicationSupport } from "./visa-application-support/data";
import VisaApplicationSupportMutation from "./visa-application-support/Mutation";
import VisaApplicationSupportQuery from "./visa-application-support/Query";
import { defaultDataVisaConsultancy as visaConsultancy } from "./visa-consultancy/data";
import VisaConsultancyMutation from "./visa-consultancy/Mutation";
import VisaConsultancyQuery from "./visa-consultancy/Query";
import { defaultDataVisaInsights as visaInsights } from "./visa-insights/data";
import VisaInsightsMutation from "./visa-insights/Mutation";
import VisaInsightsQuery from "./visa-insights/Query";
import { defaultDataVisaRequirements as visaRequirements } from "./visa-requirements/data";
import VisaRequirementsMutation from "./visa-requirements/Mutation";
import VisaRequirementsQuery from "./visa-requirements/Query";
import { defaultDataVisaServiceCatalogue as visaServiceCatalogue } from "./visa-service-catalogue/data";
import VisaServiceCatalogueMutation from "./visa-service-catalogue/Mutation";
import VisaServiceCatalogueQuery from "./visa-service-catalogue/Query";
import { defaultDataVisaServices as visaServices } from "./visa-services/data";
import VisaServicesMutation from "./visa-services/Mutation";
import VisaServicesQuery from "./visa-services/Query";
import { defaultDataWhatsAppFaq as whatsAppFaq } from "./whatsapp-faq/data";
import WhatsAppFaqMutation from "./whatsapp-faq/Mutation";
import WhatsAppFaqQuery from "./whatsapp-faq/Query";

export type AllPageKind =
  | "all-home"
  | "company-story"
  | "whatsapp-faq"
  | "security"
  | "site-terms-and-conditions"
  | "delivery-policy"
  | "cookie-policy"
  | "leadership-team"
  | "country-directory"
  | "about-the-country"
  | "details-page"
  | "visa-requirements"
  | "visa-services"
  | "visa-application-support"
  | "visa-consultancy"
  | "visa-service-catalogue"
  | "visa-insights"
  | "all-about-us"
  | "all-contact-us"
  | "all-frequently-ask-questions"
  | "all-privacy"
  | "all-refund"
  | "all-team-member"
  | "all-terms";
export type AllPageData = Record<string, string>;
type Definition = {
  defaultData: AllPageData;
  title: string;
  description: string;
  Mutation: ComponentType<{ data?: AllPageData; onChange: (data: AllPageData) => void }>;
  Query: ComponentType<{ data?: AllPageData }>;
};

export const pageIndex: Record<AllPageKind, Definition> = {
  "all-home": {
    defaultData: home as unknown as AllPageData,
    title: "Home Page",
    description: "A flexible landing page with services, insights, and a call to action",
    Mutation: ({ data, onChange }) => (
      <HomeMutation
        data={data as unknown as typeof home}
        onChange={onChange as unknown as (data: typeof home) => void}
      />
    ),
    Query: ({ data }) => <HomeQuery data={data as unknown as typeof home} />,
  },
  "company-story": {
    defaultData: companyStory as unknown as AllPageData,
    title: "Company Story",
    description: "An animated company about-page layout",
    Mutation: ({ data, onChange }) => (
      <CompanyStoryMutation
        data={data as unknown as typeof companyStory}
        onChange={onChange as unknown as (data: typeof companyStory) => void}
      />
    ),
    Query: ({ data }) => <CompanyStoryQuery data={data as unknown as typeof companyStory} />,
  },
  "whatsapp-faq": {
    defaultData: whatsAppFaq as unknown as AllPageData,
    title: "WhatsApp FAQ",
    description: "A WhatsApp call-to-action and frequently asked questions page",
    Mutation: ({ data, onChange }) => (
      <WhatsAppFaqMutation
        data={data as unknown as typeof whatsAppFaq}
        onChange={onChange as unknown as (data: typeof whatsAppFaq) => void}
      />
    ),
    Query: ({ data }) => <WhatsAppFaqQuery data={data as unknown as typeof whatsAppFaq} />,
  },
  security: {
    defaultData: security as unknown as AllPageData,
    title: "Security",
    description: "A detailed website security page layout",
    Mutation: ({ data, onChange }) => (
      <SecurityMutation
        data={data as unknown as typeof security}
        onChange={onChange as unknown as (data: typeof security) => void}
      />
    ),
    Query: ({ data }) => <SecurityQuery data={data as unknown as typeof security} />,
  },
  "site-terms-and-conditions": {
    defaultData: siteTermsAndConditions as unknown as AllPageData,
    title: "Site Terms & Conditions",
    description: "A detailed terms-and-conditions page layout",
    Mutation: ({ data, onChange }) => (
      <SiteTermsAndConditionsMutation
        data={data as unknown as typeof siteTermsAndConditions}
        onChange={onChange as unknown as (data: typeof siteTermsAndConditions) => void}
      />
    ),
    Query: ({ data }) => <SiteTermsAndConditionsQuery data={data as unknown as typeof siteTermsAndConditions} />,
  },
  "delivery-policy": {
    defaultData: deliveryPolicy as unknown as AllPageData,
    title: "Delivery Policy",
    description: "A delivery-policy page with shipping and support details",
    Mutation: ({ data, onChange }) => (
      <DeliveryPolicyMutation
        data={data as unknown as typeof deliveryPolicy}
        onChange={onChange as unknown as (data: typeof deliveryPolicy) => void}
      />
    ),
    Query: ({ data }) => <DeliveryPolicyQuery data={data as unknown as typeof deliveryPolicy} />,
  },
  "cookie-policy": {
    defaultData: cookiePolicy as unknown as AllPageData,
    title: "Cookie Policy",
    description: "A cookie-policy page with visitor choices and support details",
    Mutation: ({ data, onChange }) => (
      <CookiePolicyMutation
        data={data as unknown as typeof cookiePolicy}
        onChange={onChange as unknown as (data: typeof cookiePolicy) => void}
      />
    ),
    Query: ({ data }) => <CookiePolicyQuery data={data as unknown as typeof cookiePolicy} />,
  },
  "leadership-team": {
    defaultData: leadershipTeam as unknown as AllPageData,
    title: "Leadership Team",
    description: "An animated leadership and team-members page",
    Mutation: ({ data, onChange }) => (
      <LeadershipTeamMutation
        data={data as unknown as typeof leadershipTeam}
        onChange={onChange as unknown as (data: typeof leadershipTeam) => void}
      />
    ),
    Query: ({ data }) => <LeadershipTeamQuery data={data as unknown as typeof leadershipTeam} />,
  },
  "country-directory": {
    defaultData: countryDirectory as unknown as AllPageData,
    title: "Country Directory",
    description: "A searchable embassy-country directory page",
    Mutation: ({ data, onChange }) => (
      <CountryDirectoryMutation
        data={data as unknown as typeof countryDirectory}
        onChange={onChange as unknown as (data: typeof countryDirectory) => void}
      />
    ),
    Query: ({ data }) => <CountryDirectoryQuery data={data as unknown as typeof countryDirectory} />,
  },
  "about-the-country": {
    defaultData: aboutTheCountry as unknown as AllPageData,
    title: "About the Country",
    description: "A complete business website landing-page layout",
    Mutation: ({ data, onChange }) => (
      <AboutTheCountryMutation
        data={data as unknown as typeof aboutTheCountry}
        onChange={onChange as unknown as (data: typeof aboutTheCountry) => void}
      />
    ),
    Query: ({ data }) => <AboutTheCountryQuery data={data as unknown as typeof aboutTheCountry} />,
  },
  "details-page": {
    defaultData: detailsPage as unknown as AllPageData,
    title: "Details Page",
    description: "A product showcase and purchase page",
    Mutation: ({ data, onChange }) => (
      <DetailsPageMutation
        data={data as unknown as typeof detailsPage}
        onChange={onChange as unknown as (data: typeof detailsPage) => void}
      />
    ),
    Query: ({ data }) => <DetailsPageQuery data={data as unknown as typeof detailsPage} />,
  },
  "visa-requirements": {
    defaultData: visaRequirements as unknown as AllPageData,
    title: "Visa Requirements",
    description: "A student-visa guide with country filters and planning resources",
    Mutation: ({ data, onChange }) => (
      <VisaRequirementsMutation
        data={data as unknown as typeof visaRequirements}
        onChange={onChange as unknown as (data: typeof visaRequirements) => void}
      />
    ),
    Query: ({ data }) => <VisaRequirementsQuery data={data as unknown as typeof visaRequirements} />,
  },
  "visa-services": {
    defaultData: visaServices as unknown as AllPageData,
    title: "Visa Services",
    description: "A complete service catalogue and conversion page",
    Mutation: ({ data, onChange }) => (
      <VisaServicesMutation
        data={data as unknown as typeof visaServices}
        onChange={onChange as unknown as (data: typeof visaServices) => void}
      />
    ),
    Query: ({ data }) => <VisaServicesQuery data={data as unknown as typeof visaServices} />,
  },
  "visa-application-support": {
    defaultData: visaApplicationSupport as unknown as AllPageData,
    title: "Visa Application Support",
    description: "A Bangladesh student-visa guide and checklist page",
    Mutation: ({ data, onChange }) => (
      <VisaApplicationSupportMutation
        data={data as unknown as typeof visaApplicationSupport}
        onChange={onChange as unknown as (data: typeof visaApplicationSupport) => void}
      />
    ),
    Query: ({ data }) => <VisaApplicationSupportQuery data={data as unknown as typeof visaApplicationSupport} />,
  },
  "visa-consultancy": {
    defaultData: visaConsultancy as unknown as AllPageData,
    title: "Visa Consultancy",
    description: "An education-consultancy service and readiness page",
    Mutation: ({ data, onChange }) => (
      <VisaConsultancyMutation
        data={data as unknown as typeof visaConsultancy}
        onChange={onChange as unknown as (data: typeof visaConsultancy) => void}
      />
    ),
    Query: ({ data }) => <VisaConsultancyQuery data={data as unknown as typeof visaConsultancy} />,
  },
  "visa-service-catalogue": {
    defaultData: visaServiceCatalogue as unknown as AllPageData,
    title: "Visa Service Catalogue",
    description: "An alternating service-catalogue page",
    Mutation: ({ data, onChange }) => (
      <VisaServiceCatalogueMutation
        data={data as unknown as typeof visaServiceCatalogue}
        onChange={onChange as unknown as (data: typeof visaServiceCatalogue) => void}
      />
    ),
    Query: ({ data }) => <VisaServiceCatalogueQuery data={data as unknown as typeof visaServiceCatalogue} />,
  },
  "visa-insights": {
    defaultData: visaInsights as unknown as AllPageData,
    title: "Visa Insights",
    description: "A searchable study-abroad blog page",
    Mutation: ({ data, onChange }) => (
      <VisaInsightsMutation
        data={data as unknown as typeof visaInsights}
        onChange={onChange as unknown as (data: typeof visaInsights) => void}
      />
    ),
    Query: ({ data }) => <VisaInsightsQuery data={data as unknown as typeof visaInsights} />,
  },
  "all-about-us": {
    defaultData: about,
    title: "About Us",
    description: "A page for your purpose, process, and team story",
    Mutation: AboutMutation,
    Query: AboutQuery,
  },
  "all-contact-us": {
    defaultData: contact,
    title: "Contact Us",
    description: "Contact details, map, and a message form",
    Mutation: ContactMutation,
    Query: ContactQuery,
  },
  "all-frequently-ask-questions": {
    defaultData: frequentlyAskQuestions,
    title: "Frequently Asked Questions",
    description: "An expandable answer list for common questions",
    Mutation: FrequentlyAskQuestionsMutation,
    Query: FrequentlyAskQuestionsQuery,
  },
  "all-privacy": {
    defaultData: privacy as unknown as AllPageData,
    title: "Privacy Policy",
    description: "A legal privacy-policy page",
    Mutation: ({ data, onChange }) => (
      <PrivacyMutation
        data={data as unknown as typeof privacy}
        onChange={onChange as unknown as (data: typeof privacy) => void}
      />
    ),
    Query: ({ data }) => <PrivacyQuery data={data as unknown as typeof privacy} />,
  },
  "all-refund": {
    defaultData: refund as unknown as AllPageData,
    title: "Refund Policy",
    description: "A legal refund-policy page",
    Mutation: ({ data, onChange }) => (
      <RefundMutation
        data={data as unknown as typeof refund}
        onChange={onChange as unknown as (data: typeof refund) => void}
      />
    ),
    Query: ({ data }) => <RefundQuery data={data as unknown as typeof refund} />,
  },
  "all-team-member": {
    defaultData: teamMember as unknown as AllPageData,
    title: "Team Members",
    description: "A visual page for your leadership and team members",
    Mutation: ({ data, onChange }) => (
      <TeamMemberMutation
        data={data as unknown as typeof teamMember}
        onSubmit={onChange as unknown as (data: typeof teamMember) => void}
      />
    ),
    Query: ({ data }) => <TeamMemberQuery data={data as unknown as typeof teamMember} />,
  },
  "all-terms": {
    defaultData: terms as unknown as AllPageData,
    title: "Terms and Conditions",
    description: "A legal terms-and-conditions page",
    Mutation: ({ data, onChange }) => (
      <TermsMutation
        data={data as unknown as typeof terms}
        onChange={onChange as unknown as (data: typeof terms) => void}
      />
    ),
    Query: ({ data }) => <TermsQuery data={data as unknown as typeof terms} />,
  },
};

export const pageAssets = Object.entries(pageIndex).map(([variant, page]) => ({
  variant: variant as AllPageKind,
  ...page,
}));
export const getPageDefinition = (variant: string) => pageIndex[variant as AllPageKind];
export const hydratePageData = (variant: string, data: Record<string, unknown>): AllPageData | null => {
  const definition = getPageDefinition(variant);
  return definition ? ({ ...definition.defaultData, ...data } as AllPageData) : null;
};
export const allPageChoices = pageAssets.map(({ variant, title, description }) => ({
  variant,
  label: `${title} · ${description}`,
}));
export const allPageDefaults = (kind: AllPageKind) => ({ ...pageIndex[kind].defaultData });

export function PagePreview({ kind, data }: { kind: AllPageKind; data: AllPageData }) {
  const Query = getPageDefinition(kind)?.Query;
  return Query ? <Query data={hydratePageData(kind, data) ?? data} /> : null;
}

export function PageMutation({
  kind,
  data,
  onChange,
}: {
  kind: AllPageKind;
  data: AllPageData;
  onChange: (data: AllPageData) => void;
}) {
  const Mutation = getPageDefinition(kind)?.Mutation;
  return Mutation ? <Mutation data={hydratePageData(kind, data) ?? data} onChange={onChange} /> : null;
}
