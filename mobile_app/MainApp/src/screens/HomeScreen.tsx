import React, {
  useContext,
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
import { BluetoothContext } from '../ble/BluetoothContext';


const HomeScreen = ({ navigation }: { navigation: any }) => {
  // context provider stuff needed in this component
  const { promptUserForPermissions } = useContext(BluetoothContext);

  const doUponButton = async (): Promise<void> => {
    try {
      await promptUserForPermissions();
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
          This mobile app allows you to configure your Smart Mirror via
          Bluetooth. Press the button below to enable device permisisons and
          connect to your mirror.
        </NiceTextArea>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponButton()} title="Go To Device Page" />
      </View>

    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  mainStyle: {
    backgroundColor: GlobalStyles.lightBackground,
  },
  buttonContainer: {
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.lightBackground,
  }
});

export default HomeScreen;
