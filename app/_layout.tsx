import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ContentFlowProvider } from '../providers/ContentFlowProvider';

export default function RootLayout() {
  return (
    <ContentFlowProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#571FE4' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ContentFlowProvider>
  );
}
