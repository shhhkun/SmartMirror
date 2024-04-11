// library imports
import React from 'react';
import { StatusBar, StyleSheet, Text, View, SafeAreaView, PermissionsAndroid, Platform } from 'react-native';

// my imports
import { GlobalStyles } from '../common/GlobalStyles';
import ButtonToNavigate from '../components/ButtonToNavigate';
import NiceTextArea from '../components/NiceTextArea';
import BluetoothService from '../services/BluetoothService';



async function requestLocationPermission() {
  // hack to get through permission issues for now
  if (Platform.OS === 'android') {
    console.log('Location permission bypassed for Android');
    return true; // Simulate permission being granted on Android
  }

  // the normal way of prompting the user for location permission
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location to perform Bluetooth scanning.',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location permission granted');
    } else {
      console.log('Location permission denied');
    }
  } catch (error) {
    console.error('Error requesting location permission:', error);
  }
}




const doUponStartButtonPress = () => {
  console.log("Start button pressed on scan screen");

  BluetoothService.initialize();

  requestLocationPermission();

}

const doUponScanButtonPress = () => {
  console.log("Scan button pressed on scan screen");

  BluetoothService.scan()
    .then(results => {
      console.log('Discovered devices:', results);
      // Process discovered devices here
    })
    .catch(error => {
      console.error('Error scanning:', error);
    });
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
