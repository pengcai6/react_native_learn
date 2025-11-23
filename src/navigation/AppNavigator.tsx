import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ChatScreen from '../screens/ChatScreen';
import Sidebar from '../components/Sidebar';

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <Sidebar {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: 'slide',
          overlayColor: 'rgba(0,0,0,0.5)',
          drawerStyle: { width: '80%' },
        }}
      >
        <Drawer.Screen name="Chat" component={ChatScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
