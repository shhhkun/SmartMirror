export const modulePositionsMap: Record<string, number> = {
  // enums are weird in typescript, so switched this to a map
  'Top Bar': 0,
  'Top Left': 1,
  'Top Center': 2,
  'Top Right': 3,
  'Upper Third': 4,
  'Middle Center': 5,
  'Lower Third': 6,
  'Bottom Left': 7,
  'Bottom Center': 8,
  'Bottom Right': 9,
  'Bottom Bar': 10,
  'Fullscreen Above': 11,
  'Fullscreen Below': 12
};

export const modulePositionDisplayOptions: string[] = Object.keys(modulePositionsMap);

export const usersMap: { [key: string]: number } = {
  // kinda whack to have this hard coded, but just doing for demo
  "Daniel": 0,
  "Erick": 1,
  "Erik": 2,
  "Serjo": 3,
  "Andy": 4,
  "Evan": 5,
  "Unknown": 9,
};

export const languageMap: { [key: string]: number } = {
  // need to check if these values are right according to the mirror side
  "English": 0,
  "Spanish": 1,
  "Russian": 2,
  "Unknown": 9,
};

export const unitsMap: { [key: string]: number } = {
  // need to check if these values are right according to the mirror side
  "Metric": 0,
  "Imperial": 1,
  "Unknown": 9,
};