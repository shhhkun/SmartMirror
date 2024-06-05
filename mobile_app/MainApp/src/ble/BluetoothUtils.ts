// file of stuff that doesn't need the bluetooth context or manager library

// library imports
import {
  Peripheral,
  PeripheralInfo
} from 'react-native-ble-manager';

// my imports
import {
  TargetInfos,
  // CharacteristicsMap,
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

// not using this rn
{
  // export function parseModuleNamesAndCharacteristics(
  //   peripheralInfo: PeripheralInfo): CharacteristicsMap {
  //   // todo: make this not hard coded

  //   // for now, this will just return some hard-coded module names and UUIDs.
  //   const moduleNamesAndCharacteristics: CharacteristicsMap = {
  //     "Clock": savedCharacteristicUUIDs.erikLightCharModu1,
  //     "Weather": savedCharacteristicUUIDs.erikLightCharModu2
  //   }

  //   return moduleNamesAndCharacteristics;
  // }
}



const savedDeviceNames: string[] = [
  // 'erik_lightblue',
  'raspberrypi',
  'Blank',
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

  // main target (for profile control) = "00000002-710e-4a5b-8d75-3e5b444bc3cf"

  // language characteristic (unsuported rn) = "00000003-710e-4a5b-8d75-3e5b444bc3cf"
  // units characteristic (unsupported rn) = "00000004-710e-4a5b-8d75-3e5b444bc3cf"

  // not supporting changing alerts at the moment
  // "Alerts": {
  //   "enable": "0002",
  //   "position": "0003"
  // },

  "Clock": {
    "enable": "00000006-710e-4a5b-8d75-3e5b444bc3cf",
    "position": "00000005-710e-4a5b-8d75-3e5b444bc3cf"
  },
  "Notifications": {
    "enable": "0000000A-710e-4a5b-8d75-3e5b444bc3cf",
    "position": "00000009-710e-4a5b-8d75-3e5b444bc3cf"
  },
  "Calendar": {
    "enable": "0000000C-710e-4a5b-8d75-3e5b444bc3cf",
    "position": "0000000B-710e-4a5b-8d75-3e5b444bc3cf"
  },
  "Compliments": {
    "enable": "0000000E-710e-4a5b-8d75-3e5b444bc3cf",
    "position": "0000000D-710e-4a5b-8d75-3e5b444bc3cf"
  },
  "Weather": {
    "enable": "0000001F-710e-4a5b-8d75-3e5b444bc3cf",
    "position": "0000000F-710e-4a5b-8d75-3e5b444bc3cf"
  },
  "News": {
    "enable": "0000003F-710e-4a5b-8d75-3e5b444bc3cf",
    "position": "0000002F-710e-4a5b-8d75-3e5b444bc3cf"
  },
}

// module characteristics for when testing in Erik's lightblue
// export const moduleCharacteristicsHardCoded: any = {
//   // this uses the display names of the modules as the main item names!
//   // pretty to jank to have this hard-coded. but should be ok if
//   // we're just using the single pi and the characteristics don't change.

//   // main target (for profile control) = "2222"

//   // not messing with alerts at the moment.
//   // "Alerts": {
//   //   "enable": "0002",
//   //   "position": "0003"
//   // },

//   "Clock": {
//     "enable": "0004",
//     "position": "0005"
//   },
//   "Notifications": {
//     "enable": "0006",
//     "position": "0007"
//   },
//   "Calendar": {
//     "enable": "0008",
//     "position": "0009"
//   },
//   "Compliments": {
//     "enable": "0010",
//     "position": "0011"
//   },
//   "Weather": {
//     "enable": "0012",
//     "position": "0013"
//   },
//   "News": {
//     "enable": "0014",
//     "position": "0015"
//   }
// }

