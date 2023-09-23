import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native'; // Import ActivityIndicator
import { auth } from './services/firebase';

import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/Register';

const Stack = createNativeStackNavigator();

function App() {
  const [initializing, setInitializing] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    // Render a loading indicator while Firebase initializes
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {currentUser ? (
          <Stack.Screen name="Smoke Tracker" component={HomeScreen} />
        ) : (
          <Stack.Screen name="Register" component={RegisterScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
