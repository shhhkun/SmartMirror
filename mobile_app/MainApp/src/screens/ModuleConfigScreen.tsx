// library imports
import React, {
  useState,
} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
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

  const doUponResetButton = () => {
    console.log("Reset to default button pressed");
  };

  const doUponSaveButton = () => {
    console.log("Saving config button pressed");
  }

  const doUponSubmitButton = () => {
    console.log("Form state at this time:");
    console.log("Clock: ", clockSliderValue, clockDropdownValue);
    console.log("Weather: ", weatherSliderValue, weatherDropdownValue);
    console.log("News: ", newsSliderValue, newsDropdownValue);
  };

  // todo: make this not as repeated and ugly where I'm repeating module bars.
  // make this pull from the module context when it's created I think.
  return (
    <SafeAreaView style={styles.mainStyle}>
      <StatusBar></StatusBar>
      <ScrollView
        style={styles.scrollableContainer}
        showsVerticalScrollIndicator={true}>

        <ModuleConfigBar
          title="Clock"
          sliderValue={clockSliderValue}
          onSliderChange={(value: boolean) => setClockSliderValue(value)}
          dropdownValue={clockDropdownValue}
          onDropdownChange={(value: string) => setClockDropdownValue(value)}
        />

        <ModuleConfigBar
          title="Weather"
          sliderValue={weatherSliderValue}
          onSliderChange={(value: boolean) => setWeatherSliderValue(value)}
          dropdownValue={weatherDropdownValue}
          onDropdownChange={(value: string) => setWeatherDropdownValue(value)}
        />

        <ModuleConfigBar
          title="News"
          sliderValue={newsSliderValue}
          onSliderChange={(value: boolean) => setNewsSliderValue(value)}
          dropdownValue={newsDropdownValue}
          onDropdownChange={(value: string) => setNewsDropdownValue(value)}
        />


      </ScrollView>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponResetButton()}
          title="Reset to Default"
        />
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponSaveButton()}
          title="Save Changes"
        />
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => doUponSubmitButton()}
          title="Send Changes to Mirror"
        />
      </View>
    </SafeAreaView >
  );
};



const styles = StyleSheet.create({
  mainStyle: {
    backgroundColor: GlobalStyles.lightBackground,
  },

  scrollableContainer: {
    height: '65%',
  },

  buttonContainer: {
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.lightBackground,
  },
});

export default ModuleConfigScreen;
