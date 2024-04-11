import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { GlobalStyles } from '../common/GlobalStyles';
// import { useNavigation } from '@react-navigation/native';

// import ButtonToNavigate from '../components/ButtonToNavigate';
import NiceTextArea from '../components/NiceTextArea';


const ScanScreen = () => {
  return (
    <View style={styles.mainStyle}>
      <StatusBar></StatusBar>

      <View style={styles.mainStyle}>
        <NiceTextArea title="Scan for Devices">
          testrr
        </NiceTextArea>
      </View>

      {/* <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={console.log("hi")} title="Action Button" />
      </View> */}

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

export default ScanScreen;
