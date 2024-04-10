import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { GlobalStyles } from '../common/GlobalStyles';

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
