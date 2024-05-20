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
}
// maybe the "main" target characteristic could be current user. or number of
// modules.

// might want to have a type that is an array or map of characteristics and
// associated module. I like the idea of a map, where keys are module names and
// values are the characteristicUUIDs.
export interface CharacteristicsMapping {
  [characteristicName: string]: string;
}
// might need to have some method that takes the peripherals info gotten from
// retrieveServices and updates this field with characteristic UUIDs and their
// names. assuming that in the advertising thing, the

export interface BluetoothContextType {

  deviceStates: DeviceStates;
  deviceInfos: DeviceInfos;
  targetInfos: TargetInfos;
  // characteristicsMapping: CharacteristicsMapping;

  promptUserForPermissions: () => Promise<void>;
  getBondedDevice: () => Promise<void>;
  connectToBondedDevice: () => Promise<void>;
  getSystemConnectedDeviceInfo: () => Promise<void>;
  connectAndGetAppConnectedDeviceInfo: () => Promise<void>;
  appConnectFromBonded: () => Promise<void>;
  readFromCharacteristic: () => Promise<any>;
  writeDataToCharacteristic: (data: any) => Promise<void>;
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

export const defaultBluetoothContext: BluetoothContextType = {
  deviceStates: defaultDeviceStates,
  deviceInfos: defaultDeviceInfo,
  targetInfos: defaultTargetInfos,

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
  readFromCharacteristic: async () => {
    throw new Error('readFromCharacteristic function is not initialized yet');
  },
  writeDataToCharacteristic: async () => {
    throw new Error('writeDataToCharacteristic function is not initialized yet');
  },
};



export const BluetoothContext = createContext<BluetoothContextType>(
  defaultBluetoothContext);

