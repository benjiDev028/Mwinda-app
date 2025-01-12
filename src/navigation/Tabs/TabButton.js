import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
import HomeScreen from '../HomeScreen/HomeScreen';
import SignIn from '../../Screens/SigninScreen/SigninScreen';



export default function TabButton() {
    const Tab = createBottomTabNavigator(); 
    const {t} =  useTranslation();
  return (
    
    <Tab.Navigator 
    initialRouteName='2'
    screenOptions={{
        tabBarActiveTintColor:'#fff',
        tabBarInactiveTintColor: '#000',
    
        tabBarStyle:{
            backgroundColor:'#fec107',
            color:'#fff'
        }
       

    }}
    >
        
    
        <Tab.Screen
        name='21'
        component={HomeScreen}
        options={{
            tabBarLabel:t('activities'),
            tabBarIcon:({color,size}) =>(
                <MaterialCommunityIcons name="chart-line" color={color} size={size}/>
            )

        }}
        />
         <Tab.Screen
        name='211'
        component={HomeScreen}
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
        name='2'
        component={HomeScreen}
        options={{
            tabBarLabel:t('home'),
            tabBarIcon:({color,size}) =>(
                <MaterialCommunityIcons name="home" color={color} size={size}/>
            )

        }}
        />
<Tab.Screen        
        name='Home'
        component={HomeScreen}
        options={{
            tabBarLabel:t('customers'),
            tabBarIcon:({color,size}) =>(
                <MaterialCommunityIcons name="account-group" color={color} size={size}/>
            )

        }}
        />
        <Tab.Screen
        name='account'
        component={HomeScreen}
        options={{
            tabBarLabel:t('profile'),
            tabBarIcon:({color,size}) =>(
                <MaterialCommunityIcons name="account" color={color} size={size}/>
            )

        }}
        />

<Tab.Screen
        name='SignIn'
        component={SignIn}
        options={{
            tabBarLabel:t('profile'),
            tabBarIcon:({color,size}) =>(
                <MaterialCommunityIcons name="account" color={color} size={size}/>
            )

        }}
        />
        
    </Tab.Navigator>
  )
}

