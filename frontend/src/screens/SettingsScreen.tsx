import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView, KeyboardAvoidingView, Platform, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signOut as fbSignOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useStudents } from '../hooks/useStudents';
import { authService } from '../services/authService';
import { themes, colors } from '../theme';
import { ThemeKey } from '../types';
import { checkDevPassword } from '../utils/helpers';
import InputField from '../components/InputField';
import GradientButton from '../components/GradientButton';
import { auth } from '../config/firebase';

const SettingsScreen = () => {
  const { user, signOut, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { students, fetchStudents, deleteStudent } = useStudents();

  const [showEdit, setShowEdit] = useState(false);
  const [showDevLogin, setShowDevLogin] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [usernameErr, setUsernameErr] = useState('');
  const [devPwd, setDevPwd] = useState('');
  const [devErr, setDevErr] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const tapCount = useRef(0);
  const tapTimer = useRef<any>(null);

  const onDevTap = () => {
    tapCount.current += 1;
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 2000);
    if (tapCount.current >= 5) { tapCount.current = 0; setShowDevLogin(true); }
  };

  const handleUpdateUsername = async () => {
    if (!username.trim() || username.trim().length < 2) { setUsernameErr('At least 2 characters'); return; }
    setSubmitting(true);
    try {
      const res = await authService.updateUsername(username.trim());
      updateUser(res.user);
      setShowEdit(false);
      Alert.alert('Success', 'Username updated');
    } catch (err: any) { Alert.alert('Error', err.message); }
    finally { setSubmitting(false); }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        try {
          await GoogleSignin.revokeAccess();
          await fbSignOut(auth);
        } catch {}
        await signOut();
      }},
    ]);
  };

  const handleDevLogin = () => {
    if (checkDevPassword(devPwd)) {
      setShowDevLogin(false); setDevPwd(''); setDevErr('');
      fetchStudents();
      setShowDevPanel(true);
    } else { setDevErr('Incorrect password'); }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Student', `Delete ${name}?\n\nThis cannot be undone. All assignments will be permanently removed.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try { await deleteStudent(id); } catch (err: any) { Alert.alert('Error', err.message); }
      }},
    ]);
  };

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <ScrollView style={s.scroll} contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={s.title}>Settings</Text>

        <Text style={s.sec}>Account</Text>
        <View style={s.profileCard}>
          {user?.profilePhoto
            ? <Image source={{ uri: user.profilePhoto }} style={s.avatar} />
            : <View style={[s.avatarPlaceholder, { backgroundColor: theme.primary + '33' }]}><Ionicons name="person" size={28} color={theme.primary} /></View>
          }
          <View style={s.profileInfo}>
            <Text style={s.profileName}>{user?.username}</Text>
            <Text style={s.profileEmail}>{user?.gmail}</Text>
          </View>
          <TouchableOpacity onPress={() => { setUsername(user?.username || ''); setShowEdit(true); }}>
            <Ionicons name="pencil-outline" size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <Text style={s.sec}>Theme</Text>
        <View style={s.themeGrid}>
          {(Object.keys(themes) as ThemeKey[]).map(key => {
            const t = themes[key];
            return (
              <TouchableOpacity key={key} style={[s.themeBtn, theme.key === key && { borderColor: t.primary, borderWidth: 2 }]} onPress={() => setTheme(key)}>
                <View style={[s.themeColor, { backgroundColor: t.primary }]} />
                <Text style={s.themeLabel}>{t.label}</Text>
                {theme.key === key && <Ionicons name="checkmark-circle" size={16} color={t.primary} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={s.sec}>Actions</Text>
        <TouchableOpacity style={s.actionRow} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <Text style={[s.actionText, { color: colors.error }]}>Sign Out</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.devTag} onPress={onDevTap} activeOpacity={1}>
          <Text style={s.devText}>Developed by Shiyam</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showEdit} transparent animationType="fade">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Edit Username</Text>
            <InputField label="Username" value={username} onChangeText={t => { setUsername(t); setUsernameErr(''); }} error={usernameErr} autoFocus />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <GradientButton title="Cancel" onPress={() => setShowEdit(false)} variant="outline" style={{ flex: 1 }} />
              <GradientButton title="Save" onPress={handleUpdateUsername} loading={submitting} style={{ flex: 1 }} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={showDevLogin} transparent animationType="fade">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.overlay}>
          <View style={s.modal}>
            <Ionicons name="code-slash-outline" size={32} color={theme.primary} style={{ marginBottom: 8 }} />
            <Text style={s.modalTitle}>Developer Access</Text>
            <InputField label="Password" value={devPwd} onChangeText={t => { setDevPwd(t); setDevErr(''); }} secureTextEntry error={devErr} autoFocus />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <GradientButton title="Cancel" onPress={() => { setShowDevLogin(false); setDevPwd(''); setDevErr(''); }} variant="outline" style={{ flex: 1 }} />
              <GradientButton title="Enter" onPress={handleDevLogin} style={{ flex: 1 }} />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={showDevPanel} transparent animationType="slide">
        <SafeAreaView style={s.devPanel}>
          <View style={s.devHead}>
            <Text style={s.devPanelTitle}>Student Management</Text>
            <TouchableOpacity onPress={() => setShowDevPanel(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <Text style={s.devSub}>{students.length} students</Text>
          <FlatList
            data={students}
            keyExtractor={i => i._id}
            renderItem={({ item }) => (
              <View style={s.devRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.devName}>{item.name}{item.initial ? ' '+item.initial : ''}</Text>
                  <Text style={s.devMeta}>{item.assignmentCount ?? 0} assignments</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item._id, item.name)} style={s.delBtn}>
                  <Ionicons name="trash" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1, padding: 16 },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginBottom: 24 },
  sec: { color: colors.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 14, marginBottom: 24 },
  avatar: { width: 54, height: 54, borderRadius: 27 },
  avatarPlaceholder: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  profileInfo: { flex: 1 },
  profileName: { color: colors.text, fontSize: 17, fontWeight: '700' },
  profileEmail: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  themeGrid: { gap: 8, marginBottom: 24 },
  themeBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border, gap: 12 },
  themeColor: { width: 22, height: 22, borderRadius: 11 },
  themeLabel: { flex: 1, color: colors.text, fontSize: 15 },
  actionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 12, marginBottom: 24 },
  actionText: { fontSize: 16, fontWeight: '600' },
  devTag: { alignItems: 'center', paddingVertical: 24 },
  devText: { color: colors.textMuted, fontSize: 13 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: colors.surface, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: colors.border },
  modalTitle: { color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 16 },
  devPanel: { flex: 1, backgroundColor: colors.background },
  devHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  devPanelTitle: { color: colors.text, fontSize: 20, fontWeight: '700' },
  devSub: { color: colors.textSecondary, fontSize: 13, paddingHorizontal: 16, marginBottom: 12 },
  devRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  devName: { color: colors.text, fontSize: 15, fontWeight: '600' },
  devMeta: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  delBtn: { padding: 8 },
});

export default SettingsScreen;
