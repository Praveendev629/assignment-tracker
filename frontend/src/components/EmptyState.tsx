import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

const EmptyState: React.FC<{ icon: string; title: string; subtitle?: string }> = ({ icon, title, subtitle }) => (
  <View style={s.container}>
    <Ionicons name={icon as any} size={60} color={colors.textMuted} />
    <Text style={s.title}>{title}</Text>
    {subtitle ? <Text style={s.sub}>{subtitle}</Text> : null}
  </View>
);

const s = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, minHeight: 200 },
  title: { color: colors.textSecondary, fontSize: 17, fontWeight: '600', marginTop: 14, textAlign: 'center' },
  sub: { color: colors.textMuted, fontSize: 13, marginTop: 8, textAlign: 'center', lineHeight: 20 },
});

export default EmptyState;
