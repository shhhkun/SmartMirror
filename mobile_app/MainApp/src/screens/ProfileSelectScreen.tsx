// library imports
import React, {
  useContext,
  useState
} from 'react';
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



const ProfileSelectScreen = ({ navigation }: { navigation: any }) => {
  // context provider stuff needed for this screen
  const { readFromCharacteristic, writeDataToCharacteristic }
    = useContext(BluetoothContext);

  // state stuff for this screen
  const [readData, setReadData]
    = useState<number>(0);



  const profileOneButton = async () => {
    console.log("Button 1 pressed");
    await writeDataToCharacteristic(1);
  };

  const profileTwoButton = async () => {
    console.log("Button 2 pressed");
    await writeDataToCharacteristic(2);
  }

  const doUponReadButtonPress = async (): Promise<void> => {
    try {
      const returnedData: number[] = await readFromCharacteristic();
      setReadData(returnedData[0]);
      console.log('Read from characteristic button pressed');
    }
    catch (error) {
      console.error('Error reading from characteristic:', error);
    }
  }



  return (
    <SafeAreaView style={styles.mainStyle}>
      <StatusBar></StatusBar>

      <View style={styles.mainStyle}>
        <NiceTextArea title="Profile Switcher">
          Select from your options below.
        </NiceTextArea>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => profileOneButton()} title="User 1" />
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => profileTwoButton()} title="User 2" />
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponReadButtonPress()}
          title="Read from Characteristic" />
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
    // flex: 1, // using flexbox here is cursed; don't do
    paddingTop: 15,
    paddingBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.lightBackground,
  },

});


export default ProfileSelectScreen;
