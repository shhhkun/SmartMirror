import {
  createContext
} from 'react';
import {
  Peripheral,
  PeripheralInfo
} from 'react-native-ble-manager';



export interface DeviceStates {
  // might want some of these to listen to ble manager events

  bluetoothPermissionsOK: boolean;
  deviceIsBonded: boolean;
  deviceIsSystemConnected: boolean;
  deviceIsAppConnected: boolean;
}

export interface DeviceInfos {
  // this will holds the info of a smart mirror device that is bonded
  bondedDeviceInfo: Peripheral | null;
  // Peripheral has the form: Peripheral {
  //   id: string;
  //   rssi: number;
  //   name?: string;
  //   advertising: AdvertisingData;
  // }


  // this info is available with just a system connection to a device.
  systemConnectedPeripheralInfo: Peripheral | null;
  // Peripheral has the form: Peripheral {
  //   id: string;
  //   rssi: number;
  //   name?: string;
  //   advertising: AdvertisingData;
  // }


  // this info is available after an app-specifc connection to a device and
  // a retrieval of services.
  appConnectedPeripheralInfo: PeripheralInfo | null;
  // PeripheralInfo extends Peripheral and has the form:
  // PeripheralInfo {
  //   id: string;
  //   rssi: number;
  //   name?: string;
  //   advertising: AdvertisingData;
  //   serviceUUIDs?: string[];
  //   characteristics?: Characteristic[];
  //   services?: Service[];
  // }

}

export interface TargetInfos {
  targetDeviceID: string;
  targetServiceUUID: string;
  targetCharacteristicUUID: string;
  // this "main" target characteristic will point to the characteristic that
  // shows "current user". upon switching users, we'll need to call
  // retrieveServices again to get the rest of the characteristics.
}

// not actually using the characteristics map for now. would be used if we
// weren't hard-coding what characteristics correspond to what modules.
export interface CharacteristicsMap {
  // a map structure where keys are module names (or module name - attribute)
  // as strings, and values are the characteristic UUIDs as strings.
  [module: string]: string;
}

export interface BluetoothContextType {

  deviceStates: DeviceStates;
  deviceInfos: DeviceInfos;
  targetInfos: TargetInfos;
  characteristicsMap: CharacteristicsMap;

  promptUserForPermissions: () => Promise<void>;
  getBondedDevice: () => Promise<void>;
  connectToBondedDevice: () => Promise<void>;
  getSystemConnectedDeviceInfo: () => Promise<void>;
  connectAndGetAppConnectedDeviceInfo: () => Promise<void>;
  appConnectFromBonded: () => Promise<void>;

  readFromTargetCharacteristic: () => Promise<number[]>;
  readFromAnyCharacteristic: (characteristicUUID: string) => Promise<number[]>;
  writeDataToCharacteristic: (data: number) => Promise<void>;
  writeByteArrayToAnyCharacteristic: (data: number[],
    characteristicUUID: string) => Promise<void>;
}



const defaultDeviceStates: DeviceStates = {
  bluetoothPermissionsOK: false,
  deviceIsBonded: false,
  deviceIsSystemConnected: false,
  deviceIsAppConnected: false,
};

const defaultTargetInfos: TargetInfos = {
  targetDeviceID: '',
  targetServiceUUID: '',
  targetCharacteristicUUID: '',
};

const defaultDeviceInfo: DeviceInfos = {
  bondedDeviceInfo: null,
  systemConnectedPeripheralInfo: null,
  appConnectedPeripheralInfo: null,
};

const defaultCharacteristicsMap: CharacteristicsMap = {
  // empty map
};

export const defaultBluetoothContext: BluetoothContextType = {
  deviceStates: defaultDeviceStates,
  deviceInfos: defaultDeviceInfo,
  targetInfos: defaultTargetInfos,
  characteristicsMap: defaultCharacteristicsMap,

  // there's probably a more DRY way of doing this but whatever
  promptUserForPermissions: async () => {
    throw new Error('askForBluetoothPermissions function is not initialized yet');
  },
  getBondedDevice: async () => {
    throw new Error('getBondedDevices function is not initialized yet');
  },
  connectToBondedDevice: async () => {
    throw new Error('connectToBondedDevice function is not initialized yet');
  },
  getSystemConnectedDeviceInfo: async () => {
    throw new Error('getSystemConnectedDeviceInfo function is not initialized yet');
  },
  connectAndGetAppConnectedDeviceInfo: async () => {
    throw new Error('connectAndGetAppConnectedDeviceInfo function is not initialized yet');
  },
  appConnectFromBonded: async () => {
    throw new Error('appConnectFromBonded function is not initialized yet');
  },
  readFromTargetCharacteristic: async () => {
    throw new Error('readFromTargetCharacteristic function is not initialized yet');
  },
  readFromAnyCharacteristic: async () => {
    throw new Error('readFromAnyCharacteristic function is not initialized yet');
  },
  writeDataToCharacteristic: async () => {
    throw new Error('writeDataToCharacteristic function is not initialized yet');
  },
  writeByteArrayToAnyCharacteristic: async () => {
    throw new Error('writeByteArrayToAnyCharacteristic function is not initialized yet');
  }
};



export const BluetoothContext = createContext<BluetoothContextType>(
  defaultBluetoothContext);

