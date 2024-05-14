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



const ModuleConfigScreen = ({ navigation }: { navigation: any }) => {

  const buttonToDoSomething = () => {
    console.log("Button pressed");
  };


  // this will be a UI with some radial buttons to select "top left",
  // "top right", etc. for each module.

  return (
    <SafeAreaView style={styles.mainStyle}>
      <StatusBar></StatusBar>

      <View style={styles.mainStyle}>
        <NiceTextArea title="Content">
          todo
        </NiceTextArea>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => buttonToDoSomething()} title="button" />
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


export default ModuleConfigScreen;
