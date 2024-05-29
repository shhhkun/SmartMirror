import React, {
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

import {
  ModuleContext,
  defaultModuleContext,
  SingleModuleConfiguration,
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

  const writeSingleModuleConfigToMirror = async (
    singleModule: SingleModuleConfiguration): Promise<void> => {
    // try writing the enablement and position for a single module to the mirror

    // todo
    console.error("writeSingleModuleConfigToMirror not implemented");
  };

  const readSingleModuleConfigFromMirror = async (moduleName: string): Promise<SingleModuleConfiguration> => {
    // try reading the enablement and position for a single module from the mirror

    // todo
    console.error("readSingleModuleConfigFromMirror not implemented");
    return defaultModuleContext.trueModuleConfiguration[moduleName];
  }

  const writeFullConfigToMirror = async () => {
    // write all the module configs to the mirror sequentially.
    // pulling from trueModuleConfiguration

    // todo
  };

  const readFullConfigFromMirror = async (): Promise<void> => {
    // read all the module configs from the mirror sequentially.
    // write them to draftModuleConfiguration. then upon all of them succeeding,
    // write them to trueModuleConfiguration and reset draftModuleConfiguration.

    // todo
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