import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../HomeScreen/HomeScreen';



export default function TabButton() {
    const Tab = createBottomTabNavigator(); 
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
            tabBarLabel:'Activities',
            tabBarIcon:({color,size}) =>(
                <MaterialCommunityIcons name="chart-line" color={color} size={size}/>
            )

        }}
        />
         <Tab.Screen
        name='211'
        component={HomeScreen}
        options={{
            tabBarLabel:'Scan',
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
            tabBarLabel:'home',
            tabBarIcon:({color,size}) =>(
                <MaterialCommunityIcons name="home" color={color} size={size}/>
            )

        }}
        />
<Tab.Screen        
        name='Home'
        component={HomeScreen}
        options={{
            tabBarLabel:'Customers',
            tabBarIcon:({color,size}) =>(
                <MaterialCommunityIcons name="account-group" color={color} size={size}/>
            )

        }}
        />
        <Tab.Screen
        name='account'
        component={HomeScreen}
        options={{
            tabBarLabel:'Account',
            tabBarIcon:({color,size}) =>(
                <MaterialCommunityIcons name="account" color={color} size={size}/>
            )

        }}
        />
    </Tab.Navigator>
  )
}

