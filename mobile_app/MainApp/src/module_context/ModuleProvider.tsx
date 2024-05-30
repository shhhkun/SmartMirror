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
  lookupCharacteristics,
  deserializeReceivedData
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
    writeByteArrayToAnyCharacteristic,
    readFromAnyCharacteristic
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

    // assume we're using display name in the mobile-app-side config file
    const moduleName: string = singleModule.moduleDisplayName;

    setDraftModuleConfiguration(
      {
        ...draftModuleConfiguration,
        [moduleName]: singleModule
      }
    );
  };

  const readSingleModuleConfigFromMirror = async (
    moduleName: string): Promise<SingleModuleConfiguration> => {
    // read the enablement and position characteristics for a single
    // module from the mirror.

    // look up which characteristics belong to this module
    const charsForThisModule: Map<string, string> = lookupCharacteristics(moduleName);
    const enableChar: string = charsForThisModule.get('enable') as string;
    const positionChar: string = charsForThisModule.get('position') as string;

    // read from both characteristics and stash the data in variables
    let enableData: number[];
    let positionData: number[];
    try {
      enableData = await readFromAnyCharacteristic(enableChar);
      positionData = await readFromAnyCharacteristic(positionChar);
    } catch (error) {
      console.error("Error reading single module config from mirror", error);
      throw error;
    }

    // deserialize the data into a SingleModuleConfiguration object
    const newSingleModuleConfig: SingleModuleConfiguration = deserializeReceivedData(
      enableData, positionData, moduleName
    );

    return newSingleModuleConfig;
  };

  const readFullConfigFromMirror = async (): Promise<void> => {
    // read all the module configs from the mirror sequentially.
    // write them to draftModuleConfiguration. then upon all of them succeeding,
    // write them to trueModuleConfiguration and reset draftModuleConfiguration.

    // foreach through the full module config's main module items,
    // like "Alerts", "Clock", etc.
    // I'm doing this over the modules in trueModuleConfiguration,
    // in order to avoid any weirdness about iterating over
    // draftModuleConfiguration while it's also being modified.
    Object.keys(trueModuleConfiguration).forEach(async key => {

      const thisModulesDisplayName: string =
        trueModuleConfiguration[key].moduleDisplayName;

      try {
        // do the actual read operation for this single module
        const singleConfigCreatedFromRead: SingleModuleConfiguration =
          await readSingleModuleConfigFromMirror(thisModulesDisplayName)

        // update the draft config with the new data
        updateDraftConfigWithSingleModule(singleConfigCreatedFromRead);

      } catch (error) {
        console.error("Error reading a single module config from mirror", error);

        // todo: I think this throw is not actually throwing to the real caller
        // of readFullConfigFromMirror. I think it's just throwing to the
        // function inside the forEach. I think I need to do something like
        // this:
        // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
        throw error;
      }

    });

    // assuming all the reads succeeded, save the draft config to the true config
    saveDraftConfigToTrueConfig();
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