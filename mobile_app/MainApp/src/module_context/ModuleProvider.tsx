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



  // functions for messing with states
  const saveDraftConfigToTrueConfig = () => {
    setTrueModuleConfiguration(draftModuleConfiguration);
  };

  const resetConfigsToDefault = () => {
    setTrueModuleConfiguration(defaultModuleContext.trueModuleConfiguration);
    setDraftModuleConfiguration(defaultModuleContext.draftModuleConfiguration);
  };



  // functions for reading and writing to the mirror
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

      // printout for successfull write
      console.log(moduleName + " updated via chars " +
        JSON.stringify([...characteristics]) + " and data " +
        JSON.stringify([...dataToSend]));
      console.log("---------------------------------");

    } catch (error) {
      console.error("Error writing single module config to mirror", error);
      throw error;
    }
  }

  const writeFullConfigToMirror = async () => {
    // write all the module configs to the mirror sequentially.
    // pulling from trueModuleConfiguration

    // iterate over each module in the trueModuleConfiguration
    for (const [moduleObjectName, moduleSingleConfig] of
      Object.entries(trueModuleConfiguration)) {

      try {
        // do the write operation for this single module
        await writeSingleModuleConfigToMirror(moduleSingleConfig);
      } catch (error) {
        console.error("Error writing single module config to mirror", error);
        throw error;
      }
    }
  };

  const updateDraftConfigWithSingleModule = (
    singleModule: SingleModuleConfiguration): void => {
    // todo
  }

  // not yet implemented
  const readSingleModuleConfigFromMirror = async (
    moduleName: string): Promise<SingleModuleConfiguration> => {
    // try reading the enablement and position for a single module from the mirror


    // this should first look up the characteristics for this module name,
    // probably with the lookupCharacteristics function.

    // then read both those charactersitcs and put them in variables.

    // then call the main deserialize function to deserialize those and form a
    // SingleModuleConfiguration object.


    // todo
    console.error("readSingleModuleConfigFromMirror not implemented");
    return defaultModuleContext.trueModuleConfiguration[moduleName];
  };

  // not yet implemented
  const readFullConfigFromMirror = async (): Promise<void> => {
    // read all the module configs from the mirror sequentially.
    // write them to draftModuleConfiguration. then upon all of them succeeding,
    // write them to trueModuleConfiguration and reset draftModuleConfiguration.


    // this should call the following in a loop 7 times,
    // depending on the number of modules we know about:
    //   call readSingleModuleConfigFromMirror
    //   then updateDraftConfigWithSingleModule

    // if all of them succeed, then call saveDraftConfigToTrueConfig.
    // otherwise, maybe display some error.


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