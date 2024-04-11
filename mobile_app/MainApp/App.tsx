import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import { SafeAreaView } from 'react-native';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import HomeScreen from './src/screens/HomeScreen';

// import AppNavigator from './src/components/AppNavigator';



const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
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
