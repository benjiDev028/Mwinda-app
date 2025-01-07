import { useContext } from 'react';
import { View, Text,Button } from 'react-native';
import { AuthContext } from '../../../context/AuthContext';




export default function AdminHomeScreen() {
    const { authToken, userRole, logout } = useContext(AuthContext);
    return (
        <View>
          <Text>Bienvenue, votre rôle est : {userRole}</Text>
          <Text>Token: {authToken}</Text>
    
          {/* Bouton de déconnexion */}
          <Button
            title="Se déconnecter"
            onPress={logout}
          />
        </View>
      );
    };