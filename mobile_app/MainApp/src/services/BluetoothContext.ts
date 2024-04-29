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


interface ConnectedDeviceInfo {
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
  askForBluetoothPermissions: () => Promise<void>;
  getConnectedDevices: () => Promise<void>;
}

export const defaultDeviceInfo: ConnectedDeviceInfo = {
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
  askForBluetoothPermissions: async () => {
    throw new Error('askForBluetoothPermissions not implemented yet')
  },
  getConnectedDevices: async () => {
    throw new Error('getConnectedDevices not implemented yet')
  },
};

export const BluetoothContext = createContext<BluetoothContextType>(
  defaultBluetoothContext);

