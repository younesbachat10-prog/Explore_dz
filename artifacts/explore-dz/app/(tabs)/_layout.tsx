import { Stack } from 'expo-router';
import React from 'react';

export default function AppStackLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />;
}
