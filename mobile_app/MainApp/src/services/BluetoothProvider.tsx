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
  // ble state info
  const [bluetoothPermissionsOK, setBluetoothPermissionsOK] =
    useState<boolean>(defaultBluetoothContext.bluetoothPermissionsOK);
  const [deviceIsAppConnected, setDeviceIsAppConnected] =
    useState<boolean>(defaultBluetoothContext.deviceIsAppConnected);
  const [deviceInfos, setDeviceInfos] =
    useState<DeviceInfos>(defaultBluetoothContext.deviceInfos);

  // states to hold on to device info of interest
  const [targetDeviceID, setTargetDeviceID] =
    useState<string>(defaultBluetoothContext.targetDeviceID);
  const [targetServiceUUID, setTargetServiceUUID] =
    useState<string>(defaultBluetoothContext.targetServiceUUID);
  const [targetCharacteristicUUID, setTargetCharacteristicUUID] =
    useState<string>(defaultBluetoothContext.targetCharacteristicUUID);



  // helper functions
  const initializeDriver = async (): Promise<void> => {
    BluetoothService.initializeBLEManager();
  }

  const updateTargetsFromAppPeripheralInfo = (appConnectedPeripheralInfo:
    PeripheralInfo): void => {

    console.log('Updating service and characteristic fields to the following: ',
      appConnectedPeripheralInfo);

    setTargetDeviceID(appConnectedPeripheralInfo?.id ||
      defaultBluetoothContext.targetDeviceID);

    setTargetServiceUUID(appConnectedPeripheralInfo?.serviceUUIDs?.[0] ||
      defaultBluetoothContext.targetServiceUUID);

    setTargetCharacteristicUUID(appConnectedPeripheralInfo?.
      characteristics?.[0]?.characteristic || defaultBluetoothContext.
        targetCharacteristicUUID);
  };

  const setTargetFieldsToDefault = (): void => {
    setTargetDeviceID(defaultBluetoothContext.targetDeviceID);
    setTargetServiceUUID(defaultBluetoothContext.targetServiceUUID);
    setTargetCharacteristicUUID(defaultBluetoothContext.targetCharacteristicUUID);
  }

  const setSystemConnectedDeviceInfoToDefault = (): void => {
    setDeviceInfos(defaultBluetoothContext.deviceInfos);

    setDeviceIsAppConnected(false);

    setTargetFieldsToDefault();
  }

  const setAppConnectedDeviceInfoToFailed = (): void => {
    setDeviceIsAppConnected(false);

    setDeviceInfos({
      systemConnectedPeripheralInfo: deviceInfos.systemConnectedPeripheralInfo,

      appConnectedPeripheralInfo:
        defaultBluetoothContext.deviceInfos.appConnectedPeripheralInfo,
    });

    setTargetFieldsToDefault();
  }

  const verifySystemDeviceConnected = async (): Promise<boolean> => {
    // make sure we have system device info saved
    if (deviceInfos.systemConnectedPeripheralInfo == null ||
      deviceInfos.systemConnectedPeripheralInfo ===
      defaultBluetoothContext.deviceInfos.systemConnectedPeripheralInfo
    ) {
      console.error('No connected device to get services from (verifySystemDeviceConnected)');

      setSystemConnectedDeviceInfoToDefault();
      return false;
    }

    const deviceID: string = deviceInfos.systemConnectedPeripheralInfo.id;

    // make sure system device is still connected
    if (!(await BluetoothService.checkIfDeviceIsSystemConnected(deviceID))) {
      console.error('No system device connected (connectAndGetAppConnectedDeviceInfo)');

      setSystemConnectedDeviceInfoToDefault();

      return false;
    }

    return true;
  }

  const appConnectToDevice = async (deviceID: string): Promise<void> => {
    try {
      await BluetoothService.appConnectToDevice(deviceID);
      setDeviceIsAppConnected(true);
    }
    catch (error) {
      console.error('Error connecting to device:', error);
      setAppConnectedDeviceInfoToFailed();
      throw error;
    }
  }

  const retrieveServicesFromConnectedDevice = async (deviceID: string): Promise<void> => {
    // this function attempts to get the services from the connected device.
    // it then updates the context with the new info.

    try {
      // short delay, to allow connection to settle
      await new Promise(resolve => setTimeout(resolve, 1000));

      const peripheralRetrievedServicesInfo: PeripheralInfo =
        await BluetoothService.retrieveServices(deviceID);

      console.log('Peripheral extended info: ',
        JSON.stringify(peripheralRetrievedServicesInfo, null, 2));

      // update fields in context
      setDeviceInfos({
        systemConnectedPeripheralInfo: deviceInfos.systemConnectedPeripheralInfo,
        appConnectedPeripheralInfo: peripheralRetrievedServicesInfo,
      });

      // todo !!!!!!
      // for some reason, this function is seeing null in
      // appConnectedPeripheralInfo when it isn't null.
      // might have been some async timing thing with states, so going to try
      // this new function and set it directly.
      updateTargetsFromAppPeripheralInfo(peripheralRetrievedServicesInfo);

    }
    catch (error) {
      console.error('Error getting services from connected device:', error);
      setAppConnectedDeviceInfoToFailed();
      throw error;
    }
  }



  // functions for the UI to interact with the bluetooth service
  const promptUserForPermissions = async (): Promise<void> => {
    if (bluetoothPermissionsOK) {
      return;
    }

    try {
      await BluetoothService.requestAllPermissions();
      setBluetoothPermissionsOK(true);

    } catch (error) {
      setBluetoothPermissionsOK(false);
    }
  }

  const getSystemConnectedDeviceInfo = async (): Promise<void> => {
    // checks for devices connected to the phone, which may or may not actually
    // have an app-specific connection. this function resets the app-specific
    // info to defaults (for the case we've connected to a different device
    // since that was written.

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

    if (peripheralsArray.length == 0) {
      console.log('No connected devices found');
      setSystemConnectedDeviceInfoToDefault();
      return;
    }

    // for now, just assume the first connected device is the one we care about
    const systemConnectedDeviceInfo: DeviceInfos = {
      systemConnectedPeripheralInfo: peripheralsArray[0],

      appConnectedPeripheralInfo:
        defaultBluetoothContext.deviceInfos.appConnectedPeripheralInfo,
    };

    console.log('System connected device info: ',
      JSON.stringify(systemConnectedDeviceInfo, null, 2));

    setDeviceInfos(systemConnectedDeviceInfo);
    setTargetFieldsToDefault();
  }

  const connectAndGetAppConnectedDeviceInfo = async (): Promise<void> => {
    // iniates the app-specific connection, retrieves services, and updates context
    // with all the info needed to read/write to the device. need to have
    // system connected device info before calling this, since uses the stored
    // system device device ID.

    if (! await verifySystemDeviceConnected()) {
      console.error('System device not connected');
      return;
    }

    const deviceID: string = deviceInfos.systemConnectedPeripheralInfo?.id ||
      defaultBluetoothContext.targetDeviceID;

    try {
      await appConnectToDevice(deviceID);
      await retrieveServicesFromConnectedDevice(deviceID);

    } catch (error) {

      console.error('Error connecting to device or retrieving services:', error);
      setAppConnectedDeviceInfoToFailed();
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

    // make sure the target fields are set
    if (targetDeviceID === '' ||
      targetDeviceID === defaultBluetoothContext.targetDeviceID ||
      targetServiceUUID === '' ||
      targetServiceUUID === defaultBluetoothContext.targetServiceUUID ||
      targetCharacteristicUUID === '' ||
      targetCharacteristicUUID === defaultBluetoothContext.targetCharacteristicUUID) {

      console.error('No target device, service, or characteristic set');
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

    // do the actual read operation
    try {
      const returnedData: any = await BluetoothService.read(
        targetDeviceID, targetServiceUUID, targetCharacteristicUUID);

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

    targetDeviceID,
    targetServiceUUID,
    targetCharacteristicUUID,

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