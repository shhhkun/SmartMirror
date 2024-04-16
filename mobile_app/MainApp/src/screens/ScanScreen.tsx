// library imports
import React from 'react';
import {
  StatusBar,
  StyleSheet,
  // Text,
  View,
  SafeAreaView,
  PermissionsAndroid,
  // NativeEventEmitter,
  Platform,
  // useState
} from 'react-native';

// my imports
import { GlobalStyles } from '../common/GlobalStyles';
import ButtonToNavigate from '../components/ButtonToNavigate';
import NiceTextArea from '../components/NiceTextArea';
import BluetoothService from '../services/BluetoothService';



async function requestLocationPermission() {
  // make sure that permisisons are all granted in device settings!

  // this is the worst function I've ever written.
  // need to break this into several functions.

  BluetoothService.requestBluetoothPermission();

  if (Platform.OS === 'android' && Platform.Version >= 23) {
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,)
      .then(result => {
        if (result) {
          console.log("Android fine location permission is granted");
          return;
        }

        // need to request location permission, or something's broken
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
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          });
      }
      );
  };
}



const doUponStartButtonPress = () => {
  console.log("Start button pressed on scan screen");

  BluetoothService.initialize();

  requestLocationPermission();
}

const doUponScanButtonPress = (): Promise<any> => {
  console.log("Scan button pressed on scan screen");

  // BluetoothService.scan()
  //   .then(results => {
  //     console.log('Discovered devices:', results);
  //     return results;
  //   })
  //   .catch(error => {
  //     console.error('Error scanning:', error);
  //     return error;
  //   });
}

const ScanScreen = () => {
  return (
    <SafeAreaView style={styles.mainStyle}>
      <StatusBar></StatusBar>

      <View style={styles.mainStyle}>
        <NiceTextArea title="Scan for Devices">
          instructions and window of nearby devices will go here
        </NiceTextArea>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponStartButtonPress()} title="Start Driver" />
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
