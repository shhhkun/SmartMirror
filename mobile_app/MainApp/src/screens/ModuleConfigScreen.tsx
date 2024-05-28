// library imports
import React, {
  useContext
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

  // todo: I think the slider states and dropdown states should be states
  // in here. make the component-specific states can hook into these states.

  const doUponSubmitButton = () => {
    console.log("Send Changes to Mirror button pressed");
  };


  return (
    <SafeAreaView style={styles.mainStyle}>
      <StatusBar></StatusBar>

      <View style={styles.mainStyle}>
        <ModuleConfigBar title="Clock" sliderValue={true} onSliderChange={(value: number) => console.log(value)} />
      </View>

      <View style={styles.mainStyle}>
        <ModuleConfigBar title="Weather" sliderValue={false} onSliderChange={(value: number) => console.log(value)} />
      </View>

      <View style={styles.mainStyle}>
        <ModuleConfigBar title="News" sliderValue={true} onSliderChange={(value: number) => console.log(value)} />
      </View>

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
