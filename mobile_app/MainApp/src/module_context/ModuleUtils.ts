import {
  modulePositionsMap
} from '../common/StandardModuleInfo';
import {
  moduleCharacteristicsHardCoded
} from '../ble/BluetoothUtils';
import {
  SingleModuleConfiguration,
  FullModuleConfiguration
} from './ModuleContext';



const serializeEnableData = (enableData: boolean): number[] => {
  // convert this "enabled" bool into a "disabled" [int]

  const disabledValue: boolean = !enableData;

  const outputInt: number = disabledValue ? 1 : 0;
  return [outputInt];
};

const serializePositionData = (
  positionDisplayString: string): number[] => {
  // convert this position string to an int, based on the positions map

  if (!(positionDisplayString in modulePositionsMap)) {
    throw new Error("Don't have a saved position for display string " +
      positionDisplayString);
  }

  const positionEnumValue: number = modulePositionsMap[positionDisplayString];

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
    positionData);

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
  // need to fix this based to use the new map (no longer enum)

  // deserialize this position int based on the position options enum

  const positionPureNumber: number = positionData[0];

  // look up the string corresponding to this number in the positions map
  const positionString: string = Object.keys(modulePositionsMap).find(
    key => modulePositionsMap[key] === positionPureNumber) || '';

  return positionString;
};

const getInternalNameFromDisplayName = (
  displayName: string, trueModuleConfig: FullModuleConfiguration): string => {
  // should just stop using this and only use display names.
  // doesn't sound like we're ever going to be getting internal names
  // from the mirror.

  // iterate over each module in the trueModuleConfiguration
  for (const [moduleObjectName, moduleSingleConfig] of
    Object.entries(trueModuleConfig)) {

    if (moduleSingleConfig.moduleDisplayName === displayName) {
      return moduleObjectName;
    }
  }

  throw new Error("Couldn't find internal module name for this display name");
};

export const deserializeReceivedData = (
  enableData: number[], positionData: number[], moduleDisplayName: string,
  trueModuleConfig: FullModuleConfiguration):
  SingleModuleConfiguration => {
  // takes in serialized data for enable and position, and the name
  // of the module these characteristics correspond to. returns a
  // SingleModuleConfiguration object.
  // needs trueModuleConfig to look up the internal name from the display
  // name, which is pretty jank. would want to refactor eventually.

  const deserializedEnableData: boolean = deserializeEnableData(enableData);
  const deserializedPositionData: string = deserializePositionData(positionData);

  const internalModuleName: string = getInternalNameFromDisplayName(
    moduleDisplayName, trueModuleConfig);

  const outputConfig: SingleModuleConfiguration = {
    moduleInternalName: internalModuleName,
    moduleDisplayName: moduleDisplayName,
    moduleEnabled: deserializedEnableData,
    modulePosition: deserializedPositionData
  };

  return outputConfig;
};
