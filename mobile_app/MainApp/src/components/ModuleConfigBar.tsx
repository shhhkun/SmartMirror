import React, {
  useState
} from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet
} from 'react-native';
import {
  Picker
} from '@react-native-picker/picker';



interface ModuleConfigBarProps {
  title: string;
  sliderValue: boolean;
  onSliderChange: (value: number) => void;
}

interface ModuleEnableToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

interface ModulePositionsDropdownProps {
  options: string[];
}



const ModuleConfigBar: React.FC<ModuleConfigBarProps> = ({
  title, sliderValue, onSliderChange }) => {

  const [sliderState, setSliderState] = useState<boolean>(sliderValue);

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rowContainer}>
        <ModulePositionsDropdown options={["top", "bottom", "left", "right"]} />

        <ModuleEnableToggle value={sliderState}
          onValueChange={(value: boolean) => setSliderState(value)} />
      </View>
    </View>
  );
};



const ModuleEnableToggle: React.FC<ModuleEnableToggleProps> = ({
  value, onValueChange }) => {

  return (
    <View style={styles.toggleContainer}>
      <Switch
        value={value}
        onValueChange={onValueChange}
      />
    </View>
  );
};



const ModulePositionsDropdown: React.FC<ModulePositionsDropdownProps> = ({ options }) => {
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
  sectionContainer: {
    margin: 10,
    padding: 10,
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
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },


  toggleContainer: {
    marginTop: 0
  },


  dropdownContainer: {
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: 150, // could change this to percent width
  },
});

export default ModuleConfigBar;
