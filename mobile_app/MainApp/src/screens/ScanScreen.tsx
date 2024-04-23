// library imports
import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';
import { Peripheral } from 'react-native-ble-manager';

// my imports
import { GlobalStyles } from '../common/GlobalStyles';
import ButtonToNavigate from '../components/ButtonToNavigate';
import NiceTextArea from '../components/NiceTextArea';
import BluetoothService from '../services/BluetoothService';






const ScanScreen = ({ navigation }: { navigation: any }) => {
  // state variables to show info about last connected devices status
  const [numberOfDevices, setNumberOfDevices] = useState(0);
  const [lastScanTime, setLastScanTime] = useState('never');
  const [connectedDeviceInfo, setConnectedDeviceInfo] = useState('none');


  // function to retireve connected devices upon button press
  const doUponConnectedDevicesButton = async () => {
    try {
      const peripheralsArray: Peripheral[] =
        await BluetoothService.getConnectedPeripherals();

      console.log("Connected peripherals count:", peripheralsArray.length);

      console.log("Connected peripherals array returned:",
        JSON.stringify(peripheralsArray, null, 2));

      // update our state variables and thus the UI
      setNumberOfDevices(peripheralsArray.length);
      setLastScanTime(new Date().toLocaleTimeString());

      if (peripheralsArray.length > 0) {
        // a peripheral is connected
        const successfulDeviceInfo: string = JSON.stringify(peripheralsArray, null, 2)
        setConnectedDeviceInfo(successfulDeviceInfo);
        console.log("Connected peripherals array returned:", successfulDeviceInfo);

      } else {
        setConnectedDeviceInfo('none');
      }

    } catch (error) {
      console.error('Error getting connected peripherals:', error);
      setNumberOfDevices(0);
      setLastScanTime(`Error on scan: ${new Date().toLocaleString()}`);
      setConnectedDeviceInfo('none');
    }
  };


  // UI stuff here
  return (
    <SafeAreaView style={styles.mainStyle}>
      <StatusBar></StatusBar>

      <View style={styles.mainStyle}>
        <NiceTextArea title="Connected Devices">
          Pair to a peripheral in your device settings,
          then press the "show connected devices" button.
        </NiceTextArea>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponConnectedDevicesButton()}
          title="Show Connected Devices" />
      </View>


      <View style={styles.mainStyle}>
        <NiceTextArea title="Devices List">
          Current number of connected devices: {numberOfDevices}
          {"\n"}
          Last update time: {lastScanTime}
          {"\n"}
          Connected devices info:
          {"\n"}
          {connectedDeviceInfo}
        </NiceTextArea>
      </View>


    </SafeAreaView >
  );
};







const styles = StyleSheet.create({
  mainStyle: {
    backgroundColor: GlobalStyles.lightBackground,
  },

  buttonContainer: {
    // flex: 1, // using flexbox here is cursed; don't do
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.lightBackground,
  },

});


export default ScanScreen;
