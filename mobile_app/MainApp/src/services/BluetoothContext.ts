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
  // haven't been able to get yet.
  peripheralExtendedInfo: PeripheralInfo | null;
  // PeripheralInfo extends Peripheral has the form: PeripheralInfo {
  //   serviceUUIDs?: string[];
  //   characteristics?: Characteristic[];
  //   services?: Service[];
  // }

  // some other attribute for the characteristic we actually care about
}

const defaultDeviceInfo: ConnectedDeviceInfo = {
  peripheralBasicInfo: null,
  peripheralExtendedInfo: null,
};

interface BluetoothContextType {
  deviceIsConnected: boolean;
  deviceInfo: ConnectedDeviceInfo;
}

const BluetoothContext = createContext<BluetoothContextType>({
  deviceIsConnected: false,
  deviceInfo: defaultDeviceInfo,
});

export default BluetoothContext;