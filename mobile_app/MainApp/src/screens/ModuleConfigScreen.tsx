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
import ModuleConfigBar from '../components/ModuleConfigBar';



const ModuleConfigScreen = ({ navigation }: { navigation: any }) => {

  const buttonToDoSomething = () => {
    console.log("Button pressed");
  };


  return (
    <SafeAreaView style={styles.mainStyle}>
      <StatusBar></StatusBar>

      <View style={styles.mainStyle}>
        <ModuleConfigBar title="Clock" sliderValue={0} onSliderChange={(value: number) => console.log(value)} />
      </View>

      <View style={styles.mainStyle}>
        <ModuleConfigBar title="Weather" sliderValue={0} onSliderChange={(value: number) => console.log(value)} />
      </View>

      <View style={styles.mainStyle}>
        <ModuleConfigBar title="News" sliderValue={0} onSliderChange={(value: number) => console.log(value)} />
      </View>

      <View style={styles.buttonContainer}>
        <ButtonToNavigate onPress={() => buttonToDoSomething()} title="Send Changes to Mirror" />
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
