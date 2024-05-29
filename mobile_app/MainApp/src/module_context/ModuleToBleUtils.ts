import { useContext } from "react";

import {
  FullModuleConfiguration,
  defaultModuleContext
} from "./ModuleContext";
import {
  BluetoothContext
} from "../ble/BluetoothContext";




export const writeWriteFullConfigToPeripheral = async (
  moduleConfig: FullModuleConfiguration) => {
  // todo

  await writeByteArrayToAnyCharacteristic([1], '2222');
  console.error("writeWriteFullConfigToPeripheral not implemented");
}

export const readFullConfigFromPeripheral = async ():
  Promise<FullModuleConfiguration> => {

  // todo
  console.error("readFullConfigFromPeripheral not implemented");
  return defaultModuleContext.trueModuleConfiguration;
}