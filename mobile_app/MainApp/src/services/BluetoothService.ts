// wrapper class for react-native-ble-manager
import {
  PermissionsAndroid,
} from 'react-native';
import BleManager, { Peripheral, PeripheralInfo } from 'react-native-ble-manager';



class BluetoothService {
  static async initialize(): Promise<void> {
    try {
      await BleManager.start({ showAlert: true });
      console.log("BLE manager initialized (BluetoothService.initialize)");

    } catch (error) {
      console.error('Error initializing BLE manager: ${error} (BluetoothService.initialize)');
      throw error; // Re-throw the error to propagate it to the caller if needed
    }
  }

  static async requestBluetoothPermission(): Promise<void> {
    try {
      await BleManager.enableBluetooth();
      console.log("Bluetooth permission granted (BluetoothService.requestBluetoothPermission)");

    } catch (error) {
      console.error('Error requesting Bluetooth permission: ${error} (BluetoothService.requestBluetoothPermission)');
      throw error; // Re-throw the error to propagate it to the caller if needed
    }
  }

  static async requestAndroidLocationPermission(): Promise<void> {
    if (await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
      .then(result => result)) {

      console.log("Android fine location permission is already granted (BluetoothService.requestAndroidLocationPermission)");
      return;
    }

    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location to use Bluetooth.',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    ).then(result => {
      if (result) {
        console.log('Prompted Android user for location. User accepted. (BluetoothService.requestAndroidLocationPermission)');
        return;

      } else {
        console.error('Prompted Android user for location. User denied. (BluetoothService.requestAndroidLocationPermission)');
        throw new Error("Android location permission denied");
      }
    });
  }

  static async getConnectedPeripherals(): Promise<Peripheral[]> {
    try {
      const peripheralsArray: Peripheral[] =
        await BleManager.getConnectedPeripherals([]);

      console.log("Connected peripherals count: " + peripheralsArray.length);

      return peripheralsArray;

    } catch (error) {
      console.error('Error getting connected peripherals:', error);

      throw error; // Re-throw the error to propagate it to the caller
    }
  }

  static async checkIfConnected(deviceID: string): Promise<boolean> {
    try {
      const isConnected: boolean =
        await BleManager.isPeripheralConnected(deviceID);

      return isConnected;

    } catch (error) {
      console.error('Error checking if connected:', error);

      throw error; // Re-throw the error to propagate it to the caller
    }
  }

  // haven't gotten this to work yet
  static async retrieveServices(deviceID: string): Promise<PeripheralInfo> {
    // returns an object that contains this peripheral's services
    try {
      const peripheralInfo: PeripheralInfo =
        await BleManager.retrieveServices(deviceID);

      return peripheralInfo;

    } catch (error) {
      console.error('Error retrieving services:', error);

      throw error; // Re-throw the error to propagate it to the caller
    }
  }

  // haven't gotten this to work yet
  static async read(deviceID: string, serviceUUID: string,
    characteristicUUID: string): Promise<any> {

    const deviceIsIsStillConnected: boolean =
      await BleManager.isPeripheralConnected(deviceID);
    if (!deviceIsIsStillConnected) {
      console.error('Tried to read from disconnected device');
      return null;
    }

    const returnedData: any = BleManager.read(deviceID, serviceUUID,
      characteristicUUID);

    return returnedData;
  }

  // not implemented yet
  static write(deviceID: string, serviceUUID: string,
    characteristicUUID: string, data: number[]): Promise<void> {

    const successWritePromise: Promise<void> = BleManager.write(deviceID,
      serviceUUID, characteristicUUID, data);

    return successWritePromise;
  }

  // not implemented yet
  static disconnect(deviceID: string): Promise<void> {
    return BleManager.disconnect(deviceID);
  }
}

export default BluetoothService;