/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

export const COUNTRY_DIRECTORY_REGIONS = [
  "Asia",
  "Africa",
  "Europe",
  "North America",
  "South America",
  "Oceania",
] as const;

export type Region = (typeof COUNTRY_DIRECTORY_REGIONS)[number];

export interface CountryItem {
  id: string;
  name: string;
  flag: string;
  flagImage: string;
  region: Region;
  description: string;
}

export interface ICountryDirectoryData {
  pageUid: string;
  pageName: string;
  searchPlaceholder: string;
  viewAllLabel: string;
  sectionTitlePrefix: string;
  emptyMessage: string;
  countries: CountryItem[];
}

export interface CountryDirectoryPayload extends ICountryDirectoryData {
  paddingX: number;
  paddingY: number;
}

export interface CountryDirectoryProps {
  data?: ICountryDirectoryData | CountryDirectoryPayload | string;
}

export const defaultLayout = {
  paddingX: 0,
  paddingY: 0,
};

export const getFlagImageFromEmoji = (flag: string) => {
  const code = Array.from(flag)
    .map((character) => character.codePointAt(0))
    .filter((value): value is number => typeof value === "number" && value >= 0x1f1e6 && value <= 0x1f1ff)
    .map((value) => String.fromCharCode(value - 0x1f1e6 + 97))
    .join("");

  return code.length === 2 ? `https://flagcdn.com/w160/${code}.png` : "";
};

export const getDefaultCountryDescription = (name: string, region: Region) =>
  `${name} is located in ${region}. Open this destination profile to review its location and useful local information. Replace this demo text with the detailed guidance, services, or destination information your visitors need.`;

