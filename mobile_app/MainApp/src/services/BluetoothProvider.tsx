import React, {
  FC,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import {
  Platform,
} from "react-native";
import {
  Peripheral,
  PeripheralInfo,
} from "react-native-ble-manager";

import {
  BluetoothContext,
  DeviceInfos,
  defaultBluetoothContext,
} from './BluetoothContext';
import BluetoothService from './BluetoothService';



const BluetoothProvider: FC<PropsWithChildren> = ({ children }) => {
  // state variables
  const [bluetoothPermissionsOK, setBluetoothPermissionsOK] =
    useState<boolean>(defaultBluetoothContext.bluetoothPermissionsOK);
  const [deviceIsAppConnected, setDeviceIsAppConnected] =
    useState<boolean>(defaultBluetoothContext.deviceIsAppConnected);
  const [deviceInfos, setDeviceInfos] =
    useState<DeviceInfos>(defaultBluetoothContext.deviceInfos);
  const [targetServiceUUID, setTargetServiceUUID] =
    useState<string>(defaultBluetoothContext.targetServiceUUID);
  const [targetCharacteristicUUID, setTargetCharacteristicUUID] =
    useState<string>(defaultBluetoothContext.targetCharacteristicUUID);


  // helper functions
  const myAsyncHelperFunction = async (): Promise<void> => {
    // your code here
  };


  // functions for the UI to interact with the bluetooth service
  const initializeDriver = async (): Promise<void> => {
    BluetoothService.initializeBLEManager();
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

  const getSystemConnectedDeviceInfo = async (): Promise<void> => {
    if (!bluetoothPermissionsOK) {
      console.error('Bluetooth permissions not granted yet');
      return;
    }

    let peripheralsArray: Peripheral[] = [];
    try {
      peripheralsArray = await BluetoothService.getSystemConnectedPeripherals();
    } catch (error) {
      console.error('Error checking for connected devices:', error);
      throw error;
    }

    // in the future, could implement something here that only counts a device
    // as connected if its ID matches the format of out smart mirror.
    if (peripheralsArray.length == 0) {
      console.log('No connected devices found');
      setDeviceIsAppConnected(false);
      setDeviceInfos(defaultBluetoothContext.deviceInfos);
      return;
    }

    // for now, just assume the first connected device is the one we care about
    const deviceInfosAfterSystemDevicesCheck: DeviceInfos = {
      systemConnectedPeripheralInfo: peripheralsArray[0],
      appConnectedPeripheralInfo: null,
    };

    console.log('System connected device info: ',
      JSON.stringify(deviceInfosAfterSystemDevicesCheck, null, 2));

    // at this point, this could be a different device, so we should make it
    // mandatory to update the app connected device info after calling this.
    setDeviceIsAppConnected(false);

    setDeviceInfos(deviceInfosAfterSystemDevicesCheck);
  }

  const connectAndGetAppConnectedDeviceInfo = async (): Promise<void> => {
    // must have called getSystemConnectedDeviceInfo before this!

    // if there is no system connected device, there is nothing to connect to.
    if (deviceInfos.systemConnectedPeripheralInfo == null) {
      console.error('No connected device to get services from');
      return;
    }

    const deviceID: string = deviceInfos.systemConnectedPeripheralInfo.id;

    // make sure system device is still connected
    const isSystemConnected: boolean =
      await BluetoothService.checkIfDeviceIsSystemConnected(deviceID);
    if (!isSystemConnected) {
      console.error('No system device connected (connectAndGetAppConnectedDeviceInfo)');
      setDeviceIsAppConnected(false);
      setDeviceInfos({
        systemConnectedPeripheralInfo: deviceInfos.systemConnectedPeripheralInfo,
        appConnectedPeripheralInfo: null,
      });
      return;
    }

    // try to connect
    try {
      await BluetoothService.appConnectToDevice(deviceID);
      setDeviceIsAppConnected(true);
    }
    catch (error) {
      console.error('Error connecting to device:', error);
      setDeviceIsAppConnected(false);
      setDeviceInfos({
        systemConnectedPeripheralInfo: deviceInfos.systemConnectedPeripheralInfo,
        appConnectedPeripheralInfo: null,
      });
      throw error;
    }

    // if connection was successful, get services and update device info
    try {
      console.log('trying to get services from device: ', deviceID);

      // 1 second delay, because I saw this in an example project
      await new Promise(resolve => setTimeout(resolve, 1000));

      const peripheralExtendedInfo: PeripheralInfo =
        await BluetoothService.retrieveServices(deviceID);

      console.log('Peripheral extended info: ',
        JSON.stringify(peripheralExtendedInfo, null, 2));

      setDeviceInfos({
        systemConnectedPeripheralInfo: deviceInfos.systemConnectedPeripheralInfo,
        appConnectedPeripheralInfo: peripheralExtendedInfo,
      });
    }
    catch (error) {
      console.error('Error getting services from connected device:', error);
      setDeviceInfos({
        systemConnectedPeripheralInfo: deviceInfos.systemConnectedPeripheralInfo,
        appConnectedPeripheralInfo: null,
      });
      throw error;
    }
  }

  const checkIfDeviceIsReadWritable = async (): Promise<boolean> => {
    // make sure we have system device info saved
    if (deviceInfos.systemConnectedPeripheralInfo === null ||
      deviceInfos.systemConnectedPeripheralInfo ===
      defaultBluetoothContext.deviceInfos.systemConnectedPeripheralInfo
    ) {
      console.error('No connected device to check');
      return false;
    }

    // make sure system device is still connected
    const deviceID: string = deviceInfos.systemConnectedPeripheralInfo.id;
    try {
      const isConnected: boolean =
        await BluetoothService.checkIfDeviceIsSystemConnected(deviceID);

      if (!isConnected) {
        console.error('Device disconnected');
        return false;
      }
    }
    catch (error) {
      console.error('Error checking if connected:', error);
      return false;
    }

    // make sure we have app device info saved
    if (deviceInfos.appConnectedPeripheralInfo === null ||
      deviceInfos.appConnectedPeripheralInfo ===
      defaultBluetoothContext.deviceInfos.appConnectedPeripheralInfo
    ) {
      console.error('No services discovered yet');
      return false;
    }

    // make sure there are services and characteristics to read from
    if (deviceInfos.appConnectedPeripheralInfo.serviceUUIDs === undefined ||
      deviceInfos.appConnectedPeripheralInfo.serviceUUIDs.length == 0 ||
      deviceInfos.appConnectedPeripheralInfo.characteristics === undefined ||
      deviceInfos.appConnectedPeripheralInfo.characteristics.length == 0
    ) {
      console.error('No services or characteristics to read from');
      return false;
    }

    return true;
  }

  const readFromCharacteristic = async (): Promise<any> => {
    // return type tbd, I think it's some kind of int array

    const okToReadWrite: boolean = await checkIfDeviceIsReadWritable();
    if (!okToReadWrite) {
      console.error('Device not read-writable (readFromCharacteristic)');
      return;
    }

    // these checks aren't really necessary since these should be covered in
    // checkIfDeviceIsReadWritable, but have them here to silence the type checker.
    if (deviceInfos.appConnectedPeripheralInfo === null ||
      deviceInfos.appConnectedPeripheralInfo.serviceUUIDs === undefined ||
      deviceInfos.appConnectedPeripheralInfo.characteristics === undefined) {
      console.error('No connected device to read from.');
      console.error('checkIfDeviceIsReadWritable should have caught this but didn\'t!');
      return;
    }

    // I'm assuming the service and characteristic we want are the first
    // ones in the arrays.
    const deviceID: string =
      deviceInfos.appConnectedPeripheralInfo.id;
    const serviceUUID: string =
      deviceInfos.appConnectedPeripheralInfo.serviceUUIDs[0];
    const characteristicUUID: string =
      deviceInfos.appConnectedPeripheralInfo.characteristics[0].characteristic;

    // do the actual read operation
    try {
      const returnedData: any = await BluetoothService.read(deviceID, serviceUUID,
        characteristicUUID);

      // no clue what this data actually is. an array of ints?
      console.log('Read data: ', returnedData);
      return returnedData;
    }
    catch (error) {
      console.error('Error reading from characteristic:', error);
      throw error;
    }
  }



  // constructor-like thing that runs when context is created
  useEffect(() => {
    initializeDriver();
    // eventually, could pull in data from saved state here.
  }, []);

  // return the context provider
  const value = {
    bluetoothPermissionsOK,
    deviceIsAppConnected,
    deviceInfos,
    targetServiceUUID,
    targetCharacteristicUUID,
    initializeDriver,
    promptUserForPermissions,
    getSystemConnectedDeviceInfo,
    connectAndGetAppConnectedDeviceInfo,
    readFromCharacteristic,
  };

  return (
    <BluetoothContext.Provider value={value}>
      {children}
    </BluetoothContext.Provider>
  );
};

export default BluetoothProvider;