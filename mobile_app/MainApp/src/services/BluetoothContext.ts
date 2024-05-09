import {
  createContext
} from 'react';
import {
  Peripheral,
  PeripheralInfo
} from 'react-native-ble-manager';


export interface DeviceInfos {
  // this info is available with just a system connection to a device.
  systemConnectedPeripheralInfo: Peripheral | null;
  // Peripheral has the form: Peripheral {
  //   id: string;
  //   rssi: number;
  //   name?: string;
  //   advertising: AdvertisingData;
  // }


  // this info is available after an app specifc connection to a device and
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
  bluetoothPermissionsOK: boolean;
  deviceIsAppConnected: boolean;
  deviceInfo: DeviceInfos;
  // want to enventaully have fields for our device ID
  // and characteristic ID of interest

  initializeDriver: () => Promise<void>;
  promptUserForPermissions: () => Promise<void>;
  checkForConnectedDevices: () => Promise<void>;
  getServicesFromAppConnectedDevice: () => Promise<void>;
  readFromCharacteristic: () => Promise<any>;
}

const defaultDeviceInfo: DeviceInfos = {
  systemConnectedPeripheralInfo: null,
  appConnectedPeripheralInfo: null,
};

export const defaultBluetoothContext: BluetoothContextType = {
  bluetoothPermissionsOK: false,
  deviceIsAppConnected: false,
  deviceInfo: defaultDeviceInfo,

  initializeDriver: async () => {
    throw new Error('initializeDriver function is not initialized yet');
  },
  promptUserForPermissions: async () => {
    throw new Error('askForBluetoothPermissions function is not initialized yet');
  },
  checkForConnectedDevices: async () => {
    throw new Error('checkForConnectedDevices function is not initialized yet');
  },
  getServicesFromAppConnectedDevice: async () => {
    throw new Error('getServicesFromConnectedDevice function is not initialized yet');
  },
  readFromCharacteristic: async () => {
    throw new Error('readFromCharacteristic function is not initialized yet');
  },
};

export const BluetoothContext = createContext<BluetoothContextType>(
  defaultBluetoothContext);

