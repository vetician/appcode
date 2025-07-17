import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../../../components/peravet/home/Home';
import PetDetail from '../../../components/peravet/home/PetDetail'
import ParentDetail from '../onboarding/parent_detail'

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      // screenOptions={{
        // headerShown: false,
        // swipeEnabled: false, // Disable swipe to open drawer
        // drawerLockMode: 'locked-closed', // Lock drawer when on certain screens
      // }}
    >
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
      <Drawer.Screen
        name="ParentDetail"
        component={ParentDetail}
        options={{ headerShown: false, title: 'Parent Details' }}
      />
    </Drawer.Navigator>
  );
}