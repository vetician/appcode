import { Stack } from 'expo-router';
import ClinicDetailScreen from "./pages/ClinicDetailScreen"

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/onboarding_conf" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/parent_detail" options={{ headerShown: false }} />
      <Stack.Screen name="pages/ClinicListScreen" options={{ headerShown: false }} />
      <Stack.Screen name="pages/ClinicDetailScreen" options={{ headerShown: false, presentation: 'modal' }}/>
    </Stack>
  );
}