// library imports
import React, {
  useState
} from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import {
  Picker
} from '@react-native-picker/picker';

// my imports
import {
  modulePositionOptions
} from '../ble/BluetoothUtils';


// todo: make this dropdown use our list of potential position options.
// kind of blocked right now because unsure what this output data we want to
// generate should look like. whether it's an entire module's config, where
// it would make sense to input "top left" directly,
// or if it is some shortened version of a modukle config where we want a
// shorter message like pos = 1.

interface DropdownProps {
  options: string[];
}

const ModulePositionsDropdown: React.FC<DropdownProps> = ({ options }) => {
  const [selectedValue, setSelectedValue] = useState<string>(options[0]);

  return (
    <View style={styles.dropdownContainer}>
      <Picker
        selectedValue={selectedValue}
        style={styles.picker}

        onValueChange={(itemValue: React.SetStateAction<string>) =>
          setSelectedValue(itemValue)}
      >
        {options.map((option, index) => (
          <Picker.Item key={index} label={option} value={option} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: 150, // could change this to percent width
  },
});

export default ModulePositionsDropdown;