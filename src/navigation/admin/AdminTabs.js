import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

// Importation des écrans
import AdminProfileScreen from "../../Screens/admin/AdminProfileScreen/AdminProfileScreen";
import AdminHistoryScreen from "../../Screens/admin/AdminHistoryScreen/AdminHistoryScreen";
import AdminScanBarcodeScreen from "../../Screens/admin/AdminScanCodeBarScreen/AdminScanBarcodeScreen";
import AdminViewClientsScreen from "../../Screens/admin/AdminViewClientScreen/AdminViewClientsScreen";
import AdminHomeScreen from '../../Screens/admin/AdminHomeScreen/AdminHomeScreen';
import UserDetailsScreen from '../../Screens/admin/AdminCrudUsersDetails/UserDetailsScreen/UserDetailsScreen';
import EditUserScreen from '../../Screens/admin/AdminCrudUsersDetails/EditUserScreen/EditUserScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const ViewClientsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Masquer le header par défaut
        presentation: 'modal', // Pour l'effet de superposition
        cardStyle: { backgroundColor: 'transparent' }, // Fond transparent pour l'overlay
      }}
    >
      {/* Écran principal de ViewClients */}
      <Stack.Screen name="ViewClientsMain" component={AdminViewClientsScreen} />

      {/* Écrans de superposition */}
      <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
      <Stack.Screen name="EditUser" component={EditUserScreen} />
    </Stack.Navigator>
  );
};
export default function AdminTabs() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName="Home" // Ce nom doit correspondre à un écran défini ci-dessous
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#000',
        tabBarStyle: {
          backgroundColor: '#fec107',
        },
      }}
    > 
    
    <Tab.Screen
        name="HistoryAdmin"  // Le nom est "HistoryAdmin"
        component={AdminHistoryScreen}
        options={{
          tabBarLabel: t('history'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="history" color={color} size={size} />
          ),
        }}
      />
             <Tab.Screen
            name='211'
            component={AdminScanBarcodeScreen}
            options={{
                tabBarLabel:t('Scan'),
                tabBarBadge: 3, // notif
        tabBarBadgeStyle: { backgroundColor: '#ff0000', color: '#fff' },
                tabBarIcon:({color,size}) =>(
                    <MaterialCommunityIcons name="barcode-scan" color={color} size={size}/>
                )
    
            }}
            />
      
      <Tab.Screen
      name="Home"  // C'est ce nom qui doit correspondre dans initialRouteName
      component={AdminHomeScreen}
      options={{
        tabBarLabel: t('home'),
        
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),
      }}
    />
      
      <Tab.Screen
    name="ViewClients"
    component={ViewClientsStack} // Utilisez le Stack Navigator ici
    options={{
      tabBarLabel: t('costumers'),
      tabBarIcon: ({ color, size }) => (
        <MaterialCommunityIcons name="account-group" color={color} size={size} />
      ),
    }}
  />
      <Tab.Screen
        name="ProfileAdmin"  // Le nom est "ProfileAdmin"
        component={AdminProfileScreen}
        
        options={{
          tabBarLabel: t('profile'),
          
          
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
      
      
    </Tab.Navigator>
  );
}
