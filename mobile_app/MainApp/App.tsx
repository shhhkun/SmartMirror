// Library imports
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';

// Page imports
import HomeScreen from './src/screens/HomeScreen';


const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaView >
        <HomeScreen />
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
