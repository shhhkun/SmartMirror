// library imports
import React from 'react';
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



const doUponScanButtonPress = (): Promise<void> => {
  console.log("Scan button pressed on scan screen");

  return Promise.resolve();
};

const ScanScreen = ({ navigation }: { navigation: any }) => {
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
