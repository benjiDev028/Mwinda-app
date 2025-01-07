import './src/translations/i18n';
import './src/Configurations/ReactotronConfig';
import SplashScreen from './src/Screens/SplashScreenView';
import { AuthProvider } from './src/context/AuthContext';
import { useEffect, useState } from 'react';
import MainNavigator from './src/navigation/MainNavigator';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  const [isShowSplash, setIsShowSplash] = useState(true);

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
