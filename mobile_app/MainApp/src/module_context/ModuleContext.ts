import {
  createContext
} from 'react';

export interface SystemSettingsFullConfiguration {
  language: string;
  units: string;
}

export interface SingleModuleConfiguration {
  moduleInternalName: string;
  moduleDisplayName: string;
  moduleEnabled: boolean;
  modulePosition: string;
}

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
}

export interface FullSingleUserConfiguration {
  // all of the specific settings for a single user.
  usersSystemSettings: SystemSettingsFullConfiguration;
  usersFullModuleConfiguration: FullModuleConfiguration;
}

// not using yet.
export interface AllUsersFullConfigurations {
  // some kind of dict that maps unique user ID strigns to their user configs.
  [userId: string]: FullSingleUserConfiguration;
}

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
}

const defaultModuleConfiguration: FullModuleConfiguration = {
  // not supporting changing alerts at the moment
  // alert: {
  //   moduleInternalName: "alert",
  //   moduleDisplayName: "Alerts",
  //   moduleEnabled: true,
  //   modulePosition: 'top_left'
  // },
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