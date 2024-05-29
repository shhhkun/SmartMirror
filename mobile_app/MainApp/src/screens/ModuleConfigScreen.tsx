// library imports
import React, {
  useState,
  useContext,
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
import { ModuleContext } from '../module_context/ModuleContext';



const ModuleConfigScreen = ({ navigation }: { navigation: any }) => {
  // stuff from module context needed on this page
  const { draftModuleConfiguration,
    setTrueModuleConfiguration,
    setDraftModuleConfiguration }
    = useContext(ModuleContext);


  const doUponResetButton = () => {
    console.log("Reset to default button pressed");
  };

  const doUponSaveButton = () => {
    console.log("Saving config button pressed");
  }

  const doUponSubmitButton = () => {
    console.log("module context draft config is currently:");
    console.log(JSON.stringify(draftModuleConfiguration.clock, null, 2));
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

          sliderValue={draftModuleConfiguration.clock.moduleEnabled}
          onSliderChange={(value: boolean) => setDraftModuleConfiguration({
            ...draftModuleConfiguration,
            clock: {
              ...draftModuleConfiguration.clock,
              moduleEnabled: value
            }
          })}

          dropdownValue={draftModuleConfiguration.clock.modulePosition}
          onDropdownChange={(value: string) => setDraftModuleConfiguration({
            ...draftModuleConfiguration,
            clock: {
              ...draftModuleConfiguration.clock,
              modulePosition: value
            }
          })
          }
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
