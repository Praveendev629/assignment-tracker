import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const LoadingOverlay = () => {
  const { theme } = useTheme();
  return (
    <View style={s.container}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
};

const s = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
});

export default LoadingOverlay;
