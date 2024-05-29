export const modulePositionOptions = [
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

export const modulePositionOptionsEnum = {
  // actually using this now, since we're sending ints only to the mirror.
  'top_bar': 1,
  'top_left': 2,
  'top_center': 3,
  'top_right': 4,
  'upper_third': 5,
  'middle_center': 6,
  'lower_third': 7,
  'bottom_left': 8,
  'bottom_center': 9,
  'bottom_right': 10,
  'bottom_bar': 11,
  'fullscreen_above': 12,
  'fullscreen_below': 13
} as const;

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

