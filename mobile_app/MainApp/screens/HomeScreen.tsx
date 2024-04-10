import React from 'react';
import {
  SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, useColorScheme, View
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

const NiceTextArea = ({ children, title }: SectionProps) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const HomeScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        // top bar with time, battery, etc.
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        }}>
        <NiceTextArea title="Team 3 Smart Mirror">
          This mobile app is an interface for sending a JSON configuration file
          to the Smart Mirror via BLE. Press the button below to begin the flow.
        </NiceTextArea>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default HomeScreen;
