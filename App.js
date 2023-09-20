import * as React from 'react';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/Register';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Smoke Tracker" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;