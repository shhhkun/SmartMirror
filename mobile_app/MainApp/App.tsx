// library imports
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// my imports
import BluetoothProvider from './src/services/BluetoothProvider';
import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';


const Stack = createStackNavigator();


const App = () => {
  return (
    <BluetoothProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Devices" component={ScanScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </BluetoothProvider>
  );
};


export default App;
