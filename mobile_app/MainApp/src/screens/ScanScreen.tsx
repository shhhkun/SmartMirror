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



const ScanScreen = ({ navigation }: { navigation: any }) => {
  // parts of the context we need
  const {
    getBondedDevice,
    connectToBondedDevice,
    getSystemConnectedDeviceInfo
  } = useContext(BluetoothContext);

  // page-specific state stuff
  const [lastDeviceCheckTime, setLastDeviceCheckTime] = useState('never');


  // function to retireve connected devices upon button press
  const doUponSystemConnectedDevicesButton = async (): Promise<void> => {
    try {
      await getSystemConnectedDeviceInfo();
      setLastDeviceCheckTime(new Date().toLocaleTimeString());

    } catch (error) {
      console.error('Error checking for connected devices:', error);
      setLastDeviceCheckTime(`Error: ${new Date().toLocaleTimeString()}`);
    }
  };

  const doUponBondedDeviceButton = async (): Promise<void> => {
    try {
      await getBondedDevice();
    } catch (error) {
      console.error('Error checking for bonded devices in UI:', error);
    }
  };

  const doUponConnectToBondedDeviceButton = async (): Promise<void> => {
    try {
      await connectToBondedDevice();
    } catch (error) {
      console.error('Error connecting to bonded device in UI:', error);
    }
  };


  // UI stuff here
  return (
    <SafeAreaView style={styles.mainStyle}>
      <StatusBar></StatusBar>

      <View style={styles.mainStyle}>
        <NiceTextArea title="Connected Devices">
          Pair to a peripheral in your device settings,
          then press the "show system connected devices" button.
        </NiceTextArea>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponBondedDeviceButton()}
          title="Get Bonded Devices" />
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponConnectToBondedDeviceButton()}
          title="Connect to Bonded Device" />
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponSystemConnectedDevicesButton()}
          title="Get Info About System Connected Device" />
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => navigation.navigate("DeviceDetail")}
          title="Go to Device Detail Page" />
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
