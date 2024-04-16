// wrapper class for react-native-ble-manager

import BleManager from 'react-native-ble-manager';

class BluetoothService {
  static async initialize(): Promise<void> {
    try {
      await BleManager.start({ showAlert: true });
      console.log("BLE manager initialized");

    } catch (error) {
      console.error('Error initializing BLE manager:', error);
      throw error; // Re-throw the error to propagate it to the caller if needed
    }
  }

  static async scan(serviceUUIDs: string[], seconds: number, allowDuplicates: boolean): Promise<void> {
    try {
      await BleManager.scan(serviceUUIDs, seconds, allowDuplicates);
      console.log("Scan started");

    } catch (error) {
      console.error('Error starting scan:', error);
      throw error; // Re-throw the error to propagate it to the caller if needed
    }
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