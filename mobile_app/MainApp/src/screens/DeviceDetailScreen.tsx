import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  SafeAreaView,
} from 'react-native';

import { GlobalStyles } from '../common/GlobalStyles';
import ButtonToNavigate from '../components/ButtonToNavigate';
import NiceTextArea from '../components/NiceTextArea';


const DeviceDetailScreen = ({ navigation }: { navigation: any }) => {

  return (
    <SafeAreaView style={styles.mainStyle}>
      <StatusBar></StatusBar>

      <View style={styles.mainStyle}>
        <NiceTextArea title="Connected Device Details">
          Press buttons below. Serial number (basically just the BLE device ID)
          could go here.

          {/* Could have some content in here that prints out serial number or something */}
        </NiceTextArea>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <ButtonToNavigate onPress={() => navigation.navigate("Profile Selection")}
            title="Manually Change Profiles" />
        </View>

        {/* system settings page button will go in here */}
        {/* <View style={styles.button}>
          <ButtonToNavigate onPress={() => navigation.navigate("System Settings")}
            title="Configure System Settings" />
        </View> */}

        <View style={styles.button}>
          <ButtonToNavigate onPress={() => navigation.navigate('Module Configuration')}
            title="Configure Apps" />
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


export default DeviceDetailScreen;