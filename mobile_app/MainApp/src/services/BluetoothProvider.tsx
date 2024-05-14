import React, {
  FC,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import {
  Peripheral,
  PeripheralInfo,
  Service,
  Characteristic,
} from "react-native-ble-manager";

import {
  BluetoothContext,
  BluetoothContextType,
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
    try {
      await BluetoothService.initializeBLEManager();
    }
    catch (error) {
      console.error('Error initializing BLE driver:', error);
    }
  }

  const updateTargetsFromAppPeripheralInfo = (appConnectedPeripheralInfo:
    PeripheralInfo): void => {
    // this assumes we're only going to have one service.
    // and for now, this just selects the first characteristic.

    const deviceID: string = appConnectedPeripheralInfo?.id ||
      defaultBluetoothContext.targetDeviceID;
    setTargetDeviceID(deviceID);


    const servicesArray: Service[] = appConnectedPeripheralInfo?.services ?? [];
    const specificService: Service = servicesArray[0] ?? {};

    const serviceUUID: string = specificService?.uuid ??
      defaultBluetoothContext.targetServiceUUID;

    setTargetServiceUUID(serviceUUID);


    const characteristicsArray: Characteristic[] =
      appConnectedPeripheralInfo?.characteristics ?? [];
    const specificCharacteristic: Characteristic = characteristicsArray[0] ?? {};

    const characteristicUUID: string = specificCharacteristic?.characteristic ??
      defaultBluetoothContext.targetCharacteristicUUID;

    setTargetCharacteristicUUID(characteristicUUID);
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
      // maintain whatever was in system connected info
      systemConnectedPeripheralInfo:
        deviceInfos.systemConnectedPeripheralInfo,

      // reset app connected info
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
    try {
      const isConnected: boolean =
        await BluetoothService.checkIfDeviceIsSystemConnected(deviceID);

      if (!isConnected) {
        console.error('Device disconnected (verifySystemDeviceConnected)');
        setSystemConnectedDeviceInfoToDefault();
        return false;
      }
      return true;

    }
    catch (error) {
      console.error('Error checking if connected:', error);
      return false;
    }
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

      // actually get the services
      const peripheralRetrievedServicesInfo: PeripheralInfo =
        await BluetoothService.retrieveServices(deviceID);

      console.log('Peripheral extended info: ',
        JSON.stringify(peripheralRetrievedServicesInfo, null, 2));

      // update fields in context
      setDeviceInfos({
        systemConnectedPeripheralInfo: deviceInfos.systemConnectedPeripheralInfo,
        appConnectedPeripheralInfo: peripheralRetrievedServicesInfo,
      });

      updateTargetsFromAppPeripheralInfo(peripheralRetrievedServicesInfo);

    }
    catch (error) {
      console.error('Error getting services from connected device:', error);
      setAppConnectedDeviceInfoToFailed();
      throw error;
    }
  }

  const checkIfDeviceIsReadWritable = async (): Promise<boolean> => {
    // this function only returns a bool. doesn't throw errors.

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

  // this function is jank and doesn't do what it says!
  // now it discovers a peripohgeral and connects to it.
  const getBondedDevices = async (): Promise<void> => {
    try {
      const bondedDevices: Peripheral[] =
        await BluetoothService.getBondedPeripherals();

      console.log('Bonded devices: ', JSON.stringify(bondedDevices, null, 2));

      console.log('setting system connected device info to first bonded device');
      setDeviceInfos({
        systemConnectedPeripheralInfo:
          bondedDevices[0],
        appConnectedPeripheralInfo:
          defaultBluetoothContext.deviceInfos.appConnectedPeripheralInfo,
      });

      try {
        console.log('app connecting to first bonded device');
        await appConnectToDevice(bondedDevices[0].id);
      }
      catch (error) {
        console.error('Error app connecting to bonded device:', error);
      }

    }
    catch (error) {
      console.error('Error getting bonded devices from context provider:', error);
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

    const systemConnectedDeviceInfo: DeviceInfos = {
      // for now, just assume we want the first connected device
      systemConnectedPeripheralInfo:
        peripheralsArray[0],

      // reset app connected info, in the event it was for a different device
      appConnectedPeripheralInfo:
        defaultBluetoothContext.deviceInfos.appConnectedPeripheralInfo,
    };

    console.log('System connected device info: ',
      JSON.stringify(systemConnectedDeviceInfo, null, 2));

    setDeviceInfos(systemConnectedDeviceInfo);
    setTargetFieldsToDefault();
  }

  const hardConnectToDevice = async (deviceID: string): Promise<void> => {
    // this function is temp for now! just want the ability to go from
    // bonded device to app connected device.
    try {
      await appConnectToDevice(deviceID);

      // update system device info

      // update app-connected info
      await retrieveServicesFromConnectedDevice(deviceID);
    }
    catch (error) {
      console.error('Error hard connecting to device:', error);
      throw error;
    }
  }

  const connectAndGetAppConnectedDeviceInfo = async (): Promise<void> => {
    // iniates the app-specific connection, retrieves services, and updates context
    // with all the info needed to read/write to the device. need to have
    // system connected device info before calling this, since uses the stored
    // system device device ID.

    // make sure we're still system connected
    try {
      if (!await verifySystemDeviceConnected()) {
        console.error('System device not connected');
        return;
      }
    } catch (error) {
      console.error('Error verifying system device connection:', error);
      return;
    }

    const deviceID: string = deviceInfos.systemConnectedPeripheralInfo?.id ||
      defaultBluetoothContext.targetDeviceID;

    // actually connect and get services
    try {
      await appConnectToDevice(deviceID);
      await retrieveServicesFromConnectedDevice(deviceID);

    } catch (error) {
      console.error('Error connecting to device or retrieving services:', error);
      setAppConnectedDeviceInfoToFailed();
      throw error;
    }

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
      console.error('Error reading from characteristic in provider:', error);
      throw error;
    }
  }

  // this write wasn't working earlier. todo: need to test again.
  const writeDataToCharacteristic = async (data: number): Promise<void> => {
    // for now, just accepting data as an int

    const okToReadWrite: boolean = await checkIfDeviceIsReadWritable();
    if (!okToReadWrite) {
      console.error('Device not read-writable (writeDataToCharacteristic)');
      return;
    }

    try {
      BluetoothService.writeInt(targetDeviceID, targetServiceUUID,
        targetCharacteristicUUID, data);
    } catch (error) {
      console.error('Error writing to characteristic in provider:', error);
    }
  }



  // constructor-like thing that runs when context is created
  useEffect(() => {
    initializeDriver();
    // eventually, could pull in data from saved state here.
  }, []);



  // return the context provider
  const value: BluetoothContextType = {
    // state info
    // I think it's okay to expose these for now, since might use for navigation
    bluetoothPermissionsOK,
    deviceIsAppConnected,
    deviceInfos,
    targetDeviceID,
    targetServiceUUID,
    targetCharacteristicUUID,

    // functions I wish to expose to the UI
    promptUserForPermissions,
    getBondedDevices,
    getSystemConnectedDeviceInfo,
    connectAndGetAppConnectedDeviceInfo,
    readFromCharacteristic,
    writeDataToCharacteristic,
  };

  return (
    <BluetoothContext.Provider value={value}>
      {children}
    </BluetoothContext.Provider>
  );
};

export default BluetoothProvider;