import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View
} from 'react-native';
import { GlobalStyles } from '../common/GlobalStyles';


interface ButtonToNavigate {
  onPress: () => void;
  title: string;
}

const ButtonToNavigate: React.FC<ButtonToNavigate> = ({ onPress, title }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: GlobalStyles.lightBackground,
    width: 250,
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#346beb',
    minWidth: 200,
    maxWidth: 300,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});

export default ButtonToNavigate;
