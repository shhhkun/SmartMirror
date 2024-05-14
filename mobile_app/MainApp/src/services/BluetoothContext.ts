import {
  createContext
} from 'react';
import {
  Peripheral,
  PeripheralInfo
} from 'react-native-ble-manager';


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

export interface BluetoothContextType {
  // not sure if I want to add a field for if (compatible) device
  // is system connected. like if there is a unique device ID for
  // our smart mirrors, and a device with that is connected.

  // also might want a way to hold onto multiple characteristics. or
  // have some more state there, if I'm writing to multiple.

  bluetoothPermissionsOK: boolean;
  deviceIsAppConnected: boolean;
  deviceInfos: DeviceInfos;

  targetDeviceID: string;
  targetServiceUUID: string;
  targetCharacteristicUUID: string;

  promptUserForPermissions: () => Promise<void>;
  getBondedDevice: () => Promise<void>;
  connectToBondedDevice: () => Promise<void>;
  getSystemConnectedDeviceInfo: () => Promise<void>;
  connectAndGetAppConnectedDeviceInfo: () => Promise<void>;
  readFromCharacteristic: () => Promise<any>;
  writeDataToCharacteristic: (data: any) => Promise<void>;
}

const defaultDeviceInfo: DeviceInfos = {
  bondedDeviceInfo: null,
  systemConnectedPeripheralInfo: null,
  appConnectedPeripheralInfo: null,
};

export const defaultBluetoothContext: BluetoothContextType = {
  bluetoothPermissionsOK: false,
  deviceIsAppConnected: false,
  deviceInfos: defaultDeviceInfo,

  targetDeviceID: '',
  targetServiceUUID: '',
  targetCharacteristicUUID: '',

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
  readFromCharacteristic: async () => {
    throw new Error('readFromCharacteristic function is not initialized yet');
  },
  writeDataToCharacteristic: async () => {
    throw new Error('writeDataToCharacteristic function is not initialized yet');
  }
};

export const BluetoothContext = createContext<BluetoothContextType>(
  defaultBluetoothContext);

