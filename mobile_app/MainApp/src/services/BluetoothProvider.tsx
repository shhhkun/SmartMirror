import React, {
  FC,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import { Platform } from "react-native";
import { Peripheral } from "react-native-ble-manager";

import {
  BluetoothContext,
  ConnectedDeviceInfo,
  defaultBluetoothContext,
} from './BluetoothContext';
import BluetoothService from './BluetoothService';



const BluetoothProvider: FC<PropsWithChildren> = ({ children }) => {
  // state variables
  const [bluetoothPermissionsOK, setBluetoothPermissionsOK] =
    useState<boolean>(defaultBluetoothContext.bluetoothPermissionsOK);
  const [deviceIsConnected, setDeviceIsConnected] =
    useState<boolean>(defaultBluetoothContext.deviceIsConnected);
  const [deviceInfo, setDeviceInfo] =
    useState<ConnectedDeviceInfo>(defaultBluetoothContext.deviceInfo);



  // functions to interact with the bluetooth service
  const initializeDriver = async (): Promise<void> => {
    BluetoothService.initialize();
  }

  const promptUserForPermissions = async (): Promise<void> => {
    if (bluetoothPermissionsOK) {
      return;
    }

    try {
      await BluetoothService.requestBluetoothPermission();

      if (Platform.OS === 'android' && Platform.Version >= 23) {
        await BluetoothService.requestAndroidLocationPermission();
      };

      setBluetoothPermissionsOK(true);
      console.log('Bluetooth permissions granted');

    } catch (error) {
      setBluetoothPermissionsOK(false);
      console.error('Bluetooth permissions not granted:', error);
    }
  }

  const checkForConnectedDevices = async (): Promise<void> => {
    if (!bluetoothPermissionsOK) {
      console.error('Bluetooth permissions not granted yet');
      return;
    }

    let peripheralsArray: Peripheral[] = [];
    try {
      peripheralsArray = await BluetoothService.getConnectedPeripherals();
    } catch (error) {
      console.error('Error checking for connected devices:', error);
      throw error;
    }

    // in the future, could implement something here that only counts a device
    // as connected if its ID matches the format of out smart mirror.
    if (peripheralsArray.length == 0) {
      console.log('No connected devices found');
      setDeviceIsConnected(false);
      setDeviceInfo(defaultBluetoothContext.deviceInfo);
      return;
    }

    // for now, just assume the first connected device is the one we care about
    const connectedDeviceInfo: ConnectedDeviceInfo = {
      peripheralBasicInfo: peripheralsArray[0],
      peripheralExtendedInfo: null,
    };

    console.log('Connected device info: ',
      JSON.stringify(connectedDeviceInfo, null, 2));

    setDeviceInfo(connectedDeviceInfo);
  }



  // constructor-like thing that runs when context is created
  useEffect(() => {
    initializeDriver();
  }, []);

  // return the context provider
  const value = {
    bluetoothPermissionsOK,
    deviceIsConnected,
    deviceInfo,
    initializeDriver,
    promptUserForPermissions,
    checkForConnectedDevices,
  };

  return (
    <BluetoothContext.Provider value={value}>
      {children}
    </BluetoothContext.Provider>
  );
};

export default BluetoothProvider;


// the plan is for this to have methods like "get connected devices, write, read, etc."
// and then under the hood, this would be calling bluetooth service.
// but states would be saved in here.