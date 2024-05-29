import {
  createContext
} from 'react';



interface ModuleConfiguration {
}

interface ModuleContextType {
  trueModuleConfiguration: ModuleConfiguration;
  draftModuleConfiguration: ModuleConfiguration;
}

const defaultModuleConfiguration: ModuleConfiguration = {
};

export const defaultModuleContext: ModuleContextType = {
  trueModuleConfiguration: defaultModuleConfiguration,
  draftModuleConfiguration: defaultModuleConfiguration,
};

export const ModuleContext = createContext<ModuleContextType>(
  defaultModuleContext);