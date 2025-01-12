import React, { useContext, useEffect } from 'react';
import { AuthContext } from "../context/AuthContext";
import AdminStack from "./adminStack/AdminStack";
import ClientStack from "./clientStack/ClientStack";
import LoginScreen from "../Screens/LoginScreen/LoginScreen";
import { useNavigation } from '@react-navigation/native';
import SignIn from '../Screens/SigninScreen/SigninScreen';
import { createStackNavigator } from "@react-navigation/stack"; // Utiliser Stack pour une navigation indépendante

const Stack = createStackNavigator();

export default function MainNavigator() {
    const { userRole, authToken } = useContext(AuthContext);
    const navigation = useNavigation();

    // Si l'utilisateur n'est pas connecté, on le redirige vers la page de connexion
    useEffect(() => {
        if (navigation.isReady()) {
            if (authToken === null) {
                navigation.navigate('Login');
            }
        }
    }, [authToken, navigation]);

    return (
        <Stack.Navigator>
            {/* Si l'utilisateur est un admin, afficher la stack admin */}
            {userRole === 'admin' ? (
                <Stack.Screen name="Admin" options={{
                    headerShown: false, }} component={AdminStack} />
            ) : userRole === 'client' ? (
                <Stack.Screen name="Client"  options={{
                    headerShown: false, }} component={ClientStack} />
            ) : (
                <>
                    
                    <Stack.Screen name="Login"  options={{
                    headerShown: false, }}component={LoginScreen} />

                  
                    <Stack.Screen name="signin" options={{
                    headerShown: false, }}  component={SignIn} />
                </>
            )}
        </Stack.Navigator>
    );
}
