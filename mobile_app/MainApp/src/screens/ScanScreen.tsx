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
  const { deviceInfos, getSystemConnectedDeviceInfo } = useContext(BluetoothContext);
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
        <ButtonToNavigate onPress={() => doUponSystemConnectedDevicesButton()}
          title="Show System Connected Devices" />
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => navigation.navigate("DeviceDetail")}
          title="Go to Device Details Page" />
      </View>


      <View style={styles.mainStyle}>
        <NiceTextArea title="Peripheral Basic Info">

          {/* might want some hook here that displays real time connected status */}

          Last update time: {lastDeviceCheckTime}

          {"\n"}

          {JSON.stringify(deviceInfos.systemConnectedPeripheralInfo, null, 2)}
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
