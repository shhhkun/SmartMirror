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
  const {
    draftModuleConfiguration,

    // be very careful not to mess with trueModuleConfiguration directly.
    // just have it available here for debugging.
    trueModuleConfiguration,

    setDraftModuleConfiguration,
    saveDraftConfigToTrueConfig,
    resetConfigsToDefault
  }
    = useContext(ModuleContext);


  const doUponResetButton = () => {
    console.log("Reset to default button pressed");
    resetConfigsToDefault();
  };

  const doUponSaveButton = () => {
    console.log("Saving config button pressed");
    saveDraftConfigToTrueConfig();
  }

  const doUponSubmitButton = () => {
    console.log("-----------------------------------");
    console.log("module context draft config is currently:");
    console.log(JSON.stringify(draftModuleConfiguration, null, 2));
    console.log("-----------------------------------");
    console.log("module context true config is currently:");
    console.log(JSON.stringify(trueModuleConfiguration, null, 2));
    console.log("-----------------------------------");
  };

  // todo: make this not as repeated and ugly where I'm repeating module bars.
  // make this pull from the module context when it's created I think.
  return (
    <SafeAreaView style={styles.mainStyle}>
      <StatusBar></StatusBar>
      <ScrollView
        style={styles.scrollableContainer}
        showsVerticalScrollIndicator={true}>

        {/* Make module config bars for all the modules in draft config */}
        {Object.entries(draftModuleConfiguration).map(([moduleName, moduleConfig]) => (
          <ModuleConfigBar
            key={moduleName}
            title={moduleConfig.moduleDisplayName}

            sliderValue={moduleConfig.moduleEnabled}
            onSliderChange={(value: boolean) =>
              setDraftModuleConfiguration({
                ...draftModuleConfiguration,
                [moduleName]: {
                  ...moduleConfig,
                  moduleEnabled: value
                }
              })
            }

            dropdownValue={moduleConfig.modulePosition}
            onDropdownChange={(value: string) =>
              setDraftModuleConfiguration({
                ...draftModuleConfiguration,
                [moduleName]: {
                  ...moduleConfig,
                  modulePosition: value
                }
              })
            }
          />
        ))}
      </ScrollView>

      <View style={styles.allButtonsContainer}>
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

  allButtonsContainer: {
    paddingTop: 10,
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
