export const modulePositionOptions = [
  // could make this module positions into an enum, if we want to send ints
  // for positions instead of the strings. but I doubt message size will matter
  // that much.
  'top_bar',
  'top_left',
  'top_center',
  'top_right',
  'upper_third',
  'middle_center',
  'lower_third',
  'bottom_left',
  'bottom_center',
  'bottom_right',
  'bottom_bar',
  'fullscreen_above',
  'fullscreen_below'
];

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

