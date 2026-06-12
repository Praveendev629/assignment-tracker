import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Student } from '../types';
import { colors } from '../theme';
import { formatDate, getInitials } from '../utils/helpers';
import { useTheme } from '../context/ThemeContext';

interface Props { student: Student; onPress?: () => void; showDelete?: boolean; onDelete?: () => void; }

const StudentCard: React.FC<Props> = ({ student, onPress, showDelete, onDelete }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[s.avatar, { backgroundColor: theme.primary + '22' }]}>
        <Text style={[s.avatarText, { color: theme.primary }]}>{getInitials(student.name)}</Text>
      </View>
      <View style={s.info}>
        <Text style={s.name}>{student.name}{student.initial ? ` ${student.initial}` : ''}</Text>
        <Text style={s.meta}>{student.assignmentCount ?? 0} assignments · Joined {formatDate(student.createdAt)}</Text>
      </View>
      {showDelete && (
        <TouchableOpacity onPress={onDelete} style={s.del}>
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  avatarText: { fontSize: 18, fontWeight: '700' },
  info: { flex: 1 },
  name: { color: colors.text, fontSize: 16, fontWeight: '600' },
  meta: { color: colors.textSecondary, fontSize: 12, marginTop: 3 },
  del: { padding: 8 },
});

export default StudentCard;
