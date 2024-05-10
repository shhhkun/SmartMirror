import React, {
  useContext,
  useState,
} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';

import { GlobalStyles } from '../common/GlobalStyles';
import ButtonToNavigate from '../components/ButtonToNavigate';
import NiceTextArea from '../components/NiceTextArea';
import { BluetoothContext } from '../services/BluetoothContext';



const DeviceDetailScreen = ({ navigation }: { navigation: any }) => {
  const { deviceInfos, getServicesFromAppConnectedDevice, readFromCharacteristic } = useContext(BluetoothContext);


  const doUponServicesButtonPress = async (): Promise<void> => {
    try {
      await getServicesFromAppConnectedDevice();
      console.log('Services retrieved');

    }
    catch (error) {
      console.error('Error retrieving services:', error);
    }
  };

  const doUponReadButtonPress = async (): Promise<void> => {
    try {
      await readFromCharacteristic();
      console.log('Read from characteristic');

    }
    catch (error) {
      console.error('Error reading from characteristic:', error);
    }
  }


  // UI stuff here
  return (
    <SafeAreaView style={styles.mainStyle}>
      <StatusBar></StatusBar>

      <View style={styles.mainStyle}>
        <NiceTextArea title="Connected Device Details">
          Details for services and characteristics of the connected device.
        </NiceTextArea>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponServicesButtonPress()}
          title="Get Services" />
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponReadButtonPress()}
          title="Read" />
      </View>

      <View style={styles.mainStyle}>
        <NiceTextArea title="Peripheral Extended Info">
          {JSON.stringify(deviceInfos.appConnectedPeripheralInfo, null, 2)}
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


export default DeviceDetailScreen;
