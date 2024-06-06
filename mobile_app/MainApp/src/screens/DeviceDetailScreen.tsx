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
  // stuff needed from the context provider. just have these in from when I was testing.
  const {
    readFromCharacteristic,
    writeDataToCharacteristic,
  } = useContext(BluetoothContext);

  // page-specific state stuff
  const [readData, setReadData] = useState<any>(null);


  // not using pure read function for now
  {
    // const doUponReadButtonPress = async (): Promise<void> => {
    //   try {
    //     const returnedData: number[] = await readFromCharacteristic();
    //     setReadData(returnedData);
    //     console.log('Read from characteristic button pressed');
    //   }
    //   catch (error) {
    //     console.error('Error reading from characteristic:', error);
    //   }
    // };
  }

  // not using pure write function for now
  {
    // const doUponWriteButtonPress = async (): Promise<void> => {
    //   const dataValue: number = 80;

    //   try {
    //     await writeDataToCharacteristic(dataValue);
    //     console.log('Write to characteristic button pressed');
    //   }
    //   catch (error) {
    //     console.error('Error writing to characteristic from UI:', error);
    //   }
    // };
  }



  // UI stuff here
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


      {/* hiding the testing read and write buttons. */}
      {/* <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponReadButtonPress()}
          title="Read from Characteristic" />
      </View>
      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponWriteButtonPress()}
          title="Write to Characteristic" />
      </View> */}

      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <ButtonToNavigate onPress={() => navigation.navigate("Profile Selection")}
            title="Manually Change Profiles" />
        </View>

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
