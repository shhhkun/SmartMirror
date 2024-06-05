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

// no longer using
export enum modulePositionOptionsEnum {
  top_bar = 0,
  top_left,
  top_center,
  top_right,
  upper_third,
  middle_center,
  lower_third,
  bottom_left,
  bottom_center,
  bottom_right,
  bottom_bar,
  fullscreen_above,
  fullscreen_below
};

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

// no longer using
export const modulePositionDisplayToEnumMap: Record<string, modulePositionOptionsEnum> = {
  'Top Bar': modulePositionOptionsEnum.top_bar,
  'Top Left': modulePositionOptionsEnum.top_left,
  'Top Center': modulePositionOptionsEnum.top_center,
  'Top Right': modulePositionOptionsEnum.top_right,
  'Upper Third': modulePositionOptionsEnum.upper_third,
  'Middle Center': modulePositionOptionsEnum.middle_center,
  'Lower Third': modulePositionOptionsEnum.lower_third,
  'Bottom Left': modulePositionOptionsEnum.bottom_left,
  'Bottom Center': modulePositionOptionsEnum.bottom_center,
  'Bottom Right': modulePositionOptionsEnum.bottom_right,
  'Bottom Bar': modulePositionOptionsEnum.bottom_bar,
  'Fullscreen Above': modulePositionOptionsEnum.fullscreen_above,
  'Fullscreen Below': modulePositionOptionsEnum.fullscreen_below
};


const standardModuleNames: string[] = [
  // not using this for anything for now.
  "alert",
  "updatenotification",
  "clock",
  "calendar",
  "compliments",
  "weather",
  "newsfeed"
];