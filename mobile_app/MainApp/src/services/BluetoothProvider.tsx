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
    useState<DeviceInfos>(defaultBluetoothContext.deviceInfo);



  // functions to interact with the bluetooth service
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
      setDeviceInfos(defaultBluetoothContext.deviceInfo);
      return;
    }

    // for now, just assume the first connected device is the one we care about
    const connectedDeviceInfo: DeviceInfos = {
      systemConnectedPeripheralInfo: peripheralsArray[0],
      appConnectedPeripheralInfo: null,
    };

    console.log('Connected device info: ',
      JSON.stringify(connectedDeviceInfo, null, 2));

    // todo: don't set this to true unless we've established an app
    setDeviceIsAppConnected(true);

    setDeviceInfos(connectedDeviceInfo);
  }

  const getServicesFromAppConnectedDevice = async (): Promise<void> => {
    getSystemConnectedDeviceInfo();

    if (!deviceIsAppConnected || deviceInfos.systemConnectedPeripheralInfo == null) {
      console.error('No connected device to get services from');
      return;
    }

    const deviceID: string = deviceInfos.systemConnectedPeripheralInfo.id;

    try {
      console.log('trying to get services from device: ', deviceID);

      // 2 second delay, because I saw this in an example project
      await new Promise(resolve => setTimeout(resolve, 2000));

      const peripheralExtendedInfo: PeripheralInfo =
        await BluetoothService.retrieveServices(deviceID);

      // 2 secodn delay after, just to be safe
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Peripheral extended info: ',
        JSON.stringify(peripheralExtendedInfo, null, 2));

      setDeviceInfos({
        systemConnectedPeripheralInfo: deviceInfos.systemConnectedPeripheralInfo,
        appConnectedPeripheralInfo: peripheralExtendedInfo,
      });
    }
    catch (error) {
      console.error('Error getting services from connected device:', error);
      throw error;
    }
  }

  const checkIfDeviceIsReadWritable = async (): Promise<boolean> => {
    // calling this get services on every read/write operation is not
    // performant, but I'm concered about lots of dropped connections for now,
    // so will keep it in.
    getServicesFromAppConnectedDevice();

    if (!deviceIsAppConnected || deviceInfos.systemConnectedPeripheralInfo === null ||
      deviceInfos.systemConnectedPeripheralInfo ===
      defaultBluetoothContext.deviceInfo.systemConnectedPeripheralInfo
    ) {
      console.error('No connected device to check');
      return false;
    }

    if (
      deviceInfos.appConnectedPeripheralInfo === null ||
      deviceInfos.appConnectedPeripheralInfo ===
      defaultBluetoothContext.deviceInfo.appConnectedPeripheralInfo
    ) {
      console.error('No services discovered yet');
      return false;
    }

    if (
      deviceInfos.systemConnectedPeripheralInfo == null ||
      deviceInfos.systemConnectedPeripheralInfo.id == null ||
      deviceInfos.systemConnectedPeripheralInfo.id === "" ||
      deviceInfos.appConnectedPeripheralInfo == null ||
      deviceInfos.appConnectedPeripheralInfo.serviceUUIDs == null ||
      deviceInfos.appConnectedPeripheralInfo.serviceUUIDs.length === 0 ||
      deviceInfos.appConnectedPeripheralInfo.characteristics == null ||
      deviceInfos.appConnectedPeripheralInfo.characteristics.length === 0
    ) {
      console.error('Invalid peripheral info');
      return false;
    }

    return true;
  }

  const readFromCharacteristic = async (): Promise<any> => {
    // return type tbd, I think it's some kind of int array

    const okToReadWrite: boolean = await checkIfDeviceIsReadWritable();
    if (!okToReadWrite) {
      console.error('Device not read-writable');
      return;
    }

    // these IDs are complaining about null safety right now,
    // but shouldn't actually be an issue, since calling okToReadWrite first.
    // To fix, will probably want to remove all places I assign null, and
    // make sure that get services sets them to the defaults if they come
    // back empty. Also make the types of these peripheral info objects
    // not union with null.

    // I'm assuming the service and characteristic we want are the first
    // ones in the arrays.
    const deviceID: string =
      deviceInfos.systemConnectedPeripheralInfo.id;
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
    deviceInfo: deviceInfos,
    initializeDriver,
    promptUserForPermissions,
    checkForConnectedDevices: getSystemConnectedDeviceInfo,
    getServicesFromAppConnectedDevice,
    readFromCharacteristic,
  };

  return (
    <BluetoothContext.Provider value={value}>
      {children}
    </BluetoothContext.Provider>
  );
};

export default BluetoothProvider;