// library imports
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// my imports
import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Scan" component={ScanScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// const App = () => {
//   return (
//     <NavigationContainer>
//       {/* <SafeAreaView > */}
//         <AppNavigator />

//         {/* <HomeScreen /> */}
//       {/* </SafeAreaView> */}
//     </NavigationContainer>
//   );
// };

export default App;