const COUNTRY_SEED: Array<[string, string, Region]> = [
  ["Hong Kong", "🇭🇰", "Asia"],
  ["Philippines", "🇵🇭", "Asia"],
  ["Thailand", "🇹🇭", "Asia"],
  ["Singapore", "🇸🇬", "Asia"],
  ["Myanmar", "🇲🇲", "Asia"],
  ["Lebanon", "🇱🇧", "Asia"],
  ["Kazakhstan", "🇰🇿", "Asia"],
  ["Laos", "🇱🇦", "Asia"],
  ["Iraq", "🇮🇶", "Asia"],
  ["Brunei", "🇧🇳", "Asia"],
  ["Bahrain", "🇧🇭", "Asia"],
  ["Malaysia", "🇲🇾", "Asia"],
  ["Pakistan", "🇵🇰", "Asia"],
  ["Turkey", "🇹🇷", "Asia"],
  ["The People's Republic of China", "🇨🇳", "Asia"],
  ["Sri Lanka", "🇱🇰", "Asia"],
  ["Qatar", "🇶🇦", "Asia"],
  ["Maldives", "🇲🇻", "Asia"],
  ["Japan", "🇯🇵", "Asia"],
  ["Kuwait", "🇰🇼", "Asia"],
  ["Indonesia", "🇮🇩", "Asia"],
  ["South Korea", "🇰🇷", "Asia"],
  ["Cambodia", "🇰🇭", "Asia"],
  ["Afghanistan", "🇦🇫", "Asia"],
  ["India", "🇮🇳", "Asia"],
  ["Taiwan", "🇹🇼", "Asia"],
  ["Vietnam", "🇻🇳", "Asia"],
  ["Tajikistan", "🇹🇯", "Asia"],
  ["Saudi Arabia", "🇸🇦", "Asia"],
  ["Oman", "🇴🇲", "Asia"],
  ["Mongolia", "🇲🇳", "Asia"],
  ["Jordan", "🇯🇴", "Asia"],
  ["Kyrgyzstan", "🇰🇬", "Asia"],
  ["Iran", "🇮🇷", "Asia"],
  ["East Timor", "🇹🇱", "Asia"],
  ["Armenia", "🇦🇲", "Asia"],
  ["Nepal", "🇳🇵", "Asia"],
  ["Bhutan", "🇧🇹", "Asia"],
  ["Gambia", "🇬🇲", "Africa"],
  ["Tanzania", "🇹🇿", "Africa"],
  ["Sudan", "🇸🇩", "Africa"],
  ["Seychelles", "🇸🇨", "Africa"],
  ["Morocco", "🇲🇦", "Africa"],
  ["Niger", "🇳🇪", "Africa"],
  ["Mauritania", "🇲🇷", "Africa"],
  ["Liberia", "🇱🇷", "Africa"],
  ["Kenya", "🇰🇪", "Africa"],
  ["Republic of the Congo", "🇨🇬", "Africa"],
  ["Somalia", "🇸🇴", "Africa"],
  ["Sao Tome and Principe", "🇸🇹", "Africa"],
  ["Nigeria", "🇳🇬", "Africa"],
  ["Mozambique", "🇲🇿", "Africa"],
  ["Malawi", "🇲🇼", "Africa"],
  ["Mauritius", "🇲🇺", "Africa"],
  ["Libya", "🇱🇾", "Africa"],
  ["Ivory Coast", "🇨🇮", "Africa"],
  ["Democratic Republic of the Congo", "🇨🇩", "Africa"],
  ["South Sudan", "🇸🇸", "Africa"],
  ["Senegal", "🇸🇳", "Africa"],
  ["South Africa", "🇿🇦", "Africa"],
  ["Namibia", "🇳🇦", "Africa"],
  ["Mali", "🇲🇱", "Africa"],
  ["Lesotho", "🇱🇸", "Africa"],
  ["Madagascar", "🇲🇬", "Africa"],
  ["Gabon", "🇬🇦", "Africa"],
  ["Ghana", "🇬🇭", "Africa"],
  ["Guinea", "🇬🇳", "Africa"],
  ["Guinea-Bissau", "🇬🇼", "Africa"],
  ["Equatorial Guinea", "🇬🇶", "Africa"],
  ["Eritrea", "🇪🇷", "Africa"],
  ["Ethiopia", "🇪🇹", "Africa"],
  ["Egypt", "🇪🇬", "Africa"],
  ["Djibouti", "🇩🇯", "Africa"],
  ["Dominica", "🇩🇲", "Africa"],
  ["Burkina Faso", "🇧🇫", "Africa"],
  ["Cameroon", "🇨🇲", "Africa"],
  ["Cape Verde", "🇨🇻", "Africa"],
  ["Chad", "🇹🇩", "Africa"],
  ["Burundi", "🇧🇮", "Africa"],
  ["Benin", "🇧🇯", "Africa"],
  ["Algeria", "🇩🇿", "Africa"],
  ["Angola", "🇦🇴", "Africa"],
  ["Czech Republic", "🇨🇿", "Europe"],
  ["Spain", "🇪🇸", "Europe"],
  ["Slovenia", "🇸🇮", "Europe"],
  ["Portugal", "🇵🇹", "Europe"],
  ["Montenegro", "🇲🇪", "Europe"],
  ["Monaco", "🇲🇨", "Europe"],
  ["Lithuania", "🇱🇹", "Europe"],
  ["Kosovo", "🇽🇰", "Europe"],
  ["Italy", "🇮🇹", "Europe"],
  ["Greece", "🇬🇷", "Europe"],
  ["France", "🇫🇷", "Europe"],
  ["Croatia", "🇭🇷", "Europe"],
  ["Austria", "🇦🇹", "Europe"],
  ["Belgium", "🇧🇪", "Europe"],
  ["Netherlands", "🇳🇱", "Europe"],
  ["United Kingdom", "🇬🇧", "Europe"],
  ["Switzerland", "🇨🇭", "Europe"],
  ["San Marino", "🇸🇲", "Europe"],
  ["Serbia", "🇷🇸", "Europe"],
  ["Russia", "🇷🇺", "Europe"],
  ["Malta", "🇲🇹", "Europe"],
  ["Latvia", "🇱🇻", "Europe"],
  ["Luxembourg", "🇱🇺", "Europe"],
  ["Hungary", "🇭🇺", "Europe"],
  ["Georgia", "🇬🇪", "Europe"],
  ["Estonia", "🇪🇪", "Europe"],
  ["Cyprus", "🇨🇾", "Europe"],
  ["Bosnia and Herzegovina", "🇧🇦", "Europe"],
  ["Azerbaijan", "🇦🇿", "Europe"],
  ["Andorra", "🇦🇩", "Europe"],
  ["Romania", "🇷🇴", "Europe"],
  ["Sweden", "🇸🇪", "Europe"],
  ["Slovakia", "🇸🇰", "Europe"],
  ["Poland", "🇵🇱", "Europe"],
  ["Norway", "🇳🇴", "Europe"],
  ["Moldova", "🇲🇩", "Europe"],
  ["Liechtenstein", "🇱🇮", "Europe"],
  ["North Macedonia", "🇲🇰", "Europe"],
  ["Iceland", "🇮🇸", "Europe"],
  ["Germany", "🇩🇪", "Europe"],
  ["Finland", "🇫🇮", "Europe"],
  ["Denmark", "🇩🇰", "Europe"],
  ["Bulgaria", "🇧🇬", "Europe"],
  ["Belarus", "🇧🇾", "Europe"],
  ["Ireland", "🇮🇪", "Europe"],
  ["Albania", "🇦🇱", "Europe"],
  ["United States", "🇺🇸", "North America"],
  ["Nicaragua", "🇳🇮", "North America"],
  ["Haiti", "🇭🇹", "North America"],
  ["El Salvador", "🇸🇻", "North America"],
  ["Barbados", "🇧🇧", "North America"],
  ["Canada", "🇨🇦", "North America"],
  ["The Dominican Republic", "🇩🇴", "North America"],
  ["Mexico", "🇲🇽", "North America"],
  ["Grenada", "🇬🇩", "North America"],
  ["Costa Rica", "🇨🇷", "North America"],
  ["Belize", "🇧🇿", "North America"],
  ["Panama", "🇵🇦", "North America"],
  ["Jamaica", "🇯🇲", "North America"],
  ["Guatemala", "🇬🇹", "North America"],
  ["Cuba", "🇨🇺", "North America"],
  ["Antigua and Barbuda", "🇦🇬", "North America"],
  ["Uruguay", "🇺🇾", "South America"],
  ["Paraguay", "🇵🇾", "South America"],
  ["Chile", "🇨🇱", "South America"],
  ["Brazil", "🇧🇷", "South America"],
  ["Suriname", "🇸🇷", "South America"],
  ["Guyana", "🇬🇾", "South America"],
  ["Colombia", "🇨🇴", "South America"],
  ["Argentina", "🇦🇷", "South America"],
  ["Peru", "🇵🇪", "South America"],
  ["Ecuador", "🇪🇨", "South America"],
  ["Bolivia", "🇧🇴", "South America"],
  ["Samoa", "🇼🇸", "Oceania"],
  ["Nauru", "🇳🇷", "Oceania"],
  ["Fiji", "🇫🇯", "Oceania"],
  ["Palau", "🇵🇼", "Oceania"],
  ["New Zealand", "🇳🇿", "Oceania"],
  ["Australia", "🇦🇺", "Oceania"],
  ["Papua New Guinea", "🇵🇬", "Oceania"],
  ["Kiribati", "🇰🇮", "Oceania"],
];

export const defaultDataCountryDirectory: ICountryDirectoryData = {
  pageUid: "country-directory-uid",
  pageName: "Global Destinations",
  searchPlaceholder: "Search destinations",
  viewAllLabel: "View all destinations",
  sectionTitlePrefix: "Explore destinations in",
  emptyMessage: "No destinations match your search",
  countries: COUNTRY_SEED.map(([name, flag, region], index) => ({
    id: `country-${index + 1}`,
    name,
    flag,
    flagImage: getFlagImageFromEmoji(flag),
    region,
    description: getDefaultCountryDescription(name, region),
  })),
};
