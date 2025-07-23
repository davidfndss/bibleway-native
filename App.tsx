import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SlideView from './components/SlideView';
import "global.css";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SlideView />
    </GestureHandlerRootView>
  );
}
