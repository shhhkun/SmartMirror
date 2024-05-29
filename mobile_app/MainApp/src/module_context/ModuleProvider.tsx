import React, {
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

import {
  ModuleContext,
  defaultModuleContext
} from "./ModuleContext";

const ModuleProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [trueModuleConfiguration, setTrueModuleConfiguration] =
    useState(defaultModuleContext.trueModuleConfiguration);
  const [draftModuleConfiguration, setDraftModuleConfiguration] =
    useState(defaultModuleContext.draftModuleConfiguration);



  // todo: method to write a full config to the mirror

  // todo: method to read a full config from the mirror



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
  };

  return (
    <ModuleContext.Provider value={value}>
      {children}
    </ModuleContext.Provider>
  );
}

export default ModuleProvider;