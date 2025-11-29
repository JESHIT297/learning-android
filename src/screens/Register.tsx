/*
  Register.tsx
  React Native registration screen with fixes for bcryptjs in RN.

  Requisitos:
    npm install bcryptjs react-native-get-random-values
  Si usas Expo: expo install react-native-get-random-values

  Nota: para producción se recomienda no hashear contraseñas en el cliente.
*/

import 'react-native-get-random-values';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import bcrypt from 'bcryptjs';

// Fallback de emergencia para bcryptjs
if (!global.crypto || !global.crypto.getRandomValues) {
  bcrypt.setRandomFallback((len: number) => {
    const arr = new Array<number>(len);
    for (let i = 0; i < len; i++) arr[i] = Math.floor(Math.random() * 256);
    return arr;
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface RegisterProps {
  onBackToLogin?: () => void;
}

const Register: React.FC<RegisterProps> = ({ onBackToLogin }) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  // Estado para saber qué input está en foco ('' | 'firstname' | 'lastname' | ...)
  const [focused, setFocused] = useState<string>('');

  // Estado "touched" para mostrar mensajes de error solo después de interactuar
  const [touched, setTouched] = useState({
    firstname: false,
    lastname: false,
    mobile: false,
    email: false,
    password: false,
    confirm: false,
  });

  const resetForm = () => {
    setFirstname('');
    setLastname('');
    setMobile('');
    setEmail('');
    setPassword('');
    setConfirm('');
    setTouched({
      firstname: false,
      lastname: false,
      mobile: false,
      email: false,
      password: false,
      confirm: false,
    });
    Alert.alert('Formulario', 'El formulario ha sido limpiado. ');
  };

  // Validaciones por campo (devuelven string | null)
  const firstnameError = (): string | null => {
    if (!firstname.trim()) return 'Nombre requerido';
    return null;
  };
  const lastnameError = (): string | null => {
    if (!lastname.trim()) return 'Apellido requerido';
    return null;
  };
  const mobileError = (): string | null => {
    if (!mobile.trim()) return 'Número móvil requerido';
    // opcional: validar longitud o formato
    if (!/^\d{7,15}$/.test(mobile.trim())) return 'Número móvil inválido';
    return null;
  };
  const emailError = (): string | null => {
    if (!email.trim()) return 'Email requerido';
    if (!EMAIL_RE.test(email)) return 'Formato de email inválido';
    return null;
  };
  const passwordError = (): string | null => {
    if (!password) return 'Contraseña requerida';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return null;
  };
  const confirmError = (): string | null => {
    if (!confirm) return 'Confirma la contraseña';
    if (confirm !== password) return 'Las contraseñas no coinciden';
    return null;
  };

  // Validación global antes de enviar
  const validateAll = (): string | null => {
    const errs = [
      firstnameError(),
      lastnameError(),
      mobileError(),
      emailError(),
      passwordError(),
      confirmError(),
    ].filter(Boolean);
    return errs.length > 0 ? (errs[0] as string) : null;
  };

  const handleRegister = async () => {
    // marcar todos como touched para mostrar mensajes si el usuario intenta enviar sin tocar
    setTouched({
      firstname: true,
      lastname: true,
      mobile: true,
      email: true,
      password: true,
      confirm: true,
    });

    const err = validateAll();
    if (err) {
      Alert.alert('Validación', err);
      return;
    }

    try {
      setLoading(true);
      const passwordStr = String(password);

      // Hash (nota: por seguridad ideal hacerlo en backend)
      const hashed = bcrypt.hashSync(passwordStr, 10);
      if (typeof hashed !== 'string' || hashed.length === 0) {
        throw new Error('Hash generation failed');
      }

      const nowIso = new Date().toISOString();
      const payload = {
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        mobile_number: mobile.trim(),
        email: email.trim().toLowerCase(),
        password: hashed,
        status: true,
        created_at: nowIso,
        updated_at: nowIso,
        deleted_at: null as any,
      };

      const { error } = await supabase.from('users').insert(payload);
      if (error) throw error;

      Alert.alert('Success', 'User registered successfully', [
        { text: 'OK', onPress: () => onBackToLogin?.() }
      ]);
      resetForm();
    } catch (e) {
      const s = (e as PostgrestError)?.message || (e as Error)?.message || 'Unknown error';
      console.error('Registration failed stack:', e);
      Alert.alert('Registration failed', s);
    } finally {
      setLoading(false);
    }
  };

  // Helper para estilos dinámicos de borderColor cuando está en foco
  const inputBorderColor = (name: string) =>
    focused === name ? styles.inputFocus.borderColor : styles.input.borderColor;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Create account</Text>

          <View style={styles.row}>
            <View style={[styles.inputWrap, { marginRight: 6 }]}>
              <Text style={styles.label}>Firstname</Text>
              <TextInput
                value={firstname}
                onChangeText={setFirstname}
                placeholder="Marlon"
                placeholderTextColor="#FFFFFF99"
                autoCapitalize="words"
                style={[styles.input, { borderColor: inputBorderColor('firstname') }]}
                onFocus={() => setFocused('firstname')}
                onBlur={() => {
                  setFocused('');
                  setTouched((t) => ({ ...t, firstname: true }));
                }}
              />
              {touched.firstname && firstnameError() ? (
                <Text style={styles.errorText}>{firstnameError()}</Text>
              ) : null}
            </View>

            <View style={[styles.inputWrap, { marginLeft: 6 }]}>
              <Text style={styles.label}>Lastname</Text>
              <TextInput
                value={lastname}
                onChangeText={setLastname}
                placeholder="Lopes"
                placeholderTextColor="#FFFFFF99"
                autoCapitalize="words"
                style={[styles.input, { borderColor: inputBorderColor('lastname') }]}
                onFocus={() => setFocused('lastname')}
                onBlur={() => {
                  setFocused('');
                  setTouched((t) => ({ ...t, lastname: true }));
                }}
              />
              {touched.lastname && lastnameError() ? (
                <Text style={styles.errorText}>{lastnameError()}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>Mobile number</Text>
            <TextInput
              value={mobile}
              onChangeText={setMobile}
              placeholder="3104550857"
              placeholderTextColor="#FFFFFF99"
              keyboardType="phone-pad"
              style={[styles.input, { borderColor: inputBorderColor('mobile') }]}
              onFocus={() => setFocused('mobile')}
              onBlur={() => {
                setFocused('');
                setTouched((t) => ({ ...t, mobile: true }));
              }}
            />
            {touched.mobile && mobileError() ? (
              <Text style={styles.errorText}>{mobileError()}</Text>
            ) : null}
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="marlonjeshitlopesarmero@gmail.com"
              placeholderTextColor="#FFFFFF99"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={[styles.input, { borderColor: inputBorderColor('email') }]}
              onFocus={() => setFocused('email')}
              onBlur={() => {
                setFocused('');
                setTouched((t) => ({ ...t, email: true }));
              }}
            />
            {touched.email && emailError() ? (
              <Text style={styles.errorText}>{emailError()}</Text>
            ) : null}
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#FFFFFF99"
              secureTextEntry
              style={[styles.input, { borderColor: inputBorderColor('password') }]}
              onFocus={() => setFocused('password')}
              onBlur={() => {
                setFocused('');
                setTouched((t) => ({ ...t, password: true }));
              }}
            />
            {touched.password && passwordError() ? (
              <Text style={styles.errorText}>{passwordError()}</Text>
            ) : null}
          </View>

          <View style={styles.inputWrap}>
            <Text style={styles.label}>Confirm password</Text>
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              placeholder="••••••••"
              placeholderTextColor="#FFFFFF99"
              secureTextEntry
              style={[styles.input, { borderColor: inputBorderColor('confirm') }]}
              onFocus={() => setFocused('confirm')}
              onBlur={() => {
                setFocused('');
                setTouched((t) => ({ ...t, confirm: true }));
              }}
            />
            {touched.confirm && confirmError() ? (
              <Text style={styles.errorText}>{confirmError()}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#0b1421" /> : <Text style={styles.buttonText}>Register</Text>}
          </TouchableOpacity>

          <View style={{ marginTop: 12, alignItems: 'center' }}>
            <Text style={styles.helper}>
              Already have an account?{' '}
              <Text style={styles.link} onPress={onBackToLogin}>
                Sign in
              </Text>
            </Text>
          </View>

          <Text style={styles.helperSmall}>
            By registering you accept our terms and privacy policy.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  inputWrap: {
    flex: 1,
    marginVertical: 6,
  },
  label: {
    color: '#cbd5e1',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: 'white',
  },
  // Estilo cuando el input está en foco
  inputFocus: {
    borderColor: '#16a34a', // verde
  },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#0b1421',
    fontWeight: '700',
    fontSize: 16,
  },
  helper: {
    color: '#9ca3af',
    textAlign: 'center',
  },
  helperSmall: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 12,
  },
  link: {
    color: '#93c5fd',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#f87171', // rojo claro para errores
    marginTop: 6,
    fontSize: 13,
  },
});

export default Register;
