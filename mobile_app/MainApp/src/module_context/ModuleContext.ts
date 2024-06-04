import {
  createContext
} from 'react';

export interface SingleModuleConfiguration {
  moduleInternalName: string;
  moduleDisplayName: string;
  moduleEnabled: boolean;
  modulePosition: string;
};

export interface FullModuleConfiguration {
  // this is a dictionary of module names to their configurations. of the form:
  // {
  //   "ModuleName": {
  //     moduleInternalName: "ModuleName",
  //     moduleDisplayName: "Module Display Name",
  //     moduleEnabled: true,
  //     modulePosition: "top_bar"
  //   }
  // }

  [moduleName: string]: SingleModuleConfiguration;
};

// might want a new attribute in the context for system settings. for language
// and units.

interface ModuleContextType {
  trueModuleConfiguration: FullModuleConfiguration;
  draftModuleConfiguration: FullModuleConfiguration;
  setTrueModuleConfiguration: (newConfig: FullModuleConfiguration) => void;
  setDraftModuleConfiguration: (newConfig: FullModuleConfiguration) => void;

  // eventually could have an attribute for last read/written config.
  // and then the send to mirror command would only send things that have
  // changed. not going to implement for now, but could do if latency on writes
  // is an issue.

  saveDraftConfigToTrueConfig: () => void;
  resetConfigsToDefault: () => void;
  writeFullConfigToMirror: () => Promise<void>;
  readFullConfigFromMirror: () => Promise<void>;
};

// new defaultModuleConfiguration for testing.
const defaultModuleConfiguration: FullModuleConfiguration = {
  alert: {
    moduleInternalName: "alert",
    moduleDisplayName: "Alerts",
    moduleEnabled: true,
    modulePosition: 'top_left'
  },
  updatenotification: {
    moduleInternalName: "updatenotification",
    moduleDisplayName: "Notifications",
    moduleEnabled: true,
    modulePosition: 'top_left'
  },
  clock: {
    moduleInternalName: "clock",
    moduleDisplayName: "Clock",
    moduleEnabled: true,
    modulePosition: 'top_left'
  },
  calendar: {
    moduleInternalName: "calendar",
    moduleDisplayName: "Calendar",
    moduleEnabled: true,
    modulePosition: 'top_left'
  },
  compliments: {
    moduleInternalName: "compliments",
    moduleDisplayName: "Compliments",
    moduleEnabled: true,
    modulePosition: 'top_left'
  },
  weather: {
    moduleInternalName: "weather",
    moduleDisplayName: "Weather",
    moduleEnabled: true,
    modulePosition: 'top_left'
  },
  newsfeed: {
    moduleInternalName: "newsfeed",
    moduleDisplayName: "News",
    moduleEnabled: true,
    modulePosition: 'top_left'
  }
};

// old defaultModuleConfiguration
{
  // const defaultModuleConfiguration: FullModuleConfiguration = {
  //   alert: {
  //     moduleInternalName: "alert",
  //     moduleDisplayName: "Alerts",
  //     moduleEnabled: false,
  //     modulePosition: 'top_bar'
  //   },
  //   updatenotification: {
  //     moduleInternalName: "updatenotification",
  //     moduleDisplayName: "Notifications",
  //     moduleEnabled: false,
  //     modulePosition: 'top_left'
  //   },
  //   clock: {
  //     moduleInternalName: "clock",
  //     moduleDisplayName: "Clock",
  //     moduleEnabled: true,
  //     modulePosition: 'top_center'
  //   },
  //   calendar: {
  //     moduleInternalName: "calendar",
  //     moduleDisplayName: "Calendar",
  //     moduleEnabled: false,
  //     modulePosition: 'top_right'
  //   },
  //   compliments: {
  //     moduleInternalName: "compliments",
  //     moduleDisplayName: "Compliments",
  //     moduleEnabled: true,
  //     modulePosition: 'upper_third'
  //   },
  //   weather: {
  //     moduleInternalName: "weather",
  //     moduleDisplayName: "Weather",
  //     moduleEnabled: true,
  //     modulePosition: 'middle_center'
  //   },
  //   newsfeed: {
  //     moduleInternalName: "newsfeed",
  //     moduleDisplayName: "News",
  //     moduleEnabled: true,
  //     modulePosition: 'lower_third'
  //   }
  // };
}

export const defaultModuleContext: ModuleContextType = {
  trueModuleConfiguration: defaultModuleConfiguration,
  draftModuleConfiguration: defaultModuleConfiguration,
  setTrueModuleConfiguration: () => {
    throw new Error("setTrueModuleConfiguration not ready yet.");
  },
  setDraftModuleConfiguration: () => {
    throw new Error("setDraftModuleConfiguration not ready yet.");
  },
  saveDraftConfigToTrueConfig: () => {
    throw new Error("saveDraftConfigToTrueConfig not ready yet.");
  },
  resetConfigsToDefault: () => {
    throw new Error("resetTrueConfigToDefault not ready yet.");
  },
  writeFullConfigToMirror: () => {
    throw new Error("writeFullConfigToMirror not ready yet.");
  },
  readFullConfigFromMirror: () => {
    throw new Error("readFullConfigFromMirror not ready yet.");
  }
};

export const ModuleContext = createContext<ModuleContextType>(
  defaultModuleContext);