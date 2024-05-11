// wrapper class for react-native-ble-manager
import {
  PermissionsAndroid,
  Platform,
} from 'react-native';
import BleManager, {
  Peripheral,
  PeripheralInfo
} from 'react-native-ble-manager';
import {
  serializeInt
} from './BluetoothUtils';



class BluetoothService {
  static async initializeBLEManager(): Promise<void> {
    try {
      await BleManager.start({ showAlert: true });
      console.log("BLE manager initialized (BluetoothService.initialize)");

    } catch (error) {
      console.error('Error initializing BLE manager: ${error} (BluetoothService.initialize)');
      throw error; // Re-throw the error to propagate it to the caller if needed
    }
  }

  static async requestAllPermissions(): Promise<void> {
    try {
      await BluetoothService.requestBluetoothPermission();

      if (Platform.OS === 'android' && Platform.Version >= 23) {
        await BluetoothService.requestAndroidLocationPermission();
      };

      console.log("All permissions granted.");

    } catch (error) {
      console.error('Error requesting all permissions.');
      throw error;
    }
  }

  static async requestBluetoothPermission(): Promise<void> {
    try {
      await BleManager.enableBluetooth();
      // console.log("Bluetooth permission granted (BluetoothService.requestBluetoothPermission)");

    } catch (error) {
      // console.error('Error requesting Bluetooth permission: ${error} (BluetoothService.requestBluetoothPermission)');
      throw error;
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

  static async getSystemConnectedPeripherals(): Promise<Peripheral[]> {
    // in the future, could implement something here that only counts a device
    // as connected if its ID matches the format of out smart mirror.
    try {
      const peripheralsArray: Peripheral[] =
        await BleManager.getConnectedPeripherals([]);

      console.log("Connected peripherals count: " + peripheralsArray.length);

      return peripheralsArray;

    } catch (error) {
      console.error('Error getting connected peripherals:', error);

      throw error;
    }
  }

  static async checkIfDeviceIsSystemConnected(deviceID: string): Promise<boolean> {
    try {
      const isConnected: boolean =
        await BleManager.isPeripheralConnected(deviceID);

      return isConnected;

    } catch (error) {
      console.error('Error checking if connected:', error);

      throw error; // Re-throw the error to propagate it to the caller
    }
  }

  static async appConnectToDevice(deviceID: string): Promise<void> {
    try {
      await BleManager.connect(deviceID);
    }

    catch (error) {
      console.error('Error app connecting to device:', error);
      throw error; // Re-throw the error to propagate it to the caller
    }
  }

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

  static async read(deviceID: string, serviceUUID: string,
    characteristicUUID: string): Promise<any> {

    const deviceIsIsStillConnected: boolean =
      await BleManager.isPeripheralConnected(deviceID);


    if (!deviceIsIsStillConnected) {
      console.error('Tried to read from disconnected device');
      return null;
    }

    try {
      const returnedData: any = BleManager.read(deviceID, serviceUUID,
        characteristicUUID);

      return returnedData;
    }
    catch (error) {
      console.error('Error reading from characteristic:', error);
      throw error;
    }
  }

  // somewhere in the write function there is a runtime error rn.
  // "java.lang.String cannot be cast to com.facebook.react.bridge.ReadableNativeArray"
  // I'm guessing I'm passing a string where an array is expected somewhere.
  static async write(deviceID: string, serviceUUID: string,
    characteristicUUID: string, data: number[]): Promise<void> {

    try {
      BleManager.write(deviceID, serviceUUID, characteristicUUID, data);
    }
    catch (error) {
      console.error('Error writing to characteristic:', error);
      throw error;
    }
  }

  static async writeInt(deviceID: string, serviceUUID: string,
    characteristicUUID: string, intInput: number): Promise<void> {

    const serializedData: number[] = serializeInt(intInput);

    const success: Promise<void> = BluetoothService.write(deviceID, serviceUUID,
      characteristicUUID, serializedData);

    return success;
  }

  // not implemented yet
  static async disconnect(deviceID: string): Promise<void> {
    return BleManager.disconnect(deviceID);
  }
}

export default BluetoothService;