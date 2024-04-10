import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonToNavigate {
  onPress: () => void; // Function to be called when the button is pressed
  title: string; // Text displayed on the button
  color?: string; // Optional color for the button background
}

const ButtonToNavigate: React.FC<ButtonToNavigate> = ({ onPress, title }) => {
  return (

    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>

  );
};

const styles = StyleSheet.create({

  button: {
    paddingVertical: 12,
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
