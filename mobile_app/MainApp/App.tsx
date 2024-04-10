// Library imports
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

// Page imports
import HomeScreen from './screens/HomeScreen';

const App = () => {
  return (
    <NavigationContainer>
      <HomeScreen />
    </NavigationContainer>
  );
};

export default App;
