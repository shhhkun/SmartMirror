import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import BleManager, {
  Peripheral,
  PeripheralInfo
} from 'react-native-ble-manager';

import BluetoothService from './BluetoothService';


export interface ConnectedDeviceInfo {
  // upon connecting, below attributes should be populated
  // upon disconnecting, below attributes should be set to none

  // this info is available from just an advertising device?
  peripheralBasicInfo: Peripheral | null;
  // Peripheral has the form: Peripheral {
  //   id: string;
  //   rssi: number;
  //   name?: string;
  //   advertising: AdvertisingData;
  // }

  // this info is available from a connected device?
  peripheralExtendedInfo: PeripheralInfo | null;
  // PeripheralInfo extends Peripheral has the form: PeripheralInfo {
  //   serviceUUIDs?: string[];
  //   characteristics?: Characteristic[];
  //   services?: Service[];
  // }

  // some other attribute for the characteristic we actually care about
}

export interface BluetoothContextType {
  bluetoothPermissionsOK: boolean;
  deviceIsConnected: boolean;
  deviceInfo: ConnectedDeviceInfo;
  // want to enventaully have fields for our device ID
  // and characteristic ID of interest

  initializeDriver: () => Promise<void>;
  promptUserForPermissions: () => Promise<void>;
  checkForConnectedDevices: () => Promise<void>;
}

const defaultDeviceInfo: ConnectedDeviceInfo = {
  peripheralBasicInfo: null,
  peripheralExtendedInfo: null,
};

export const defaultBluetoothContext: BluetoothContextType = {
  bluetoothPermissionsOK: false,
  deviceIsConnected: false,
  deviceInfo: defaultDeviceInfo,

  initializeDriver: async () => {
    throw new Error('initializeDriver not implemented yet')
  },
  promptUserForPermissions: async () => {
    throw new Error('askForBluetoothPermissions not implemented yet')
  },
  checkForConnectedDevices: async () => {
    throw new Error('checkForConnectedDevices not implemented yet')
  },
};

export const BluetoothContext = createContext<BluetoothContextType>(
  defaultBluetoothContext);

