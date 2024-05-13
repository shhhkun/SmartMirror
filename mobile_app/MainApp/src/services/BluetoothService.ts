// wrapper class for react-native-ble-manager
import {
  PermissionsAndroid,
  PermissionStatus,
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

  private static async requestBluetoothPermission(): Promise<void> {
    try {
      await BleManager.enableBluetooth();

    } catch (error) {
      throw new Error("Bluetooth permission denied");
    }
  }

  private static async requestAndroidLocationPermission(): Promise<void> {
    // if the permission is already granted, don't prompt the user
    try {
      const permissionsAlreadyEnabled = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

      if (permissionsAlreadyEnabled) {
        console.log("Android fine location permission is already granted.");
        return;
      }
    } catch (error) {
      console.error('Error checking Android fine location permission:', error);
      throw error;
    }

    try {
      const permissionPopupContent = {
        title: 'Location Permission',
        message: 'This app needs access to your location to use Bluetooth.',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      };

      // trigger the popup asking for location permission
      const permissionRequestResult: PermissionStatus =
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          permissionPopupContent
        );

      // for some reason, conditioning on "granted" doesn't work, but this does
      // work if I convert the PermissionStatus to a bool.
      const permissionRequestResultBool: boolean = Boolean(permissionRequestResult);

      if (permissionRequestResultBool) {
        console.log('Prompted Android user for location. User accepted.');
        return;

      } else {
        console.error('Prompted Android user for location. User denied.');
        // one day, might want to have a way to recover from denied permissions
        throw new Error("Android location permission denied");
      }

    } catch (error) {
      console.error('Error requesting Android location permission:', error);
      throw error;
    }
  }

  // untested rn
  static async getBondedPeripherals(): Promise<Peripheral[]> {
    try {
      const bondedPeripheralsArray: Peripheral[] =
        await BleManager.getBondedPeripherals();

      console.log("Bonded peripherals count: " + bondedPeripheralsArray.length)

      return bondedPeripheralsArray;
    }
    catch (error) {
      console.error('Error getting bonded peripherals in BLE service:', error);
      throw error;
    }
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

    if (!await BluetoothService.checkIfDeviceIsSystemConnected(deviceID)) {
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

  // something in here is not succeeding. even when sending ints directly.
  static async writeInt(deviceID: string, serviceUUID: string,
    characteristicUUID: string, intInput: number): Promise<void> {

    try {
      if (!await BluetoothService.checkIfDeviceIsSystemConnected(deviceID)) {
        console.error('Tried to write to disconnected device');
        return;
      }
    } catch (error) {
      console.error('Error checking if device is connected:', error);
      throw error;
    }

    // todo: use the real data that I'll pass in, not this dummy data.
    // const serializedData: number[] = serializeInt(intInput);
    const serializedData: number[] = [1, 2, 3, 255]

    try {
      await BleManager.write(deviceID, serviceUUID, characteristicUUID,
        serializedData);

      console.log('Write to characteristic succeeded');
    }
    catch (error) {
      // todo: this is the error I'm getting: Error writing
      console.error('Error writing to characteristic in writeInt:', error);
      throw error;
    }
  }

  // not implemented yet. un-private this when written.
  private static async disconnect(deviceID: string): Promise<void> {
    console.error('this function is not implemented yet')
    return BleManager.disconnect(deviceID);
  }
}

export default BluetoothService;