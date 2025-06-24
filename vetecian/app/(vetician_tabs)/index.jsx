import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../../components/home/Home';
import PetDetail from '../../components/home/PetDetail';

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen 
        name="Home" 
        component={Home} 
        options={{ headerShown: false, title: 'Dassboard' }}
      />
      <Drawer.Screen 
        name="PetDetail" 
        component={PetDetail} 
        options={{ headerShown: false, title: 'Pet Details' }}
      />
    </Drawer.Navigator>
  );
}