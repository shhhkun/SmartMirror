import React, {
  useContext,
} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';

// BLE service really shouldn't be called in here. but doing for debugging.
import BluetoothService from '../ble/BluetoothService';

import { GlobalStyles } from '../common/GlobalStyles';
import ButtonToNavigate from '../components/ButtonToNavigate';
import NiceTextArea from '../components/NiceTextArea';
import { BluetoothContext } from '../ble/BluetoothContext';



const ScanScreen = ({ navigation }: { navigation: any }) => {
  // parts of the context we need
  const {
    getBondedDevice,
    connectToBondedDevice,
    getSystemConnectedDeviceInfo,
    connectAndGetAppConnectedDeviceInfo,
    // appConnectFromBonded // broken so not using rn
  } = useContext(BluetoothContext);


  // function to retireve connected devices upon button press
  const doUponGetBondedDevicesButton = async (): Promise<void> => {
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

  const doUponSystemConnectedDevicesButton = async (): Promise<void> => {
    try {
      await getSystemConnectedDeviceInfo();
    } catch (error) {
      console.error('Error checking for connected devices:', error);
    }
  };

  const doUponServicesButtonPress = async (): Promise<void> => {
    try {
      await connectAndGetAppConnectedDeviceInfo();
      console.log('Connected to device and got services in DeviceDetailScreen');

    }
    catch (error) {
      console.error('Error retrieving services:', error);
    }
  };

  // doUponFullConnectionButton really doesn't work, so hidden for now
  {
    // const doUponFullConnectionButton = async (): Promise<void> => {
    //   // this function really doesn't work

    //   // try {
    //   //   await appConnectFromBonded();
    //   // } catch (error) {
    //   //   console.error('Error doing full connection in UI:', error);
    //   // }

    //   // extremely cursed: just calling the other button functions with this
    //   await doUponGetBondedDevicesButton();

    //   await new Promise(r => setTimeout(r, 1000));

    //   await doUponConnectToBondedDeviceButton();

    //   await new Promise(r => setTimeout(r, 1000));

    //   await BluetoothService.getSystemConnectedPeripherals();
    // };
  }


  // UI stuff here
  return (
    <SafeAreaView style={styles.mainStyle}>
      <StatusBar></StatusBar>



      <View style={styles.mainStyle}>
        <NiceTextArea title="Device Pairing">
          Pair to your mirror in your device settings, then return here and
          press the "connect" buttons.
        </NiceTextArea>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <ButtonToNavigate onPress={() => doUponGetBondedDevicesButton()}
            title="Get Bonded Devices" />
        </View>

        <View style={styles.button}>
          <ButtonToNavigate onPress={() => doUponConnectToBondedDeviceButton()}
            title="Connect to Device" />
        </View>

        {/* this function doesn't really work, so hiding from the UI for now */}
        {/* <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponFullConnectionButton()}
          title="Do Full Connection" />
      </View> */}

        <View style={styles.button}>
          <ButtonToNavigate onPress={() => doUponSystemConnectedDevicesButton()}
            title="Get System Device" />
        </View>

        <View style={styles.button}>
          <ButtonToNavigate onPress={() => doUponServicesButtonPress()}
            title="Get Services" />
        </View>

        <View style={styles.button}>
          <ButtonToNavigate onPress={() => navigation.navigate("DeviceDetail")}
            title="Go to Device Detail Page" />
        </View>
      </View>

    </SafeAreaView >
  );
};



const styles = StyleSheet.create({
  mainStyle: {
    backgroundColor: GlobalStyles.lightBackground,
  },

  buttonContainer: {
    paddingTop: 40,
  },

  button: {
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.lightBackground,
  },
});



export default ScanScreen;
