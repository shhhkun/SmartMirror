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
      const peripheralsArray = await BleManager.getConnectedPeripherals([]);

      console.log("Connected peripherals count: " + peripheralsArray.length);

      return peripheralsArray as Peripheral[];

    } catch (error) {
      console.error('Error getting connected peripherals:', error);

      throw error; // Re-throw the error to propagate it to the caller
    }
  }

  // haven't gotten this to work yet
  static async retrieveServices(deviceUUID: string): Promise<PeripheralInfo> {
    // returns an object that contains this peripheral's
    // services and characteristics.
    try {
      const peripheralInfo = await BleManager.retrieveServices(deviceUUID);

      return peripheralInfo as PeripheralInfo;

    } catch (error) {
      console.error('Error retrieving services:', error);

      throw error; // Re-throw the error to propagate it to the caller
    }
  }

  // stuff below here isn't really implemented yet
  static read(deviceUUID: string, serviceUUID: string, characteristicUUID: string):
    Promise<any> {
    // this isn't really implemented yet
    return BleManager.read(deviceUUID, serviceUUID, characteristicUUID);
  }

  static write(deviceUUID: string, serviceUUID: string, characteristicUUID: string,
    data: number[]): Promise<void> {
    // this isn't really implemented yet
    return BleManager.write(deviceUUID, serviceUUID, characteristicUUID, data);
  }

  static disconnect(deviceUUID: string): Promise<void> {
    // this isn't really implemented yet
    return BleManager.disconnect(deviceUUID);
  }
}

export default BluetoothService;