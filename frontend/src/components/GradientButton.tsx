import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  variant?: 'primary' | 'outline';
}

const GradientButton: React.FC<Props> = ({ title, onPress, loading, disabled, style, variant = 'primary' }) => {
  const { theme } = useTheme();
  if (variant === 'outline') {
    return (
      <TouchableOpacity style={[s.outline, { borderColor: theme.primary }, style]} onPress={onPress} disabled={disabled || loading}>
        {loading ? <ActivityIndicator color={theme.primary} size="small" /> : <Text style={[s.outlineText, { color: theme.primary }]}>{title}</Text>}
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading} style={[s.wrapper, style]}>
      <LinearGradient colors={[theme.primary, '#B71C1C']} style={s.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={s.text}>{title}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  wrapper: { borderRadius: 12, overflow: 'hidden' },
  gradient: { paddingVertical: 14, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center' },
  text: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  outline: { borderWidth: 1.5, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 24, alignItems: 'center' },
  outlineText: { fontSize: 16, fontWeight: '700' },
});

export default GradientButton;
