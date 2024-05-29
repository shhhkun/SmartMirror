// file of stuff that doesn't need the bluetooth context or manager library

// library imports
import { Peripheral, PeripheralInfo } from 'react-native-ble-manager';

// my imports
import {
  TargetInfos,
  CharacteristicsMap,
  defaultBluetoothContext
} from './BluetoothContext';



export function selectOurDeviceFromBondedDevices(
  peripheralsArray: Peripheral[]): Peripheral {
  // get our specific device from the list of bonded devices.
  // for now, this just selects the first device in the list.
  // eventially this will be based on some kind of manufaturer ID or something
  // specific to our device.

  if (peripheralsArray.length === 0) {
    throw new Error('No bonded devices found');
  }

  // go through our list of saved devices. if one of our saved names is in the
  // bonded devices list, select that one.
  for (let thisPeripheral of peripheralsArray) {
    if (thisPeripheral.name && savedDeviceNames.includes(thisPeripheral.name)) {
      return thisPeripheral;
    }
  }

  // if not found, just return the first peripheral in the list
  return peripheralsArray[0];
}

export function selectTargetServiceAndCharacteristic(
  appConnectedPeripheralInfo: PeripheralInfo): TargetInfos {
  // select our specific service and characteristic from the lists of services
  // and characteristics.


  const deviceID: string = appConnectedPeripheralInfo?.id ||
    defaultBluetoothContext.targetInfos.targetDeviceID;

  // eventually can set service and characteristic based on their descriptions
  // or positions in arrays. but for now, just have them hard-coded.
  const serviceUUID: string =
    savedServiceUUIDs.erikLightblueService;

  const characteristicUUID: string =
    savedCharacteristicUUIDs.erikLightChar;


  const outputTargetInfos: TargetInfos = {
    targetDeviceID: deviceID,
    targetServiceUUID: serviceUUID,
    targetCharacteristicUUID: characteristicUUID
  };
  return outputTargetInfos;
}

export function parseModuleNamesAndCharacteristics(
  peripheralInfo: PeripheralInfo): CharacteristicsMap {
  // todo: make this not hard coded

  // for now, this will just return some hard-coded module names and UUIDs.
  const moduleNamesAndCharacteristics: CharacteristicsMap = {
    "Clock": savedCharacteristicUUIDs.erikLightCharModu1,
    "Weather": savedCharacteristicUUIDs.erikLightCharModu2
  }

  return moduleNamesAndCharacteristics;
}



const savedDeviceNames: string[] = [
  'erik_lightblue',
  'Blank'
];

const enum savedServiceUUIDs {
  erikLightblueService = '1111',
  serjoProfileService = '00000001-710e-4a5b-8d75-3e5b444bc3cf'
}

const enum savedCharacteristicUUIDs {
  erikLightChar = '2222',
  serjoProfileChar = '00000002-710e-4a5b-8d75-3e5b444bc3cf',

  erikLightCharModu1 = '3333',
  erikLightCharModu2 = '4444',
}

export const moduleCharacteristicsHardCoded: any = {
  // this uses the display names of the modules as the main item names!
  // pretty to jank to have this hard-coded. but should be ok if
  // we're just using the single pi and the characteristics don't change.

  "Alerts": {
    "enable": "????",
    "position": "????"
  },
  "Clock": {
    "enable": "????",
    "position": "????"
  },
  "Notifications": {
    "enable": "????",
    "position": "????"
  },
  "Calendar": {
    "enable": "????",
    "position": "????"
  },
  "Compliments": {
    "enable": "????",
    "position": "????"
  },
  "Weather": {
    "enable": "????",
    "position": "????"
  },
  "News": {
    "enable": "????",
    "position": "????"
  }
}

