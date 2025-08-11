import { Slot } from 'expo-router';
import '../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';

export default function Layout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync('#020808');
    NavigationBar.setBackgroundColorAsync('#020808');
    NavigationBar.setButtonStyleAsync('light'); 
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#020808' }}>
        <StatusBar style="light" translucent backgroundColor="transparent" />

        <Slot />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
