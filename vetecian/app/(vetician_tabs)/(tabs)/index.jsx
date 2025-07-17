import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../../../components/petparent/home/Home';
import PetDetail from '../../../components/petparent/home/PetDetail'
import ParentDetail from '../onboarding/parent_detail'
import ClinicListScreen from '../pages/ClinicListScreen';

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
      <Drawer.Screen
        name="ClinicList"
        component={ClinicListScreen}
        options={{ headerShown: false, title: 'Find Clinics' }}
      />
    </Drawer.Navigator>
  );
}