import {
  Buffer
} from 'buffer';
import { Peripheral, PeripheralInfo } from 'react-native-ble-manager';

import {
  TargetInfos,
  defaultBluetoothContext
} from './BluetoothContext';

// functions that don't need to touch the context states or the BLE manager
// directly. for selecting from lists of peripherals, services, etc. and
// serialization stuff.

export function selectOurDeviceFromBondedDevices(
  peripheralsArray: Peripheral[]): Peripheral {
  // get our specific device from the list of bonded devices.
  // for now, this just selects the first device in the list.
  // eventially this will be based on some kind of manufaturer ID or something
  // specific to our device.

  if (peripheralsArray.length === 0) {
    throw new Error('No bonded devices found');
  }

  return peripheralsArray[0];
}

export function selectOurServiceAndCharacteristic(
  appConnectedPeripheralInfo: PeripheralInfo): TargetInfos {
  // select our specific service and characteristic from the lists of services
  // and characteristics.


  const deviceID: string = appConnectedPeripheralInfo?.id ||
    defaultBluetoothContext.targetInfos.targetDeviceID;


  // eventually can set service and characteristic based on their descriptions
  // or positions in arrays. but for now, just have them hard-coded.
  const serviceUUID: string = '1111';
  const characteristicUUID: string = '2222';


  const outputTargetInfos: TargetInfos = {
    targetDeviceID: deviceID,
    targetServiceUUID: serviceUUID,
    targetCharacteristicUUID: characteristicUUID
  };
  return outputTargetInfos;
}
