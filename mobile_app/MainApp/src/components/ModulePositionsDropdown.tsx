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
        onValueChange={(itemValue: React.SetStateAction<string>) => setSelectedValue(itemValue)}
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
    width: '35%',
  },
});

export default ModulePositionsDropdown;