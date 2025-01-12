  import React from 'react';
  import { NavigationContainer } from '@react-navigation/native';
  import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../Screens/SigninScreen/SigninScreen';





export default function AppNavigator() {
    const Stack = createNativeStackNavigator();

        return (
          
                <Stack.Navigator>
                    <Stack.Screen
                        name="signin"
                        component={SignIn}
                        options={{ title: 'Welcome' }}
                    />
                   
                </Stack.Navigator>
            
        );

}