import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors } from '../theme';
import { useTheme } from '../context/ThemeContext';

interface Props extends TextInputProps { label: string; error?: string; }

const InputField: React.FC<Props> = ({ label, error, style, ...props }) => {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View style={s.container}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        style={[s.input, error ? { borderColor: colors.error } : { borderColor: focused ? theme.primary : colors.border }]}
        placeholderTextColor={colors.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
};

const s = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { color: colors.textSecondary, fontSize: 12, fontWeight: '700', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: colors.surfaceVariant, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, color: colors.text, fontSize: 15 },
  error: { color: colors.error, fontSize: 12, marginTop: 4 },
});

export default InputField;
