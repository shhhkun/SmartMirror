import React, {
  FC,
  PropsWithChildren,
  useEffect,
} from "react";

import {
  ModuleContext,
  defaultModuleContext
} from "./ModuleContext";

const ModuleProvider: FC<PropsWithChildren<{}>> = ({ children }) => {

  // constructor-like thing that runs when context is created
  useEffect(() => {
    // eventually, could pull in data from saved state here.
    console.log("Module provider mounted");
  }, []);

  // return the context provider
  const value = {
    // idk what I'm doing here with the default context.
    // this should probably pull the states from some state variables
    // declared at the top of this component.
    ...defaultModuleContext,
  };

  return (
    <ModuleContext.Provider value={value}>
      {children}
    </ModuleContext.Provider>
  );
}

export default ModuleProvider;