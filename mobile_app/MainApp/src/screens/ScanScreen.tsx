// library imports
import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';

// my imports
import { GlobalStyles } from '../common/GlobalStyles';
import ButtonToNavigate from '../components/ButtonToNavigate';
import NiceTextArea from '../components/NiceTextArea';
import BluetoothService from '../services/BluetoothService';

const ScanScreen = ({ navigation }: { navigation: any }) => {
  // state variables
  const [isScanning, setIsScanning] = useState(false);

  // function to call bluetooth service scan upon button press
  const doUponScanButtonPress = async () => {
    console.log("Scan button pressed on scan screen");

    if (isScanning) {
      console.log("Already scanning; ignoring button press");
      return;
    }

    try {
      await BluetoothService.scan();
      console.log("Scan started in ScanScreen.doUponScanButtonPress");
      setIsScanning(true);
    }

    catch (error) {
      console.error('Error starting scan:', error);
    }
  };

  // UI stuff here
  return (
    <SafeAreaView style={styles.mainStyle}>
      <StatusBar></StatusBar>

      <View style={styles.mainStyle}>
        <NiceTextArea title="Scan for Devices">
          instructions and window of nearby devices will go here
        </NiceTextArea>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponScanButtonPress()} title="Scan" />
      </View>

      <View style={styles.mainStyle}>
        <NiceTextArea title="Output of Scan">
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
