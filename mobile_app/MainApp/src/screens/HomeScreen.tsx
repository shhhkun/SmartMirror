// library imports
import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  SafeAreaView,
  PermissionsAndroid,
  Platform,
} from 'react-native';

// my imports
import { GlobalStyles } from '../common/GlobalStyles';
import ButtonToNavigate from '../components/ButtonToNavigate';
import NiceTextArea from '../components/NiceTextArea';
import BluetoothService from '../services/BluetoothService';

const requestAndroidLocationPermission = async (): Promise<void> => {
  // check if existing permission is granted
  PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,)
    .then(result => {
      if (result) {
        console.log("Android fine location permission is granted");
        return;
      }
    });

  // if we get here, we need to request location permission
  PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location Permission',
      message: 'This app needs access to your location to perform Bluetooth scanning.',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK'
    }
  )
    .then(result => {
      if (result) {
        console.log('Prompted Android user for location. User accepted.');
      } else {
        console.log('Prompted Android user for location. User denied.');
      }
    });
};

const requestPermissions = async (): Promise<void> => {
  // make sure that permisisons are all granted in device settings!

  BluetoothService.requestBluetoothPermission();

  if (Platform.OS === 'android' && Platform.Version >= 23) {
    requestAndroidLocationPermission();
  };
};

const doUponRequestPermissionsButtonPress = () => {
  console.log("Start bluetooth driver pressed on home screen");

  BluetoothService.initialize();

  requestPermissions();
};

const HomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaView style={styles.mainStyle}>
      <StatusBar></StatusBar>

      <View style={styles.mainStyle}>
        <NiceTextArea title="Team 3 Smart Mirror">
          This mobile app is an interface for sending a JSON configuration file
          to the Smart Mirror via BLE. Press the button to enable Bluetooth,
          then continue to the scan screen.
        </NiceTextArea>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponRequestPermissionsButtonPress()} title="Enable Bluetooth Driver" />
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => navigation.navigate("Scan")} title="Go To Device Scan" />
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

export default HomeScreen;
