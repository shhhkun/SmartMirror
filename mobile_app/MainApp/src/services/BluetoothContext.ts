import {
  createContext
} from 'react';
import {
  Peripheral,
  PeripheralInfo
} from 'react-native-ble-manager';


export interface ConnectedDeviceInfo {
  // upon connecting, below attributes should be populated
  // upon disconnecting, below attributes should be set to none

  // this info is available from just an advertising device I think
  peripheralBasicInfo: Peripheral | null;
  // Peripheral has the form: Peripheral {
  //   id: string;
  //   rssi: number;
  //   name?: string;
  //   advertising: AdvertisingData;
  // }

  // this info is available after retrieveServices call I think
  peripheralExtendedInfo: PeripheralInfo | null;
  // PeripheralInfo extends Peripheral has the form: PeripheralInfo {
  //   serviceUUIDs?: string[];
  //   characteristics?: Characteristic[];
  //   services?: Service[];
  // }

  // some other attribute for the characteristic we actually care about?
  // or just select the device ID / service UUID / characteristic UUID
  // from these objects.
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

