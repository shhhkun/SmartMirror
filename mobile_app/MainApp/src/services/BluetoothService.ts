// wrapper class for react-native-ble-manager

import BleManager, { Peripheral, PeripheralInfo } from 'react-native-ble-manager';

class BluetoothService {
  static async requestBluetoothPermission(): Promise<void> {
    try {
      await BleManager.enableBluetooth();
      console.log("Bluetooth permission granted (BluetoothService.requestBluetoothPermission)");

    } catch (error) {
      console.error('Error requesting Bluetooth permission: ${error} (BluetoothService.requestBluetoothPermission)');
      throw error; // Re-throw the error to propagate it to the caller if needed
    }
  }

  static async initialize(): Promise<void> {
    try {
      await BleManager.start({ showAlert: true });
      console.log("BLE manager initialized (BluetoothService.initialize)");

    } catch (error) {
      console.error('Error initializing BLE manager: ${error} (BluetoothService.initialize)');
      throw error; // Re-throw the error to propagate it to the caller if needed
    }
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

  static read(deviceUUID: string, serviceUUID: string, characteristicUUID: string): Promise<any> {
    // this isn't really implemented yet
    return BleManager.read(deviceUUID, serviceUUID, characteristicUUID);
  }

  static write(deviceUUID: string, serviceUUID: string, characteristicUUID: string, data: number[]): Promise<void> {
    // this should run isPeripheralConnected before we attempt to write.
    // if it's not, throw some kind of error or notify the user.

    // this isn't really implemented yet
    return BleManager.write(deviceUUID, serviceUUID, characteristicUUID, data);
  }

  static disconnect(deviceUUID: string): Promise<void> {
    // this isn't really implemented yet
    return BleManager.disconnect(deviceUUID);
  }
}

export default BluetoothService;