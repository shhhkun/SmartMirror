import {
  modulePositionOptionsEnum
} from '../common/StandardModuleInfo';
import {
  moduleCharacteristicsHardCoded
} from '../ble/BluetoothUtils';
import {
  SingleModuleConfiguration
} from './ModuleContext';

const serializeEnableData = (enableData: boolean): number[] => {
  // serialize this bool into a [0] or [1]

  const outputNumber: number = enableData ? 1 : 0;
  return [outputNumber];
};

const serializePositionData = (
  positionData: keyof typeof modulePositionOptionsEnum): number[] => {
  // serialize this position string based on the position options enum

  const positionEnumValue: number = modulePositionOptionsEnum[positionData];
  return [positionEnumValue];
};

export const prepareDataToSend = (
  enableData: boolean, positionData: string): Map<string, number[]> => {
  // returns a dictionary of the form:
  // {
  //   'enable': [1],
  //   'position': [6]
  // }

  const serializedEnableData: number[] = serializeEnableData(
    enableData);

  const serializedPositionData: number[] = serializePositionData(
    positionData as keyof typeof modulePositionOptionsEnum);

  const dataToSend: Map<string, number[]> = new Map();
  dataToSend.set('enable', serializedEnableData);
  dataToSend.set('position', serializedPositionData);

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

const deserializeEnableData = (enableData: number[]): boolean => {
  const outputValue: boolean = enableData[0] === 1;
  return outputValue;
};

const deserializePositionData = (positionData: number[]): string => {
  // deserialize this position int based on the position options enum

  const positionEnumValue: number = positionData[0];

  const positionString: string = modulePositionOptionsEnum[positionEnumValue];

  return positionString;
};

// not implemented yet
export const deserializeReceivedData = (
  enableData: number[], positionData: number[], moduleDisplayName: string):
  SingleModuleConfiguration => {
  // takes in serialized data for enable and position, and the name
  // of the module these characteristics correspond to. returns a
  // SingleModuleConfiguration object.

  const deserializedEnableData: boolean = deserializeEnableData(enableData);
  const deserializedPositionData: string = deserializePositionData(positionData);

  // look up the internal name of the module based on the display name.
  // might want this function to accept the FullModuleConfiguration object
  // so that it can look up in there.
  // moduleInternalName: string;
  // moduleDisplayName: string;

  throw new Error("Not implemented yet");
};
