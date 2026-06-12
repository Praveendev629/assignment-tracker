import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Assignment, Student } from '../types';
import { colors } from '../theme';
import { formatDate } from '../utils/helpers';
import { useTheme } from '../context/ThemeContext';

const AssignmentCard: React.FC<{ assignment: Assignment }> = ({ assignment }) => {
  const { theme } = useTheme();
  const student = typeof assignment.studentId === 'object' ? assignment.studentId as Student : null;
  return (
    <View style={s.card}>
      <View style={[s.accent, { backgroundColor: theme.primary }]} />
      <View style={s.body}>
        {student && <Text style={[s.studentName, { color: theme.primary }]}>{student.name}</Text>}
        <Text style={s.title}>{assignment.assignmentTitle}</Text>
        <Text style={s.sub}>{assignment.subject}</Text>
        <View style={s.row}>
          <Text style={s.marks}>{assignment.marks} marks</Text>
          <Text style={s.date}>{formatDate(assignment.submissionDate)}</Text>
        </View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 14, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  accent: { width: 4 },
  body: { flex: 1, padding: 14 },
  studentName: { fontSize: 11, fontWeight: '700', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  title: { color: colors.text, fontSize: 15, fontWeight: '600' },
  sub: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  marks: { color: colors.success, fontSize: 13, fontWeight: '600' },
  date: { color: colors.textMuted, fontSize: 12 },
});

export default AssignmentCard;
