import React, {
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

import {
  ModuleContext,
  defaultModuleContext,
  FullModuleConfiguration
} from "./ModuleContext";

const ModuleProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [trueModuleConfiguration, setTrueModuleConfiguration] =
    useState(defaultModuleContext.trueModuleConfiguration);
  const [draftModuleConfiguration, setDraftModuleConfiguration] =
    useState(defaultModuleContext.draftModuleConfiguration);


  const saveDraftConfigToTrueConfig = () => {
    setTrueModuleConfiguration(draftModuleConfiguration);
  };

  const resetConfigsToDefault = () => {
    setTrueModuleConfiguration(defaultModuleContext.trueModuleConfiguration);
    setDraftModuleConfiguration(defaultModuleContext.draftModuleConfiguration);
  };

  const writeFullConfigToMirror = (moduleConfig: FullModuleConfiguration) => {
    // todo
  };

  const readFullConfigFromMirror = (): FullModuleConfiguration => {
    // todo
    return defaultModuleContext.trueModuleConfiguration;
  };



  // constructor-like thing that runs when context is created
  useEffect(() => {
    // eventually, could pull in data from saved state here.
    console.log("Module provider mounted");
  }, []);

  // return the context provider
  const value = {
    trueModuleConfiguration,
    draftModuleConfiguration,
    setDraftModuleConfiguration,
    setTrueModuleConfiguration,

    saveDraftConfigToTrueConfig,
    resetConfigsToDefault,
    writeFullConfigToMirror,
    readFullConfigFromMirror
  };

  return (
    <ModuleContext.Provider value={value}>
      {children}
    </ModuleContext.Provider>
  );
}

export default ModuleProvider;