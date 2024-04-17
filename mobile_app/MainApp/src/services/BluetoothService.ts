// wrapper class for react-native-ble-manager

import BleManager from 'react-native-ble-manager';

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

  static async scan(): Promise<void> {
    try {
      await BleManager.scan([], 5, true);
      console.log("Scan started (BluetoothService.scan)");

    } catch (error) {
      console.error('Error starting scan: ${error} (BluetoothService.scan)');
      throw error; // Re-throw the error to propagate it to the caller if needed
    }
  }

  static async getConnectedPeripherals(): Promise<any[]> {
    return BleManager.getConnectedPeripherals([])
      .then((peripheralsArray) => {
        console.log("Connected peripherals count: " + peripheralsArray.length);
        return peripheralsArray;
      })

      .catch((error) => {
        console.error('Error getting connected peripherals:', error);
        throw error; // Re-throw the error to propagate it to the caller
      });
  }

  static connect(deviceUUID: string): Promise<void> {
    return BleManager.connect(deviceUUID);
  }

  static read(deviceUUID: string, serviceUUID: string, characteristicUUID: string): Promise<any> {
    return BleManager.read(deviceUUID, serviceUUID, characteristicUUID);
  }

  static write(deviceUUID: string, serviceUUID: string, characteristicUUID: string, data: number[]): Promise<void> {
    return BleManager.write(deviceUUID, serviceUUID, characteristicUUID, data);
  }

  static disconnect(deviceUUID: string): Promise<void> {
    return BleManager.disconnect(deviceUUID);
  }
}

export default BluetoothService;