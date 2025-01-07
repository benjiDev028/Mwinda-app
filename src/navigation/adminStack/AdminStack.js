import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

// Importation des écrans
import AdminProfileScreen from "../../Screens/admin/AdminProfileScreen/AdminProfileScreen";
import AdminHistoryScreen from "../../Screens/admin/AdminHistoryScreen/AdminHistoryScreen";
import AdminScanBarcodeScreen from "../../Screens/admin/AdminScanCodeBarScreen/AdminScanBarcodeScreen";
import AdminViewClientsScreen from "../../Screens/admin/AdminViewClientScreen/AdminViewClientsScreen";
import AdminHomeScreen from '../../Screens/admin/AdminHomeScreen/AdminHomeScreen';

const Tab = createBottomTabNavigator();

export default function AdminStack() {
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
        tabBarLabel: t('scanner'),
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),
      }}
    />
      
       <Tab.Screen
        name="ViewClients"  // Le nom doit être "ViewClients" ici
        component={AdminViewClientsScreen}
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
