import {
  Buffer
} from 'buffer';
import { Peripheral } from 'react-native-ble-manager';

// functions to serialize/deserialize data, and anything else that
// doesn't need to touch the context states or the BLE manager

export function selectOurDeviceFromBondedDevices(peripheralsArray: Peripheral[]):
  Peripheral {
  // get our specific device from the list of bonded devices
  // eventially this will be based on some kind of manufaturer ID or something
  // specific to our device. but for now, we're just going to return the first
  // device in the list.

  if (peripheralsArray.length === 0) {
    throw new Error('No bonded devices found');
  }

  return peripheralsArray[0];
}

export function serializeInt(intInput: number): number[] {
  // quick function just to try serializing a single number

  if (intInput < 0 || intInput > 255) {
    throw new Error('Input must be between 0 and 255');
  }

  let buffer: Buffer = Buffer.alloc(1);
  buffer.writeUInt32LE(intInput, 0);
  const byteArray: number[] = Array.from(buffer);
  return byteArray;
}