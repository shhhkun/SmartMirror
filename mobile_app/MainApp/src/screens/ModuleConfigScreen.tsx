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
    // draftModuleConfiguration, // no longer using draft config
    trueModuleConfiguration,
    // setDraftModuleConfiguration, // no longer using draft config
    setTrueModuleConfiguration,
    saveDraftConfigToTrueConfig,
    resetConfigsToDefault,
    writeFullConfigToMirror,
    // readFullConfigFromMirror
  } = useContext(ModuleContext);


  const doUponResetButton = () => {
    console.log("Reset to default button pressed");
    resetConfigsToDefault();
  };

  // no longer need save. just using true config now.
  {
    // const doUponSaveButton = () => {
    //   console.log("Saving config button pressed");
    //   saveDraftConfigToTrueConfig();
    // }
  }

  // not using read right now. hiding.
  {
    // const doUponReadButton = async () => {
    //   console.log("Read from mirror button pressed");
    //   try {
    //     await readFullConfigFromMirror();
    //   }
    //   catch (error) {
    //     console.error("Error reading config from mirror from UI: " + error);
    //   }
    // };
  }

  const doUponSubmitButton = async () => {
    try {
      // this button will also perform a save to true config
      // I don't think you're allowed to do this. it seems like the other
      // functions (like writeFullConfigToMirror) will pull the context state
      // from when this function was originally called, and not what's updated
      // after a function call like this.

      // saveDraftConfigToTrueConfig();

      // do the actual write
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
        {Object.entries(trueModuleConfiguration).map(([moduleName, moduleConfig]) => (
          <ModuleConfigBar
            key={moduleName}

            title={moduleConfig.moduleDisplayName}

            sliderValue={moduleConfig.moduleEnabled}
            onSliderChange={(value: boolean) =>
              // set the draft config to the new value
              setTrueModuleConfiguration({
                ...trueModuleConfiguration,
                [moduleName]: {
                  ...moduleConfig,
                  moduleEnabled: value
                }
              })
            }

            dropdownValue={moduleConfig.modulePosition}
            onDropdownChange={(value: string) =>
              setTrueModuleConfiguration({
                ...trueModuleConfiguration,
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

        {/* just using the true config and not the draft config, so don;t need save rn */}
        {/* <View style={styles.buttonContainer}>
          <ButtonToNavigate onPress={() => doUponSaveButton()}
            title="Save Changes"
          />
        </View> */}

        {/* read functionality pretty broken rn, so hiding from UI */}
        {/* <View style={styles.buttonContainer}>
          <ButtonToNavigate onPress={() => doUponReadButton()}
            title="Read from Mirror"
          />
        </View> */}

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
    height: '70%',
    backgroundColor: GlobalStyles.lessLightBackground,
  },

  allButtonsContainer: {
    paddingTop: 10,
  },

  buttonContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.lightBackground,
  },
});

export default ModuleConfigScreen;
