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

const doUponRequestPermissionsButtonPress = () => {
  console.log("Request Permissions pressed on home screen");
  // request permissions
  // bring in stuff from the scan screen to here
};

const HomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaView style={styles.mainStyle}>
      <StatusBar></StatusBar>

      <View style={styles.mainStyle}>
        <NiceTextArea title="Team 3 Smart Mirror">
          This mobile app is an interface for sending a JSON configuration file
          to the Smart Mirror via BLE. Press the button below to begin the flow.
        </NiceTextArea>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponRequestPermissionsButtonPress()} title="Request Bluetooth Permissions" />
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
