import './src/translations/i18n';
import './src/Configurations/ReactotronConfig';
import SplashScreen from './src/Screens/SplashScreenView';
import 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import { useEffect, useState } from 'react';
import MainNavigator from './src/navigation/MainNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from "@react-navigation/stack"; // Utiliser Stack pour une navigation indépendante



export default function App() {
  
  const [isShowSplash, setIsShowSplash] = useState(true);

  const Stack = createStackNavigator();

  useEffect(() => {
    setTimeout(() => {
      setIsShowSplash(false); // Hide splash screen after 3 seconds
    }, 3000);
  }, []); // Empty dependency array ensures this runs once when the app starts

  console.tron.log('Reactotron works'); // Log message for Reactotron

  return (

    <AuthProvider>  
      <NavigationContainer>
        {isShowSplash ? (
          <SplashScreen />
        ) : (
          <MainNavigator />
       
        )}
      
      </NavigationContainer>  
    </AuthProvider>
  );
}
