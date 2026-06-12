import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';


const LoginScreen = () => {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signOut(); // clear cached account for fresh pick
      await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();
      if (!idToken) throw new Error('Google Sign-In failed — no token received');

      const credential = GoogleAuthProvider.credential(idToken);
      const fbUser = await signInWithCredential(auth, credential);
      const firebaseToken = await fbUser.user.getIdToken();
      const gmail = fbUser.user.email ?? '';
      const photo = fbUser.user.photoURL ?? undefined;
      // Use Google display name directly — no username prompt needed
      const displayName = fbUser.user.displayName ?? gmail.split('@')[0];

      await signIn(firebaseToken, gmail, displayName, photo);
    } catch (err: any) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) return;
      if (err.code === statusCodes.IN_PROGRESS) return;
      if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services not available on this device');
        return;
      }
      Alert.alert('Sign In Failed', err.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1a0000', '#0A0A0A', '#0A0A0A']} style={s.container}>
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.logoWrap}>
          <View style={s.logoBox}>
            <Ionicons name="school-outline" size={64} color="#E53935" />
          </View>
        </View>
        <Text style={s.appName}>Assignment Tracker</Text>
        <Text style={s.subtitle}>Manage student assignments efficiently</Text>

        <View style={s.card}>
          <TouchableOpacity style={s.googleBtn} onPress={handleGoogleSignIn} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : (
                <>
                  <Ionicons name="logo-google" size={22} color="#fff" style={{ marginRight: 12 }} />
                  <Text style={s.googleText}>Continue with Google</Text>
                </>
              )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const s = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  logoWrap: { marginBottom: 24 },
  logoBox: {
    width: 120, height: 120, borderRadius: 30, backgroundColor: '#1a0000',
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#E53935',
  },
  appName: { color: '#fff', fontSize: 30, fontWeight: '800', letterSpacing: 1, textAlign: 'center' },
  subtitle: {
    color: colors.textSecondary, fontSize: 14, textAlign: 'center',
    marginTop: 8, marginBottom: 40,
  },
  card: {
    width: '100%', backgroundColor: colors.surface, borderRadius: 20,
    padding: 24, borderWidth: 1, borderColor: colors.border,
  },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#E53935', borderRadius: 12, paddingVertical: 14,
  },
  googleText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

export default LoginScreen;
