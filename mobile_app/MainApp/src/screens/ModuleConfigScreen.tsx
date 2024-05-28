// library imports
import React, {
  useState,
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
import ModuleConfigBar from '../components/ModuleConfigBar';



const ModuleConfigScreen = ({ navigation }: { navigation: any }) => {

  const [clockSliderValue, setClockSliderValue] = useState(true);
  const [clockDropdownValue, setClockDropdownValue] = useState("top_left");
  const [weatherSliderValue, setWeatherSliderValue] = useState(false);
  const [weatherDropdownValue, setWeatherDropdownValue] = useState("top_right");
  const [newsSliderValue, setNewsSliderValue] = useState(true);
  const [newsDropdownValue, setNewsDropdownValue] = useState("bottom_left");

  const doUponSubmitButton = () => {
    console.log("Form state at this time:");

    console.log("Clock: ", clockSliderValue, clockDropdownValue);
    console.log("Weather: ", weatherSliderValue, weatherDropdownValue);
    console.log("News: ", newsSliderValue, newsDropdownValue);
  };

  return (
    <SafeAreaView style={styles.mainStyle}>
      <StatusBar></StatusBar>

      <ModuleConfigBar
        title="Clock"

        sliderValue={clockSliderValue}
        onSliderChange={
          (value: boolean) => setClockSliderValue(value)}

        dropdownValue={clockDropdownValue}
        onDropdownChange={
          (value: string) => setClockDropdownValue(value)}
      />

      <ModuleConfigBar
        title="Weather"

        sliderValue={weatherSliderValue}
        onSliderChange={
          (value: boolean) => setWeatherSliderValue(value)}

        dropdownValue={weatherDropdownValue}
        onDropdownChange={
          (value: string) => setWeatherDropdownValue(value)}
      />

      <ModuleConfigBar
        title="News"

        sliderValue={newsSliderValue}
        onSliderChange={
          (value: boolean) => setNewsSliderValue(value)}

        dropdownValue={newsDropdownValue}
        onDropdownChange={
          (value: string) => setNewsDropdownValue(value)}
      />

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponSubmitButton()} title="Send Changes to Mirror" />
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

export default ModuleConfigScreen;
