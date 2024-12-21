
import './src/translations/i18n';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import SplashScreen from './src/Screens/SplashScreenView';
import LoginScreen from './src/Screens/LoginScreen/LoginScreen';
import SignInScreen from './src/Screens/SigninScreen/SigninScreen'; // Assurez-vous que ce fichier existe
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/Screens/HomeScreen/HomeScreen';
import VerificationScreen from './src/Screens/VerificationScreen/VerificationScreen';
import TabButton from './src/Screens/Tabs/TabButton';


const Stack = createNativeStackNavigator(); // Créez une instance de votre stack navigator

export default function App() {
  const Stack = createNativeStackNavigator();
  const [isShowSplash, setIsShowSplash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsShowSplash(false);
    }, 3000); // Splash Screen visible pendant 3 secondes
  }, []); // [] pour que useEffect ne se déclenche qu'une seule fois

  return (
    <NavigationContainer>
      {/* Affiche soit le SplashScreen soit le LoginScreen */}
      {isShowSplash ? (
        <SplashScreen />
      ) : (
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ headerShown: false }}
           
          />
          <Stack.Screen 
          name = "Verification"
          component={VerificationScreen}
          options={{ headerShown: false }}
          />
          
          <Stack.Screen 
          name = "Home"
          component={TabButton}
          options={{ headerShown: false }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
