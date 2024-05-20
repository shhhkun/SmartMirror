import React from 'react';
import {
  View, Switch,
  StyleSheet
} from 'react-native';

interface ModuleEnableToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

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

const styles = StyleSheet.create({
  toggleContainer: {
    marginTop: 10,
  },
});

export default ModuleEnableToggle;
