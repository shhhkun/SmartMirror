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
import { ModuleContext } from '../module_context/ModuleContext';
import { languageMap, unitsMap } from '../common/StandardModuleInfo';


// this page isn't done.
// this is to eventually support changing units and language settings
// on the mirror.

const SystemSettingsScreen = ({ navigation }: { navigation: any }) => {
  // bluetooth context stuff needed for this screen
  const {
    readFromTargetCharacteristic,
    writeDataToCharacteristic,
  } = useContext(BluetoothContext);

  // module context stuff needed for this screen
  const {
    systemSettings,
    setSystemSettings,
  } = useContext(ModuleContext);

  // state stuff for this screen
  // const [readData, setReadData]
  //   = useState<string>("Unknown");


  // const sendUserNumberToMirror = async (personName: string): Promise<void> => {
  //   if (!usersMap[personName]) {
  //     console.error('User not currently registered with an ID');
  //     return;
  //   }

  //   try {
  //     await writeDataToCharacteristic(usersMap[personName]);
  //   }
  //   catch (error) {
  //     console.error('Error writing to characteristic from UI:', error);
  //   }
  // };

  // const getUsersNameFromNumber = (number: number): string => {
  //   for (const [key, value] of Object.entries(usersMap)) {
  //     if (value === number) {
  //       return key;
  //     }
  //   }
  //   return 'Unknown';
  // };

  // const readUserFromMirror = async (): Promise<void> => {
  //   try {
  //     const returnedData: number[] = await readFromTargetCharacteristic();
  //     const usersName: string = getUsersNameFromNumber(returnedData[0]);
  //     setReadData(usersName);
  //   }
  //   catch (error) {
  //     console.error('Error reading from characteristic:', error);
  //     setReadData('Unknown');
  //   }
  // };


  // probably want a picker thing in here to select options.
  // and then just call the write to any characteristic with a hard coded
  // UUID in here for now.

  return (
    <SafeAreaView style={styles.mainStyle}>
      <StatusBar></StatusBar>

      <View style={styles.mainStyle}>
        <NiceTextArea title="System Settings">
          todo
        </NiceTextArea>
      </View>

      <View style={styles.userSelectButtonContainer}>
        <View style={styles.button}>
          <ButtonToNavigate onPress={() => console.log("User")} title="User" />
        </View>
      </View>

      <View style={styles.readButton}>
        <ButtonToNavigate onPress={() => console.log("hi")}
          title="Read from Characteristic" />
      </View>

    </SafeAreaView >
  );
};


const styles = StyleSheet.create({
  mainStyle: {
    backgroundColor: GlobalStyles.lightBackground,
  },

  userSelectButtonContainer: {
    paddingTop: 10,
  },

  button: {
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.lightBackground,
  },

  readButton: {
    paddingTop: 20,
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.lightBackground,
  },
});

export default SystemSettingsScreen;
