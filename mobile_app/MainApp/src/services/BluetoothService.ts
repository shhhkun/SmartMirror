// wrapper class for react-native-ble-manager

import BleManager from 'react-native-ble-manager';

class BluetoothService {
  static initialize(): void {
    BleManager.start();
  }

  static scan(): Promise<any> {
    return BleManager.scan([], 5, true);
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