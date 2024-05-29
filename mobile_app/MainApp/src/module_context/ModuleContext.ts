import {
  createContext
} from 'react';

interface SingleModuleConfiguration {
  moduleName: string;
  modulePosition: string;

  // not implemented right now, but for when the user will be able to set
  // their weather location or something.
  specificModuleConfiguration?: any;
}

const standardModuleNames = [
  "alert",
  "updatenotification",
  "clock",
  "calendar",
  "compliments",
  "weather",
  "newsfeed"
];

interface FullModuleConfiguration {
  // I'm not sure what I want to do in here. Not sure if this should be
  // an object or a dictionary or what.
  // I think this should be a dictionary, and then in the default configuration
  // I'll build the dictionary with all the module names and some arbitrary
  // default positions.

  // [moduleName: string]: SingleModuleConfiguration;
}

interface ModuleContextType {
  trueModuleConfiguration: FullModuleConfiguration;
  draftModuleConfiguration: FullModuleConfiguration;
}

const defaultModuleConfiguration: FullModuleConfiguration = {
};

export const defaultModuleContext: ModuleContextType = {
  trueModuleConfiguration: defaultModuleConfiguration,
  draftModuleConfiguration: defaultModuleConfiguration,
};

export const ModuleContext = createContext<ModuleContextType>(
  defaultModuleContext);