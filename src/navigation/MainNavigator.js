import React, { useContext, useEffect } from 'react';
import { AuthContext } from "../context/AuthContext";
import AdminStack from "./adminStack/AdminStack";
import ClientStack from "./clientStack/ClientStack";
import LoginScreen from "../Screens/LoginScreen/LoginScreen";
import { useNavigation } from '@react-navigation/native';

export default function MainNavigator() {
    const { userRole, authToken } = useContext(AuthContext);
    const navigation = useNavigation();

    // Attendez que la navigation soit prête avant d'effectuer des actions
    useEffect(() => {
        if (navigation.isReady()) {
            if (authToken === null) {
                // Si l'utilisateur n'a pas de token, redirige vers l'écran de connexion
                navigation.navigate('Login');
            }
        }
    }, [authToken, navigation]);

    // Logique pour afficher les stacks appropriés
    return (
        userRole === 'admin' ? (
            <AdminStack />
        ) : userRole === 'client' ? (
            <ClientStack />
        ) : (
            <LoginScreen />
        )
    );
}
