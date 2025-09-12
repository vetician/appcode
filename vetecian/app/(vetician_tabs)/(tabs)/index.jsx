import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../pages/Home';
import PetList from '../pages/PetList'
// import ParentDetail from '../onboarding/parent_detail'
import ClinicListScreen from '../pages/ClinicListScreen';
import HealthTipsScreen from '../pages/HealthTipsScreen'

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
        name="Pets"
        component={PetList}
        options={{ headerShown: false, title: 'Pets' }}
      />
      {/* <Drawer.Screen
        name="ParentDetail"
        component={ParentDetail}
        options={{ headerShown: false, title: 'Parent Details' }}
      /> */}
      <Drawer.Screen
        name="ClinicList"
        component={ClinicListScreen}
        options={{ headerShown: false, title: 'Find Clinics' }}
      />
      <Drawer.Screen
        name="HealthTips"
        component={HealthTipsScreen}
        options={{ headerShown: false, title: 'Health Tips' }}
      />
    </Drawer.Navigator>
  );
}