// library imports
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// my imports
import BluetoothProvider from './src/ble/BluetoothProvider';
import ModuleProvider from './src/module_context/ModuleProvider';
import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';
import DeviceDetailScreen from './src/screens/DeviceDetailScreen';
import ProfileSelectScreen from './src/screens/ProfileSelectScreen';
import ModuleConfigScreen from './src/screens/ModuleConfigScreen';


const Stack = createStackNavigator();


const App = () => {
  return (
    <BluetoothProvider>
      <ModuleProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Home' }} />
            <Stack.Screen
              name="Devices"
              component={ScanScreen}
              options={{ title: '' }} />
            <Stack.Screen
              name="DeviceDetail"
              component={DeviceDetailScreen}
              options={{ title: '' }}
            />
            <Stack.Screen
              name="Profile Selection"
              component={ProfileSelectScreen}
              options={{ title: '' }}
            />
            <Stack.Screen
              name="Module Configuration"
              component={ModuleConfigScreen}
              options={{ title: 'Configure Your Apps' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ModuleProvider>
    </BluetoothProvider>
  );
};


export default App;
