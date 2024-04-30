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
  const { checkForConnectedDevices } = useContext(BluetoothContext);
  const [lastDeviceCheckTime, setLastDeviceCheckTime] = useState('never');
  // const [numberOfDevices, setNumberOfDevices] = useState(0);
  // const [connectedDeviceInfo, setConnectedDeviceInfo] = useState('none');


  // function to retireve connected devices upon button press
  const doUponConnectedDevicesButton = async (): Promise<void> => {
    try {
      await checkForConnectedDevices();
      setLastDeviceCheckTime(new Date().toLocaleTimeString());

    } catch (error) {
      console.error('Error checking for connected devices:', error);
      setLastDeviceCheckTime(`Error: ${new Date().toLocaleTimeString()}`);
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

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => navigation.navigate("DeviceDetail")}
          title="Go to Device Details Page" />
      </View>


      <View style={styles.mainStyle}>
        <NiceTextArea title="Devices List">
          Current number of connected devices: {/* {numberOfDevices} */}
          todo
          {"\n"}

          Last update time: {lastDeviceCheckTime}
          {"\n"}

          Connected devices info:
          {"\n"}
          {/* {connectedDeviceInfo} */}
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
