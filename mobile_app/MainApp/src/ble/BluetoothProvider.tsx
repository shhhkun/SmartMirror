import React, {
  FC,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import {
  Peripheral,
  PeripheralInfo,
} from "react-native-ble-manager";

import {
  BluetoothContext,
  BluetoothContextType,
  DeviceStates,
  DeviceInfos,
  TargetInfos,
  CharacteristicsMap,
  defaultBluetoothContext,
} from './BluetoothContext';
import {
  selectOurDeviceFromBondedDevices,
  selectTargetServiceAndCharacteristic,
  // parseModuleNamesAndCharacteristics
} from './BluetoothUtils';
import BluetoothService from './BluetoothService';



const BluetoothProvider: FC<PropsWithChildren> = ({ children }) => {
  const [deviceStates, setDeviceStates] =
    useState<DeviceStates>(defaultBluetoothContext.deviceStates);
  const [deviceInfos, setDeviceInfos] =
    useState<DeviceInfos>(defaultBluetoothContext.deviceInfos);
  const [targetInfos, setTargetInfos] =
    useState<TargetInfos>(defaultBluetoothContext.targetInfos);
  const [characteristicsMap, setCharacteristicsMap] =
    useState<CharacteristicsMap>(defaultBluetoothContext.characteristicsMap);



  // helper functions
  const initializeDriver = async (): Promise<void> => {
    try {
      await BluetoothService.initializeBLEManager();
    }
    catch (error) {
      console.error('Error initializing BLE driver:', error);
    }
  };

  const updateTargetsFromAppPeripheralInfo = (appConnectedPeripheralInfo:
    PeripheralInfo): void => {

    const newTargetInfos: TargetInfos = selectTargetServiceAndCharacteristic(
      appConnectedPeripheralInfo);

    setTargetInfos(newTargetInfos);
  };

  // populateCharacteristicsMap not implemented rn.
  {
    // const populateCharacteristicsMap = (appConnectedPeripheralInfo:
    //   PeripheralInfo): void => {
    //   // will take the retrieveServices PeripheralInfo array and populate the
    //   // characteristicsMap with module names and characteristic UUIDs.

    //   // thisn function is just hard coded for now.
    //   setCharacteristicsMap(
    //     parseModuleNamesAndCharacteristics(appConnectedPeripheralInfo)
    //   );
    // }
  }

  const setTargetFieldsToDefault = (): void => {
    setTargetInfos(defaultBluetoothContext.targetInfos);
  };

  const setSystemConnectedDeviceInfoToDefault = (): void => {
    setDeviceInfos(defaultBluetoothContext.deviceInfos);

    setDeviceStates({
      ...deviceStates,
      deviceIsSystemConnected: false
    });

    setTargetFieldsToDefault();
  };

  const setAppConnectedDeviceInfoToFailed = (): void => {
    // set app connected state to false
    setDeviceStates({
      ...deviceStates,
      deviceIsAppConnected: false,
    });

    // reset app connected info, maintain bonded and system connected
    setDeviceInfos({
      ...deviceInfos,
      appConnectedPeripheralInfo:
        defaultBluetoothContext.deviceInfos.appConnectedPeripheralInfo,
    });

    setTargetFieldsToDefault();
  };

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
  };

  const appConnectToDevice = async (deviceID: string): Promise<void> => {
    try {
      await BluetoothService.connectToDevice(deviceID);

      setDeviceStates({
        ...deviceStates,
        deviceIsAppConnected: true
      });

    }
    catch (error) {
      console.error('Error connecting to device in appConnectToDevice:', error);
      setAppConnectedDeviceInfoToFailed();
      throw error;
    }
  };

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

      setDeviceInfos({
        ...deviceInfos,
        appConnectedPeripheralInfo: peripheralRetrievedServicesInfo
      });

      // update targets. for the "main" characteristic
      updateTargetsFromAppPeripheralInfo(peripheralRetrievedServicesInfo);

      // update the characteristics map. for module names and characteristic UUIDs
      // not using this rn.
      // populateCharacteristicsMap(peripheralRetrievedServicesInfo);

    }
    catch (error) {
      console.error('Error getting services from connected device:', error);
      setAppConnectedDeviceInfoToFailed();
      throw error;
    }
  };

  const checkIfDeviceIsReadWritable = async (): Promise<boolean> => {
    // this function only returns a bool. doesn't throw errors.

    // make sure we have system device info saved
    if (deviceInfos.systemConnectedPeripheralInfo === null ||
      deviceInfos.systemConnectedPeripheralInfo ===
      defaultBluetoothContext.deviceInfos.systemConnectedPeripheralInfo
    ) {
      console.error('No connected device to check. Returning false from checkIfDeviceIsReadWritable');
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
  };




  // functions for the UI to interact with the bluetooth service
  const promptUserForPermissions = async (): Promise<void> => {
    if (deviceStates.bluetoothPermissionsOK) {
      return;
    }

    try {
      await BluetoothService.requestAllPermissions();

      setDeviceStates({
        ...deviceStates,
        bluetoothPermissionsOK: true,
      });

    } catch (error) {
      setDeviceStates({
        ...deviceStates,
        bluetoothPermissionsOK: false
      });
    }
  };

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

      // console.log('Bonded device of interest: ',
      //   JSON.stringify(bondedDeviceOfInterest, null, 2));

      setDeviceInfos({
        // set the bonded device info to this device. maintain the rest.
        ...deviceInfos,
        bondedDeviceInfo: bondedDeviceOfInterest
      });
    }
    catch (error) {
      console.error('Error getting bonded devices from context provider:', error);
    }
  };

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
  };

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
      console.error('No connected devices found');
      setSystemConnectedDeviceInfoToDefault();
      return;
    }

    const systemConnectedDeviceInfo: DeviceInfos = {
      ...deviceInfos,

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
  };

  const connectAndGetAppConnectedDeviceInfo = async (): Promise<void> => {
    // iniates the app-specific connection, retrieves services, and updates
    // context with all the info needed to read/write to the device.
    // need to havesystem connected device info before calling this,
    // since uses the stored system device device ID.
    // this function can be called after connecting in lightblue or nrf and
    // just calling getSystemConnectedDeviceInfo.

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

  };

  // broken right now:
  const appConnectFromBonded = async (): Promise<void> => {
    // broken right now!!

    // this works if you first press > get bonded > connect to bonded >
    // get system connected info > this. in that case, it does get a non-empty
    // array back from system connected info.

    // however, if you do get bonded > this, then system connected info returns
    // an empty array. so that's the problem.

    // maybe the issue in here is how state stuff is modified within a function.
    // I'm writing a new state in here, then trying to read that state.
    // But it's probably pulling the old state from when the function was
    // originally called?
    // although even when I tried calling the "get connected devices" function
    // straight from react-native-ble-manager, it still returned an empty array.

    try {
      console.log('Calling connectToBondedDevice');
      await connectToBondedDevice();

      // 5 sec delay, just to be safe
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // !!!!!! this is getting an empty array right now for some reason !!!!!!
      console.log('Calling getSystemConnectedDeviceInfo');
      await getSystemConnectedDeviceInfo();

      // another 5 sec delay, just to be safe
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // this part seems to work fine if system connected info is not empty
      console.log('Calling connectAndGetAppConnectedDeviceInfo');
      await connectAndGetAppConnectedDeviceInfo();

    } catch (error) {
      console.error('Error connecting from bonded:', error);
      throw error;
    }
  };

  const readFromTargetCharacteristic = async (): Promise<number[]> => {
    return await readFromAnyCharacteristic(targetInfos.targetCharacteristicUUID);
  };

  const readFromAnyCharacteristic = async (
    characteristicUUID: string): Promise<number[]> => {
    // basically the same function as above, except characteristic can be specified

    const okToReadWrite: boolean = await checkIfDeviceIsReadWritable();
    if (!okToReadWrite) {
      console.error('Device not read-writable (readFromAnyCharacteristic)');
      return [];
    }

    // do the actual read operation
    try {
      // use the targets stored in the target states
      const returnedData: number[] = await BluetoothService.readFromDevice(
        targetInfos.targetDeviceID,
        targetInfos.targetServiceUUID,
        characteristicUUID);

      console.log('Read data: ' + returnedData +
        ' from char: ' + characteristicUUID);

      return returnedData;
    }
    catch (error) {
      console.error('Error reading from char ' + characteristicUUID +
        ' in readFromAnyCharacteristic:', error);
      throw error;
    }
  };

  // this should be renamed to writeIntToTargetCharacteristic
  const writeDataToCharacteristic = async (data: number): Promise<void> => {

    return await writeByteArrayToAnyCharacteristic([data],
      targetInfos.targetCharacteristicUUID);
  };

  const writeByteArrayToAnyCharacteristic = async (data: number[],
    characteristicUUID: string): Promise<void> => {
    // this fucntion now throws errors! changed on 5-29-24. didn't previously.

    const okToReadWrite: boolean = await checkIfDeviceIsReadWritable();
    if (!okToReadWrite) {
      throw new Error('Device not read-writable (writeByteArrayToAnyCharacteristic)');
    }

    try {
      await BluetoothService.writeByteArray(
        targetInfos.targetDeviceID,
        targetInfos.targetServiceUUID,
        characteristicUUID,
        data);

      console.log('Successfully wrote data: ', data, ' to char: ', characteristicUUID,);

    } catch (error) {
      console.error('Error writing to char in writeByteArrayToAnyCharacteristic:', error);
    }

  };



  // constructor-like thing that runs when context is created
  useEffect(() => {
    initializeDriver();
  }, []);



  // return the context provider
  const value: BluetoothContextType = {
    deviceStates,
    deviceInfos,
    targetInfos,
    characteristicsMap,
    promptUserForPermissions,
    getBondedDevice,
    connectToBondedDevice,
    getSystemConnectedDeviceInfo,
    connectAndGetAppConnectedDeviceInfo,
    appConnectFromBonded,
    readFromTargetCharacteristic,
    readFromAnyCharacteristic,
    writeDataToCharacteristic,
    writeByteArrayToAnyCharacteristic
  };

  return (
    <BluetoothContext.Provider value={value}>
      {children}
    </BluetoothContext.Provider>
  );
};

export default BluetoothProvider;