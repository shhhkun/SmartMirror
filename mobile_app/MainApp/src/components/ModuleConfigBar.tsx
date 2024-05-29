import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
} from 'react-native';
import {
  Picker
} from '@react-native-picker/picker';

import {
  modulePositionOptions
} from '../common/StandardModuleInfo';



interface ModuleConfigBarProps {
  title: string;
  dropdownValue: string;
  sliderValue: boolean;
  onDropdownChange: (value: string) => void;
  onSliderChange: (value: boolean) => void;
}

interface ModulePositionsDropdownProps {
  incomingDropdownValue: string;
  onDropdownChange: (value: string) => void;
}

const ModuleConfigBar: React.FC<ModuleConfigBarProps> = ({
  title,
  dropdownValue,
  sliderValue,
  onDropdownChange,
  onSliderChange,
}) => {

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.rowContainer}>

        <ModulePositionsDropdown
          incomingDropdownValue={dropdownValue}
          onDropdownChange={(value: string) => onDropdownChange(value)}
        />

        <Switch
          value={sliderValue}
          onValueChange={(value: boolean) => onSliderChange(value)}
        />

      </View>
    </View>
  );
};

const ModulePositionsDropdown: React.FC<ModulePositionsDropdownProps> = ({
  incomingDropdownValue,
  onDropdownChange
}) => {

  return (
    <View style={styles.dropdownContainer}>
      <Picker
        style={styles.picker}
        selectedValue={incomingDropdownValue}
        onValueChange={(itemValue: string) =>
          onDropdownChange(itemValue)}
      >

        {
          // make a dropdown option for each item in modulePositionsOptions
          modulePositionOptions.map((option, index) => (
            <Picker.Item key={index} label={option} value={option} />
          ))
        }

      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    margin: 10,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownContainer: {
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: 200,
  },
});

export default ModuleConfigBar;
