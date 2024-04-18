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
  // function to retireve connected devices upon button press
  const doUponConnectedDevicesButton = async () => {
    try {
      const peripheralsArray: Peripheral[] =
        await BluetoothService.getConnectedPeripherals();

      console.log("Connected peripherals count:", peripheralsArray.length);

      console.log("Connected peripherals array returned:",
        JSON.stringify(peripheralsArray, null, 2));

    } catch (error) {
      console.error('Error getting connected peripherals:', error);
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
          todo
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
