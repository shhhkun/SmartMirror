// library imports
import React, { useContext } from 'react';
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
import { BluetoothContext } from '../services/BluetoothContext';



const HomeScreen = ({ navigation }: { navigation: any }) => {
  // context provider stuff needed in this component
  const { promptUserForPermissions } = useContext(BluetoothContext);

  const doUponNavigateButtonPress = async (): Promise<void> => {
    try {
      await promptUserForPermissions();
      navigation.navigate("Devices")
    } catch (error) {
      console.error('Error prompting user for permissions:', error);
    }
    navigation.navigate("Devices")
  }

  return (
    <SafeAreaView style={styles.mainStyle}>
      <StatusBar></StatusBar>

      <View style={styles.mainStyle}>
        <NiceTextArea title="Team 3 Smart Mirror">
          This mobile app is an interface for sending a JSON configuration file
          to the Smart Mirror via BLE. Press the button below to connect you device.
        </NiceTextArea>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponNavigateButtonPress()} title="Go To Devices Page" />
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
