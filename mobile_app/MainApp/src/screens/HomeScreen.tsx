import React from 'react';
import {
  SafeAreaView, StatusBar, StyleSheet, Text, View
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import ButtonToNavigate from '../components/ButtonToNavigate';

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

const NiceTextArea = ({ children, title: titleToDisplay }: SectionProps) => {

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={styles.sectionTitle}>
        {titleToDisplay}
      </Text>
      <Text
        style={styles.sectionDescription}>
        {children}
      </Text>
    </View>
  );
};

const HomeScreen = () => {

  const backgroundStyle = {
    backgroundColor: Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <View
        style={{
          backgroundColor: Colors.white,
        }}>
        <NiceTextArea title="Team 3 Smart Mirror">
          This mobile app is an interface for sending a JSON configuration file
          to the Smart Mirror via BLE. Press the button below to begin the flow.

        </NiceTextArea>
      </View>

      <View
        style={styles.buttonContainer}>

        <ButtonToNavigate onPress={console.log("hi")} title="Action Button" />
      </View>

    </SafeAreaView >
  );
};

const styles = StyleSheet.create({

  buttonContainer: {
    // flex: 1, // using flexbox here is cursed
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark
  },
  highlight: {
    fontWeight: '700',
  },
});

export default HomeScreen;
