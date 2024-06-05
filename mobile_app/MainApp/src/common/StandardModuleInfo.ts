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

// pretty dumb to have this not be just selecting the keys of the map, but whatever
export const modulePositionDisplayOptions = [
  'Top Bar',
  'Top Left',
  'Top Center',
  'Top Right',
  'Upper Third',
  'Middle Center',
  'Lower Third',
  'Bottom Left',
  'Bottom Center',
  'Bottom Right',
  'Bottom Bar',
  'Fullscreen Above',
  'Fullscreen Below'
];


const standardModuleNames: string[] = [
  // not using this for anything for now. just have it here for ref.
  "alert",
  "updatenotification",
  "clock",
  "calendar",
  "compliments",
  "weather",
  "newsfeed"
];