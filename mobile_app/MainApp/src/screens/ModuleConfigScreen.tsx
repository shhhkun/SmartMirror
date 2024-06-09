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

  // no longer need a save from draft function. just using true config now.
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
    // writes from true config now. now no longer need to save draft first.

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
        {Object.entries(trueModuleConfiguration).map(([moduleName, moduleConfig]) => (
          <ModuleConfigBar
            // this key thing is needed for efficient re-rendering stuff
            key={moduleName}

            title={moduleConfig.moduleDisplayName}

            sliderValue={moduleConfig.moduleEnabled}
            onSliderChange={(value: boolean) =>
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
        <View style={styles.button}>
          <ButtonToNavigate onPress={() => doUponResetButton()}
            title="Reset to Default"
          />
        </View>

        {/* just using true config now, so hiding from UI */}
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

        <View style={styles.button}>
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
    paddingTop: 35,
  },
  button: {
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: GlobalStyles.lightBackground,
  },
});

export default ModuleConfigScreen;
