export type PageTemplateSection = {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
};

export type PageTemplateData = {
  pageUid: string;
  pageName: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryAction: string;
  secondaryAction: string;
  highlightTitle?: string;
  highlightDescription?: string;
  sections: PageTemplateSection[];
};

export type PageTemplateProps<T extends PageTemplateData> = { data?: T | string };
