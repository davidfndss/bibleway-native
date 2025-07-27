import { Slot } from 'expo-router';
import '../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

export default function Layout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync('#020808');
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#020808' }}>
      <StatusBar style="light" backgroundColor="#020808" />

      <Slot />
    </GestureHandlerRootView>
  );
}
