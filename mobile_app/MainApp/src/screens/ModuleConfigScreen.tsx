// library imports
import React, {
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
    setDraftModuleConfiguration,
    saveDraftConfigToTrueConfig,
    resetConfigsToDefault,
    writeFullConfigToMirror,
    readFullConfigFromMirror
  } = useContext(ModuleContext);


  const doUponResetButton = () => {
    console.log("Reset to default button pressed");
    resetConfigsToDefault();
  };

  const doUponSaveButton = () => {
    console.log("Saving config button pressed");
    saveDraftConfigToTrueConfig();
  }

  const doUponReadButton = async () => {
    console.log("Read from mirror button pressed");
    try {
      await readFullConfigFromMirror();
    }
    catch (error) {
      console.error("Error reading config from mirror from UI: " + error);
    }
  };

  const doUponSubmitButton = async () => {
    try {
      await writeFullConfigToMirror();
    }
    catch (error) {
      console.error("Error sending config to mirror: " + error);
    }
  };

  return (
    <SafeAreaView style={styles.mainStyle}>
      <StatusBar></StatusBar>
      <ScrollView
        style={styles.scrollableContainer}
        showsVerticalScrollIndicator={true}>

        {/* Make module config bars for all the modules in draft config. */}
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
          <ButtonToNavigate onPress={() => doUponReadButton()}
            title="Read from Mirror"
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
    height: '55%',
    backgroundColor: GlobalStyles.lessLightBackground,
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
