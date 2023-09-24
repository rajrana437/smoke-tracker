import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/Register';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { auth } from './services/firebase'; // Import Firebase auth and custom login method
import LoadingScreen from './screens/LoadingScreen';
import { onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { PaperProvider } from 'react-native-paper';

const Stack = createNativeStackNavigator();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        // Use the stored token to sign in the user

        onAuthStateChanged(auth, user => {
          if (user) {
            console.log(user);

            setUser(user);

            setLoading(false);

          } else {
            setLoading(false)
          }
        })
      } catch (error) {
        console.error('Error checking token:', error);
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  if (loading) {
    // Add a loading screen or spinner while checking the token
    return <LoadingScreen />;
  }

  return (
    <PaperProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>

    </PaperProvider>
  );
}

export default App;
