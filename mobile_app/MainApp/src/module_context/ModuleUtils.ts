import {
  modulePositionOptionsEnum
} from '../common/StandardModuleInfo';
import {
  moduleCharacteristicsHardCoded
} from '../ble/BluetoothUtils';
import {
  SingleModuleConfiguration
} from './ModuleContext';


export const prepareDataToSend = (
  enableData: boolean, positionData: string): Map<string, number[]> => {
  // returns a dictionary of the form:
  // {
  //   'enable': [1],
  //   'position': [6]
  // }

  const dataToSend: Map<string, number[]> = new Map();

  const enableByteArray: number[] = [enableData ? 1 : 0];
  dataToSend.set('enable', enableByteArray);

  // convert the position string to the enum value.
  // need that weird typeof thing to make type checker not complain.
  const positionEnumValue: number = modulePositionOptionsEnum[
    positionData as keyof typeof modulePositionOptionsEnum];

  const positionByteArray: number[] = [positionEnumValue];
  dataToSend.set('position', positionByteArray);

  return dataToSend;
};

export const lookupCharacteristics = (
  moduleName: string): Map<string, string> => {
  // returns a dictionary of the form:
  // {
  //   'enable': 'characteristicUUID',
  //   'position': 'characteristicUUID'
  // }

  if (!(moduleName in moduleCharacteristicsHardCoded)) {
    throw new Error("Don't have a saved characteristic(s) for this module name");
  }

  const enableChar: string = moduleCharacteristicsHardCoded[moduleName].enable;
  const positionChar: string = moduleCharacteristicsHardCoded[moduleName].position;

  const outputMap: Map<string, string> = new Map();
  outputMap.set('enable', enableChar);
  outputMap.set('position', positionChar);
  return outputMap;
};

// not yet implemented below here
const deserializeEnableData = (enableData: number[]): boolean => {
  return false;
};

const deserializePositionData = (positionData: number[]): string => {
  return "";
}

export const deserializeReceivedData = (
  enableData: number[], positionData: number[], moduleDisplayName: string):
  SingleModuleConfiguration => {
  // takes in serialized data for enable and position, and the name
  // of the module these characteristics correspond to. returns a
  // SingleModuleConfiguration object.

  throw new Error("Not implemented yet");
};
