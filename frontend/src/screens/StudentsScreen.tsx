import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert, RefreshControl, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useStudents } from '../hooks/useStudents';
import { studentService } from '../services/studentService';
import { colors } from '../theme';
import { exportStudentListPDF } from '../utils/pdf';
import StudentCard from '../components/StudentCard';
import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';
import EmptyState from '../components/EmptyState';

const StudentsScreen = () => {
  const { theme } = useTheme();
  const { students, isLoading, fetchStudents } = useStudents();
  const [showAdd, setShowAdd] = useState(false);
  const [showInitial, setShowInitial] = useState(false);
  const [name, setName] = useState('');
  const [initial, setInitial] = useState('');
  const [nameErr, setNameErr] = useState('');
  const [initErr, setInitErr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pendingName, setPendingName] = useState('');

  useEffect(() => { fetchStudents(); }, []);

  const handleAdd = async () => {
    if (!name.trim() || name.trim().length < 2) { setNameErr('Name must be at least 2 characters'); return; }
    setSubmitting(true);
    try {
      await studentService.createStudent({ name: name.trim() });
      setName(''); setShowAdd(false);
      fetchStudents();
    } catch (err: any) {
      if (err.message === 'DUPLICATE_NAME') {
        setPendingName(name.trim()); setShowAdd(false); setShowInitial(true);
      } else { Alert.alert('Error', err.message); }
    } finally { setSubmitting(false); }
  };

  const handleAddWithInitial = async () => {
    if (!initial.trim()) { setInitErr('Initial is required'); return; }
    setSubmitting(true);
    try {
      await studentService.createStudent({ name: pendingName, initial: initial.trim() });
      setInitial(''); setShowInitial(false);
      fetchStudents();
    } catch (err: any) { Alert.alert('Error', err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <View>
          <Text style={s.title}>Students</Text>
          <Text style={s.subtitle}>{students.length} registered</Text>
        </View>
        <TouchableOpacity onPress={() => exportStudentListPDF(students)} style={s.exportBtn}>
          <Ionicons name="document-text-outline" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={students}
        keyExtractor={i => i._id}
        renderItem={({ item }) => <StudentCard student={item} />}
        contentContainerStyle={s.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchStudents} tintColor={theme.primary} />}
        ListEmptyComponent={!isLoading ? <EmptyState icon="people-outline" title="No students yet" subtitle="Tap the + button to register your first student" /> : null}
      />

      <TouchableOpacity style={[s.fab, { backgroundColor: theme.primary }]} onPress={() => setShowAdd(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal visible={showAdd} transparent animationType="fade">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Register Student</Text>
            <InputField label="Student Name" value={name} onChangeText={t => { setName(t); setNameErr(''); }} placeholder="e.g. John Smith" error={nameErr} autoFocus />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <GradientButton title="Cancel" onPress={() => { setShowAdd(false); setName(''); }} variant="outline" style={{ flex: 1 }} />
              <GradientButton title="Add" onPress={handleAdd} loading={submitting} style={{ flex: 1 }} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={showInitial} transparent animationType="fade">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.overlay}>
          <View style={s.modal}>
            <Ionicons name="warning-outline" size={32} color="#FFA726" style={{ marginBottom: 8 }} />
            <Text style={s.modalTitle}>Student Already Exists</Text>
            <Text style={s.modalSub}>"{pendingName}" already exists. Add an initial to differentiate.</Text>
            <Text style={s.example}>Example: John A, John B</Text>
            <InputField label="Initial" value={initial} onChangeText={t => { setInitial(t); setInitErr(''); }} placeholder="e.g. A" error={initErr} autoFocus maxLength={3} />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <GradientButton title="Cancel" onPress={() => { setShowInitial(false); setInitial(''); }} variant="outline" style={{ flex: 1 }} />
              <GradientButton title="Add" onPress={handleAddWithInitial} loading={submitting} style={{ flex: 1 }} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 16, paddingBottom: 8 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800' },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: 2 },
  exportBtn: { padding: 8, backgroundColor: colors.surface, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  fab: { position: 'absolute', right: 20, bottom: 90, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: colors.surface, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: colors.border },
  modalTitle: { color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 6 },
  modalSub: { color: colors.textSecondary, fontSize: 14, marginBottom: 6 },
  example: { color: colors.textMuted, fontSize: 12, marginBottom: 16, fontStyle: 'italic' },
});

export default StudentsScreen;
