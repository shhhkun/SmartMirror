import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import ButtonToNavigate from '../components/ButtonToNavigate';
import NiceTextArea from '../components/NiceTextArea';


const HomeScreen = () => {

  return (
    <View style={styles.mainStyle}>
      <StatusBar></StatusBar>

      <View style={styles.mainStyle}>

        <NiceTextArea title="Team 3 Smart Mirror">
          This mobile app is an interface for sending a JSON configuration file
          to the Smart Mirror via BLE. Press the button below to begin the flow.
        </NiceTextArea>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={console.log("hi")} title="Action Button" />
      </View>

    </View >
  );
};

const styles = StyleSheet.create({
  mainStyle: {
    backgroundColor: Colors.lighter,
  },

  buttonContainer: {
    // flex: 1, // using flexbox here is cursed
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },

});

export default HomeScreen;
