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
import { BluetoothContext } from '../ble/BluetoothContext';



const DeviceDetailScreen = ({ navigation }: { navigation: any }) => {
  // stuff needed from the context provider
  const {
    connectAndGetAppConnectedDeviceInfo,
    readFromCharacteristic,
    writeDataToCharacteristic,
  } = useContext(BluetoothContext);

  // page-specific state stuff
  const [readData, setReadData] = useState<any>(null);



  const doUponServicesButtonPress = async (): Promise<void> => {
    try {
      await connectAndGetAppConnectedDeviceInfo();
      console.log('Connected to device and got services in DeviceDetailScreen');

    }
    catch (error) {
      console.error('Error retrieving services:', error);
    }
  };

  const doUponReadButtonPress = async (): Promise<void> => {
    try {
      const returnedData: any = await readFromCharacteristic();
      setReadData(returnedData);
      console.log('Read from characteristic button pressed');
    }
    catch (error) {
      console.error('Error reading from characteristic:', error);
    }
  };

  const doUponWriteButtonPress = async (): Promise<void> => {
    const dataValue: number = 80;

    try {
      await writeDataToCharacteristic(dataValue);
      console.log('Write to characteristic button pressed');
    }
    catch (error) {
      console.error('Error writing to characteristic from UI:', error);
    }
  };



  // UI stuff here
  return (
    <SafeAreaView style={styles.mainStyle}>
      <StatusBar></StatusBar>

      <View style={styles.mainStyle}>
        <NiceTextArea title="Connected Device Details">
          Press buttons below.
        </NiceTextArea>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponServicesButtonPress()}
          title="App-Pair and Get Services" />
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponReadButtonPress()}
          title="Read from Characteristic" />
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponWriteButtonPress()}
          title="Write to Characteristic" />
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => navigation.navigate("ProfileSelect")}
          title="Go to Profile Switcher" />
      </View>

      <View style={styles.mainStyle}>
        <NiceTextArea title="Read Data">
          {JSON.stringify(readData, null, 2)}
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
    paddingTop: 15,
    paddingBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.lightBackground,
  },
});


export default DeviceDetailScreen;
