export const betterPositionsMap: Record<string, number> = {
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


export const modulePositionDisplayOptions: string[] = Object.keys(betterPositionsMap);


export const usersMap: { [key: string]: number } = {
  "Daniel": 0,
  "Erick": 1,
  "Erik": 2,
  "Serjo": 3,
  "Andy": 4,
  "Evan": 5,
  "Unknown": 9,
};

// not right values in here rn
export const languageMap: { [key: string]: number } = {
  "English": 0,
  "Spanish": 1,
  "Russian": 2,
  "Unknown": 9,
};

// not right values in here rn
export const unitsMap: { [key: string]: number } = {
  "Metric": 0,
  "Imperial": 1,
  "Unknown": 9,
};