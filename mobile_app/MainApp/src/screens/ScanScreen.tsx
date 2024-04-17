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

const doUponStartButtonPress = () => {
  console.log("Start button pressed on scan screen");

  BluetoothService.initialize();

  requestPermissions();
};

const doUponScanButtonPress = (): Promise<void> => {
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
