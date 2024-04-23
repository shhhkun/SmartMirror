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


interface infoAboutConnectedDevice {
  deviceIsConnected: boolean;

  peripheralBasicInfo: Peripheral;
  // Peripheral has the form: Peripheral {
  //   id: string;
  //   rssi: number;
  //   name?: string;
  //   advertising: AdvertisingData;
  // }

  peripheralExtendedInfo: PeripheralInfo;
  // PeripheralInfo extends Peripheral has the form: PeripheralInfo {
  //   serviceUUIDs?: string[];
  //   characteristics?: Characteristic[];
  //   services?: Service[];
  // }

  // some other attribute for the characteristic we actually care about

}



interface BluetoothContextType {
  deviceIsConnected: boolean;
  deviceInfo: infoAboutConnectedDevice;
}