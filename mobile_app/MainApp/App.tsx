import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';

// import AppNavigator from './src/components/AppNavigator';


const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaView >
        {/* <AppNavigator /> */}
        <HomeScreen />
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
