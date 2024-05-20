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
  DeviceStates,
  DeviceInfos,
  TargetInfos,
  defaultBluetoothContext,
} from './BluetoothContext';
import {
  selectOurDeviceFromBondedDevices,
  selectOurServiceAndCharacteristic
} from './BluetoothUtils';
import BluetoothService from './BluetoothService';



const BluetoothProvider: FC<PropsWithChildren> = ({ children }) => {
  const [deviceStates, setDeviceStates] =
    useState<DeviceStates>(defaultBluetoothContext.deviceStates);
  const [deviceInfos, setDeviceInfos] =
    useState<DeviceInfos>(defaultBluetoothContext.deviceInfos);
  const [targetInfos, setTargetInfos] =
    useState<TargetInfos>(defaultBluetoothContext.targetInfos);



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

    const newTargetInfos: TargetInfos = selectOurServiceAndCharacteristic(
      appConnectedPeripheralInfo);

    setTargetInfos(newTargetInfos);
  }

  const setTargetFieldsToDefault = (): void => {
    setTargetInfos(defaultBluetoothContext.targetInfos);
  }

  const setSystemConnectedDeviceInfoToDefault = (): void => {
    setDeviceInfos(defaultBluetoothContext.deviceInfos);

    // set app connected state to false
    setDeviceStates({
      bluetoothPermissionsOK: deviceStates.bluetoothPermissionsOK,
      deviceIsBonded: deviceStates.deviceIsBonded,
      deviceIsSystemConnected: false,
      deviceIsAppConnected: deviceStates.deviceIsAppConnected,
    });

    setTargetFieldsToDefault();
  }

  const setAppConnectedDeviceInfoToFailed = (): void => {
    // set app connected state to false
    setDeviceStates({
      bluetoothPermissionsOK: deviceStates.bluetoothPermissionsOK,
      deviceIsBonded: deviceStates.deviceIsBonded,
      deviceIsSystemConnected: deviceStates.deviceIsSystemConnected,
      deviceIsAppConnected: false,
    });

    // reset app connected info
    setDeviceInfos({
      // maintain bonded device info
      bondedDeviceInfo:
        deviceInfos.bondedDeviceInfo,

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
      await BluetoothService.connectToDevice(deviceID);

      // set device app connected state to true
      setDeviceStates({
        bluetoothPermissionsOK: deviceStates.bluetoothPermissionsOK,
        deviceIsBonded: deviceStates.deviceIsBonded,
        deviceIsSystemConnected: deviceStates.deviceIsSystemConnected,
        deviceIsAppConnected: true,
      });

    }
    catch (error) {
      console.error('Error connecting to device in appConnectToDevice:', error);
      setAppConnectedDeviceInfoToFailed();
      throw error;
    }
  }

  const retrieveServicesFromConnectedDevice = async (
    deviceID: string): Promise<void> => {
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
        // maintain bonded device info
        bondedDeviceInfo:
          deviceInfos.bondedDeviceInfo,

        // maintaitn system connected info
        systemConnectedPeripheralInfo:
          deviceInfos.systemConnectedPeripheralInfo,

        // update app connected info
        appConnectedPeripheralInfo:
          peripheralRetrievedServicesInfo,
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
    if (targetInfos.targetDeviceID ===
      defaultBluetoothContext.targetInfos.targetDeviceID ||
      targetInfos.targetServiceUUID ===
      defaultBluetoothContext.targetInfos.targetServiceUUID ||
      targetInfos.targetCharacteristicUUID ===
      defaultBluetoothContext.targetInfos.targetCharacteristicUUID) {

      console.error('No target device, service, or characteristic set');
      return false;
    }

    return true;
  }

  // not yet implemented
  const checkIfDeviceIsReadable = async (serviceUUID: string,
    characteristicUUID: string): Promise<boolean> => {
    // todo
    // will call checkIfDeviceIsReadWritable, and check if read is allowed

    if (!await checkIfDeviceIsReadWritable()) {
      return false;
    }

    // todo

    return false;
  }

  // not yet implemented
  const checkIfDeviceIsWritable = async (serviceUUID: string,
    characteristicUUID: string): Promise<boolean> => {
    // todo
    // will call checkIfDeviceIsReadWritable, and check if write is allowed

    if (!await checkIfDeviceIsReadWritable()) {
      return false;
    }

    // todo

    return false;
  }



  // functions for the UI to interact with the bluetooth service
  const promptUserForPermissions = async (): Promise<void> => {
    if (deviceStates.bluetoothPermissionsOK) {
      return;
    }

    try {
      await BluetoothService.requestAllPermissions();

      // set bluetooth permission state true
      setDeviceStates({
        bluetoothPermissionsOK: true,
        deviceIsBonded: deviceStates.deviceIsBonded,
        deviceIsSystemConnected: deviceStates.deviceIsSystemConnected,
        deviceIsAppConnected: deviceStates.deviceIsAppConnected,
      });

    } catch (error) {
      // set bluetooth permission state false
      setDeviceStates({
        bluetoothPermissionsOK: false,
        deviceIsBonded: deviceStates.deviceIsBonded,
        deviceIsSystemConnected: deviceStates.deviceIsSystemConnected,
        deviceIsAppConnected: deviceStates.deviceIsAppConnected,
      });
    }
  }

  const getBondedDevice = async (): Promise<void> => {
    // gets the list of bonded devices. and then populates bonded device info
    // in context.

    try {
      const bondedDevices: Peripheral[] =
        await BluetoothService.getBondedPeripherals();

      console.log('Bonded devices array: ', JSON.stringify(bondedDevices, null, 2));

      if (bondedDevices.length == 0) {
        console.log('No bonded devices found');
        return;
      }

      // select which of the peripherals to use, based on some filtering rule
      const bondedDeviceOfInterest: Peripheral =
        selectOurDeviceFromBondedDevices(bondedDevices);

      console.log('Bonded device of interest: ',
        JSON.stringify(bondedDeviceOfInterest, null, 2));

      setDeviceInfos({
        // set the bonded device info to this device
        bondedDeviceInfo:
          bondedDeviceOfInterest,

        // maintain system connected info
        systemConnectedPeripheralInfo:
          defaultBluetoothContext.deviceInfos.systemConnectedPeripheralInfo,

        // maintain app connected info
        appConnectedPeripheralInfo:
          defaultBluetoothContext.deviceInfos.appConnectedPeripheralInfo,
      });
    }
    catch (error) {
      console.error('Error getting bonded devices from context provider:', error);
    }
  }

  const connectToBondedDevice = async (): Promise<void> => {

    // make sure we have info about a bonded device of interest
    if (deviceInfos.bondedDeviceInfo === null ||
      deviceInfos.bondedDeviceInfo ===
      defaultBluetoothContext.deviceInfos.bondedDeviceInfo
    ) {
      console.error('No bonded device to connect to');
      return;
    }

    // attempt to connect to the bonded device
    try {
      await BluetoothService.connectToDevice(deviceInfos.bondedDeviceInfo.id);
      console.log('Successfully connected to bonded device');

    } catch (error) {
      console.error('Error connecting to bonded device in connectToBondedDevice:', error);
    }
  }

  const getSystemConnectedDeviceInfo = async (): Promise<void> => {
    // checks for devices connected to the phone, which may or may not actually
    // have an app-specific connection. then sets the system connected device info.
    // this function resets the app-specific info to defaults, for the case we've
    // connected to a different device since app info was written.

    if (!deviceStates.bluetoothPermissionsOK) {
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
      // leave bonded device info as it was
      bondedDeviceInfo:
        deviceInfos.bondedDeviceInfo,

      // for now, just assume we want the first connected device
      // todo: might want to eventaully make a filtering function in utils
      // to select only our device.
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

    // use the device ID from system connected
    const deviceID: string = deviceInfos.systemConnectedPeripheralInfo?.id ||
      defaultBluetoothContext.targetInfos.targetDeviceID;

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

  // haven't seen this work yet. not using rn.
  const appConnectFromBonded = async (): Promise<void> => {
    // this failed when I tried it. however, the indivudual steps work when
    // triggered from buttons. maybe need to have delays between.
    try {
      await connectToBondedDevice();
      await getSystemConnectedDeviceInfo();
      await connectAndGetAppConnectedDeviceInfo();

    } catch (error) {
      console.error('Error connecting from bonded:', error);
      throw error;
    }
  }

  const readFromCharacteristic = async (): Promise<number[]> => {
    // returns a byte array

    const okToReadWrite: boolean = await checkIfDeviceIsReadWritable();
    if (!okToReadWrite) {
      console.error('Device not read-writable (readFromCharacteristic)');
      return [];
    }

    // do the actual read operation
    try {
      // use the targets stored in the target states
      const returnedData: number[] = await BluetoothService.read(
        targetInfos.targetDeviceID,
        targetInfos.targetServiceUUID,
        targetInfos.targetCharacteristicUUID);

      console.log('Read data: ', returnedData);

      return returnedData;
    }
    catch (error) {
      console.error('Error reading from characteristic in provider:', error);
      throw error;
    }
  }

  const writeDataToCharacteristic = async (data: number): Promise<void> => {
    // for now, just accepting data as an int

    const okToReadWrite: boolean = await checkIfDeviceIsReadWritable();
    if (!okToReadWrite) {
      console.error('Device not read-writable (writeDataToCharacteristic)');
      return;
    }

    try {
      await BluetoothService.writeInt(
        targetInfos.targetDeviceID,
        targetInfos.targetServiceUUID,
        targetInfos.targetCharacteristicUUID,
        data);

      console.log('Wrote data: ', data);

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
    deviceStates,
    deviceInfos,
    targetInfos,
    promptUserForPermissions,
    getBondedDevice,
    connectToBondedDevice,
    getSystemConnectedDeviceInfo,
    connectAndGetAppConnectedDeviceInfo,
    appConnectFromBonded,
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