import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal,
  FlatList, TextInput, Alert, RefreshControl, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useStudents } from '../hooks/useStudents';
import { useAssignments } from '../hooks/useAssignments';
import { assignmentService } from '../services/assignmentService';
import { Student } from '../types';
import { colors } from '../theme';
import { exportStudentPDF, exportAllStudentsPDF } from '../utils/pdf';
import AssignmentCard from '../components/AssignmentCard';
import GradientButton from '../components/GradientButton';
import InputField from '../components/InputField';
import EmptyState from '../components/EmptyState';

const ALL: Student = { _id: 'all', name: 'All Students', initial: '', createdBy: '', createdAt: '' };

const HomeScreen = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { students, fetchStudents, isLoading: sLoad } = useStudents();
  const { assignments, fetchAssignments } = useAssignments();

  const [sel, setSel] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [marks, setMarks] = useState('');
  const [date, setDate] = useState('');
  const [errs, setErrs] = useState<Record<string,string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchStudents(); }, []);

  useEffect(() => {
    if (!sel) return;
    if (sel._id === 'all') fetchAssignments(undefined, subjectFilter || undefined);
    else fetchAssignments(sel._id, subjectFilter || undefined);
  }, [sel, subjectFilter]);

  const filtered = [ALL, ...students].filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  const validate = () => {
    const e: Record<string,string> = {};
    if (!subject.trim()) e.subject = 'Subject required';
    if (!title.trim()) e.title = 'Title required';
    if (!marks || isNaN(Number(marks))) e.marks = 'Valid marks required';
    if (!date.trim() || isNaN(Date.parse(date))) e.date = 'Date required (YYYY-MM-DD)';
    setErrs(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async () => {
    if (!sel || !validate()) return;
    setSubmitting(true);
    try {
      if (sel._id === 'all') {
        await assignmentService.createAssignmentForAll({ subject, assignmentTitle: title, marks: Number(marks), submissionDate: date });
        Alert.alert('Success', `Assignment added for all ${students.length} students`);
      } else {
        await assignmentService.createAssignment({ studentId: sel._id, subject, assignmentTitle: title, marks: Number(marks), submissionDate: date });
        Alert.alert('Success', 'Assignment added');
      }
      setSubject(''); setTitle(''); setMarks(''); setDate('');
      fetchAssignments(sel._id === 'all' ? undefined : sel._id);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally { setSubmitting(false); }
  };

  const handleExport = async () => {
    try {
      if (!sel) return;
      if (sel._id === 'all') await exportAllStudentsPDF(students, assignments);
      else await exportStudentPDF(sel, assignments);
    } catch (err: any) { Alert.alert('Export Error', err.message); }
  };

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView
        style={s.scroll}
        refreshControl={<RefreshControl refreshing={sLoad} onRefresh={fetchStudents} tintColor={theme.primary} />}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Hello, {user?.username}</Text>
            <Text style={s.sub}>Manage student assignments</Text>
          </View>
          <View style={[s.badge, { backgroundColor: theme.primary + '22' }]}>
            <Ionicons name="stats-chart" size={20} color={theme.primary} />
          </View>
        </View>

        <Text style={s.label}>Select Student</Text>
        <TouchableOpacity
          style={[s.selector, { borderColor: sel ? theme.primary : colors.border }]}
          onPress={() => setShowModal(true)}
        >
          <Ionicons name="people-outline" size={20} color={sel ? theme.primary : colors.textSecondary} />
          <Text style={[s.selectorText, { color: sel ? colors.text : colors.textSecondary }]}>
            {sel ? (sel._id === 'all' ? 'All Students' : `${sel.name}${sel.initial ? ' '+sel.initial : ''}`) : 'Tap to select a student'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {sel && (
          <View style={s.formCard}>
            <Text style={s.label}>Add Assignment</Text>
            <InputField label="Subject" value={subject} onChangeText={v => { setSubject(v); setErrs(e => ({...e, subject:''})); }} placeholder="e.g. Mathematics" error={errs.subject} />
            <InputField label="Assignment Title" value={title} onChangeText={v => { setTitle(v); setErrs(e => ({...e, title:''})); }} placeholder="e.g. Chapter 3 Homework" error={errs.title} />
            <InputField label="Marks" value={marks} onChangeText={v => { setMarks(v); setErrs(e => ({...e, marks:''})); }} placeholder="e.g. 85" keyboardType="numeric" error={errs.marks} />
            <InputField label="Submission Date" value={date} onChangeText={v => { setDate(v); setErrs(e => ({...e, date:''})); }} placeholder="YYYY-MM-DD" error={errs.date} />
            <GradientButton
              title={sel._id === 'all' ? `Submit for All Students (${students.length})` : 'Submit Assignment'}
              onPress={handleSubmit}
              loading={submitting}
            />
          </View>
        )}

        {sel && (
          <>
            <View style={s.statsRow}>
              <View style={s.statCard}>
                <Text style={[s.statNum, { color: theme.primary }]}>{assignments.length}</Text>
                <Text style={s.statLabel}>Total Assignments</Text>
              </View>
              <TouchableOpacity style={s.exportBtn} onPress={handleExport}>
                <Ionicons name="document-text-outline" size={20} color={theme.primary} />
                <Text style={[s.exportText, { color: theme.primary }]}>Export PDF</Text>
              </TouchableOpacity>
            </View>

            <View style={s.filterRow}>
              <Ionicons name="search-outline" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
              <TextInput
                style={s.filterInput}
                placeholder="Filter by subject..."
                placeholderTextColor={colors.textMuted}
                value={subjectFilter}
                onChangeText={setSubjectFilter}
              />
            </View>

            <Text style={s.label}>Assignments</Text>
            {assignments.length === 0
              ? <EmptyState icon="document-outline" title="No assignments yet" subtitle="Add the first assignment above" />
              : assignments.map(a => <AssignmentCard key={a._id} assignment={a} />)
            }
          </>
        )}

        {!sel && <EmptyState icon="school-outline" title="Select a student" subtitle="Choose a student above to view and manage their assignments" />}

        <View style={{ height: 100 }} />
      </ScrollView>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={s.overlay}>
          <View style={s.modal}>
            <View style={s.modalHead}>
              <Text style={s.modalTitle}>Select Student</Text>
              <TouchableOpacity onPress={() => { setShowModal(false); setSearch(''); }}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={s.searchBar}>
              <Ionicons name="search-outline" size={18} color={colors.textMuted} />
              <TextInput style={s.searchInput} placeholder="Search students..." placeholderTextColor={colors.textMuted} value={search} onChangeText={setSearch} />
            </View>
            <Text style={s.modalCount}>{students.length} students registered</Text>
            <FlatList
              data={filtered}
              keyExtractor={i => i._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[s.studentRow, sel?._id === item._id && { backgroundColor: theme.primary + '22' }]}
                  onPress={() => { setSel(item); setShowModal(false); setSearch(''); }}
                >
                  <Ionicons name={item._id === 'all' ? 'people' : 'person'} size={20} color={item._id === 'all' ? theme.primary : colors.textSecondary} />
                  <Text style={s.studentRowText}>{item.name}{item.initial ? ' '+item.initial : ''}</Text>
                  {item._id === 'all' && <Text style={[s.allBadge, { color: theme.primary }]}>ALL</Text>}
                </TouchableOpacity>
              )}
              style={{ maxHeight: 380 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { color: colors.text, fontSize: 22, fontWeight: '800' },
  sub: { color: colors.textSecondary, fontSize: 14, marginTop: 2 },
  badge: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  label: { color: colors.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, marginTop: 4 },
  selector: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1.5, borderRadius: 12, padding: 14, gap: 10, marginBottom: 16 },
  selectorText: { flex: 1, fontSize: 15, fontWeight: '500' },
  formCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border },
  statNum: { fontSize: 28, fontWeight: '800' },
  statLabel: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  exportBtn: { backgroundColor: colors.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', gap: 6 },
  exportText: { fontSize: 12, fontWeight: '700' },
  filterRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceVariant, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  filterInput: { flex: 1, color: colors.text, fontSize: 14 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40, borderWidth: 1, borderColor: colors.border },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: '700' },
  modalCount: { color: colors.textMuted, fontSize: 12, marginBottom: 8, marginLeft: 4 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceVariant, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8, gap: 8 },
  searchInput: { flex: 1, color: colors.text, fontSize: 14 },
  studentRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 10, gap: 12, marginBottom: 4 },
  studentRowText: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '500' },
  allBadge: { fontSize: 11, fontWeight: '800', letterSpacing: 1 },
});

export default HomeScreen;
