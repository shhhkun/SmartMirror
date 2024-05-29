import React, {
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  ModuleContext,
  defaultModuleContext,
  SingleModuleConfiguration,
  FullModuleConfiguration
} from "./ModuleContext";
import {
  prepareDataToSend,
  lookupCharacteristics
} from "./ModuleUtils";
import {
  BluetoothContext
} from "../ble/BluetoothContext";
import {
  moduleCharacteristicsHardCoded
} from "../ble/BluetoothUtils";

const ModuleProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  // state stuff for this context
  const [trueModuleConfiguration, setTrueModuleConfiguration] =
    useState(defaultModuleContext.trueModuleConfiguration);
  const [draftModuleConfiguration, setDraftModuleConfiguration] =
    useState(defaultModuleContext.draftModuleConfiguration);

  // parts of bluetooth context needed by functions in this context
  const {
    writeByteArrayToAnyCharacteristic
  } = useContext(BluetoothContext);


  const saveDraftConfigToTrueConfig = () => {
    setTrueModuleConfiguration(draftModuleConfiguration);
  };

  const resetConfigsToDefault = () => {
    setTrueModuleConfiguration(defaultModuleContext.trueModuleConfiguration);
    setDraftModuleConfiguration(defaultModuleContext.draftModuleConfiguration);
  };

  const writeSingleModuleConfigToMirror = async (
    singleModule: SingleModuleConfiguration): Promise<void> => {
    // try writing the enablement and position for a single module to the mirror.
    // I'm using the module display name for this lookup.

    const moduleName: string = singleModule.moduleDisplayName;

    const characteristics: Map<string, string> =
      lookupCharacteristics(moduleName);

    const dataToSend: Map<string, number[]> =
      prepareDataToSend(singleModule.moduleEnabled, singleModule.modulePosition);

    try {
      // write the enablement
      await writeByteArrayToAnyCharacteristic(
        dataToSend.get('enable') as number[],
        characteristics.get('enable') as string
      );

      // write the position
      await writeByteArrayToAnyCharacteristic(
        dataToSend.get('position') as number[],
        characteristics.get('position') as string
      );

    } catch (error) {
      console.error("Error writing single module config to mirror", error);
    }
  }





  const readSingleModuleConfigFromMirror = async (
    moduleName: string): Promise<SingleModuleConfiguration> => {
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
    const newDraftConfig: FullModuleConfiguration = {};
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