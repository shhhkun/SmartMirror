// Section.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ModulePositionsDropdown from './ModulePositionsDropdown';
// import Slider from './Slider';

interface ModuleConfigBarProps {
  title: string;
  sliderValue: number;
  onSliderChange: (value: number) => void;
}

const ModuleConfigBar: React.FC<ModuleConfigBarProps> = ({
  title, sliderValue, onSliderChange }) => {

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.title}>{title}</Text>
      <ModulePositionsDropdown options={[]} />
      {/* <Slider value={sliderValue} onValueChange={onSliderChange} /> */}
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
});

export default ModuleConfigBar;
