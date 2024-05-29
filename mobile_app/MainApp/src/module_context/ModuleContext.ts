import {
  createContext
} from 'react';

interface SingleModuleConfiguration {
  moduleInternalName: string;
  moduleDisplayName: string;
  moduleEnabled: boolean;
  modulePosition: string;

  // not implemented right now, but for when the user will be able to set
  // their weather location or something.
  specificModuleConfiguration?: any;
}

interface FullModuleConfiguration {
  // this is a dictionary of module names to their configurations
  [moduleName: string]: SingleModuleConfiguration;
}

interface ModuleContextType {
  trueModuleConfiguration: FullModuleConfiguration;
  draftModuleConfiguration: FullModuleConfiguration;
}

const defaultModuleConfiguration: FullModuleConfiguration = {
  "alert": {
    moduleInternalName: "alert",
    moduleDisplayName: "Alerts",
    moduleEnabled: false,
    modulePosition: 'top_bar'
  },
  "updatenotification": {
    moduleInternalName: "updatenotification",
    moduleDisplayName: "Notifications",
    moduleEnabled: false,
    modulePosition: 'top_left'
  },
  "clock": {
    moduleInternalName: "clock",
    moduleDisplayName: "Clock",
    moduleEnabled: true,
    modulePosition: 'top_center'
  },
  "calendar": {
    moduleInternalName: "calendar",
    moduleDisplayName: "Calendar",
    moduleEnabled: false,
    modulePosition: 'top_right'
  },
  "compliments": {
    moduleInternalName: "compliments",
    moduleDisplayName: "Compliments",
    moduleEnabled: true,
    modulePosition: 'upper_third'
  },
  "weather": {
    moduleInternalName: "weather",
    moduleDisplayName: "Weather",
    moduleEnabled: true,
    modulePosition: 'middle_center'
  },
  "newsfeed": {
    moduleInternalName: "newsfeed",
    moduleDisplayName: "News",
    moduleEnabled: true,
    modulePosition: 'lower_third'
  }
};



export const defaultModuleContext: ModuleContextType = {
  trueModuleConfiguration: defaultModuleConfiguration,
  draftModuleConfiguration: defaultModuleConfiguration,
};

export const ModuleContext = createContext<ModuleContextType>(
  defaultModuleContext);