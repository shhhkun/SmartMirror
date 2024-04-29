import React, {
  FC,
  useState,
  PropsWithChildren,
} from "react";

import {
  BluetoothContext,
  BluetoothContextType,
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
  const initializeDriver = async () => {
    // todo
  }

  const promptUserForPermissions = async () => {
    // todo
  }

  const getConnectedDevices = async () => {
    // todo
  }



  // return the context provider
  const value = {
    bluetoothPermissionsOK,
    deviceIsConnected,
    deviceInfo,
    initializeDriver,
    promptUserForPermissions,
    getConnectedDevices,
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