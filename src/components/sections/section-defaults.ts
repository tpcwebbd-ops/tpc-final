/*
|-----------------------------------------
| setting up section-defaults.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 26 September, 2026
|-----------------------------------------
*/

import { defaultDataSection1 as one } from "./section-1/data";
import { defaultDataSection10 as ten } from "./section-10/data";
import { defaultDataSection11 as eleven } from "./section-11/data";
import { defaultDataSection12 as twelve } from "./section-12/data";
import { defaultDataSection13 as thirteen } from "./section-13/data";
import { defaultDataSection14 as fourteen } from "./section-14/data";
import { defaultDataSection15 as fifteen } from "./section-15/data";
import { defaultDataSection16 as sixteen } from "./section-16/data";
import { defaultDataSection17 as seventeen } from "./section-17/data";
import { defaultDataSection18 as eighteen } from "./section-18/data";
import { defaultDataSection19 as nineteen } from "./section-19/data";
import { defaultDataSection2 as two } from "./section-2/data";
import { defaultDataSection20 as twenty } from "./section-20/data";
import { defaultDataSection21 as twentyOne } from "./section-21/data";
import { defaultDataSection22 as twentyTwo } from "./section-22/data";
import { defaultDataSection23 as twentyThree } from "./section-23/data";
import { defaultData as twentyFour } from "./section-24/data";
import { defaultDataSection25 as twentyFive } from "./section-25/data";
import { defaultDataSection26 as twentySix } from "./section-26/data";
import { defaultDataSection27 as twentySeven } from "./section-27/data";
import { defaultDataSection28 as twentyEight } from "./section-28/data";
import { defaultDataSection29 as twentyNine } from "./section-29/data";
import { defaultDataSection3 as three } from "./section-3/data";
import { defaultDataSection30 as thirty } from "./section-30/data";
import { defaultDataSection31 as thirtyOne } from "./section-31/data";
import { defaultDataSection32 as thirtyTwo } from "./section-32/data";
import { defaultDataSection33 as thirtyThree } from "./section-33/data";
import { defaultDataSection34 as thirtyFour } from "./section-34/data";
import { defaultDataSection35 as thirtyFive } from "./section-35/data";
import { defaultDataSection36 as thirtySix } from "./section-36/data";
import { defaultDataSection37 as thirtySeven } from "./section-37/data";
import { defaultDataSection38 as thirtyEight } from "./section-38/data";
import { defaultDataSection39 as thirtyNine } from "./section-39/data";
import { defaultDataSection4 as four } from "./section-4/data";
import { defaultDataSection40 as forty } from "./section-40/data";
import { defaultDataSection41 as fortyOne } from "./section-41/data";
import { defaultDataSection42 as fortyTwo } from "./section-42/data";
import { defaultDataSection43 as fortyThree } from "./section-43/data";
import { defaultDataSection44 as fortyFour } from "./section-44/data";
import { defaultDataSection45 as fortyFive } from "./section-45/data";
import { defaultDataSection46 as fortySix } from "./section-46/data";
import { defaultDataSection47 as fortySeven } from "./section-47/data";
import { defaultDataSection48 as fortyEight } from "./section-48/data";
import { defaultDataSection5 as five } from "./section-5/data";
import { defaultDataSection6 as six } from "./section-6/data";
import { defaultDataSection7 as seven } from "./section-7/data";
import { defaultDataSection8 as eight } from "./section-8/data";
import { defaultDataSection9 as nine } from "./section-9/data";

export type SectionVariant =
  | "section-1"
  | "section-2"
  | "section-3"
  | "section-4"
  | "section-5"
  | "section-6"
  | "section-7"
  | "section-8"
  | "section-9"
  | "section-10"
  | "section-11"
  | "section-12"
  | "section-13"
  | "section-14"
  | "section-15"
  | "section-16"
  | "section-17"
  | "section-18"
  | "section-19"
  | "section-20"
  | "section-21"
  | "section-22"
  | "section-23"
  | "section-24"
  | "section-25"
  | "section-26"
  | "section-27"
  | "section-28"
  | "section-29"
  | "section-30"
  | "section-31"
  | "section-32"
  | "section-33"
  | "section-34"
  | "section-35"
  | "section-36"
  | "section-37"
  | "section-38"
  | "section-39"
  | "section-40"
  | "section-41"
  | "section-42"
  | "section-43"
  | "section-44"
  | "section-45"
  | "section-46"
  | "section-47"
  | "section-48";

export type SectionData = Record<string, string>;

const toSectionData = (value: object): SectionData => value as unknown as SectionData;

export const sectionDefaults: Record<SectionVariant, SectionData> = {
  "section-1": toSectionData(one),
  "section-2": toSectionData(two),
  "section-3": toSectionData(three),
  "section-4": toSectionData(four),
  "section-5": toSectionData(five),
  "section-6": toSectionData(six),
  "section-7": toSectionData(seven),
  "section-8": toSectionData(eight),
  "section-9": toSectionData(nine),
  "section-10": toSectionData(ten),
  "section-11": toSectionData(eleven),
  "section-12": toSectionData(twelve),
  "section-13": toSectionData(thirteen),
  "section-14": toSectionData(fourteen),
  "section-15": toSectionData(fifteen),
  "section-16": toSectionData(sixteen),
  "section-17": toSectionData(seventeen),
  "section-18": toSectionData(eighteen),
  "section-19": toSectionData(nineteen),
  "section-20": toSectionData(twenty),
  "section-21": toSectionData(twentyOne),
  "section-22": toSectionData(twentyTwo),
  "section-23": toSectionData(twentyThree),
  "section-24": toSectionData(twentyFour),
  "section-25": toSectionData(twentyFive),
  "section-26": toSectionData(twentySix),
  "section-27": toSectionData(twentySeven),
  "section-28": toSectionData(twentyEight),
  "section-29": toSectionData(twentyNine),
  "section-30": toSectionData(thirty),
  "section-31": toSectionData(thirtyOne),
  "section-32": toSectionData(thirtyTwo),
  "section-33": toSectionData(thirtyThree),
  "section-34": toSectionData(thirtyFour),
  "section-35": toSectionData(thirtyFive),
  "section-36": toSectionData(thirtySix),
  "section-37": toSectionData(thirtySeven),
  "section-38": toSectionData(thirtyEight),
  "section-39": toSectionData(thirtyNine),
  "section-40": toSectionData(forty),
  "section-41": toSectionData(fortyOne),
  "section-42": toSectionData(fortyTwo),
  "section-43": toSectionData(fortyThree),
  "section-44": toSectionData(fortyFour),
  "section-45": toSectionData(fortyFive),
  "section-46": toSectionData(fortySix),
  "section-47": toSectionData(fortySeven),
  "section-48": toSectionData(fortyEight),
};

export function hydrateSectionData(variant: string, data: Record<string, unknown>): SectionData | null {
  const defaults = sectionDefaults[variant as SectionVariant];
  return defaults ? ({ ...defaults, ...data } as SectionData) : null;
}

export const getSectionDefaults = (variant: SectionVariant) => ({ ...sectionDefaults[variant] });
