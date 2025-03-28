import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ImageBackground, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuthStore } from '@/stores/auth';
import { ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const register = useAuthStore((state) => state.register);

  const handleRegister = async () => {
    try {
      setError('');

      if (password.length < 6) {
        setError('Hasło musi mieć minimum 6 znaków');
        return;
      }

      if (password !== confirmPassword) {
        setError('Hasła nie są takie same');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Niepoprawny format emaila');
        return;
      }

      await register(name, email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError('Wystąpił błąd podczas rejestracji');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=2070&auto=format&fit=crop' }}
      style={styles.background}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Zarejestruj się</Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Imię</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Wprowadź imię"
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Wprowadź email"
                placeholderTextColor="rgba(255,255,255,0.5)"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Hasło</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Minimum 6 znaków"
                placeholderTextColor="rgba(255,255,255,0.5)"
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Potwierdź hasło</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Powtórz hasło"
                placeholderTextColor="rgba(255,255,255,0.5)"
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
            >
              <Text style={styles.buttonText}>Zarejestruj się</Text>
            </TouchableOpacity>

            <View style={styles.linkContainer}>
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>
                    Masz już konto? <Text style={styles.linkTextBold}>Zaloguj się</Text>
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
  error: {
    color: '#ff4444',
    marginBottom: 20,
    fontFamily: 'Roboto-Regular',
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: 'rgba(255,255,255,0.8)',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Roboto-Regular',
    color: 'white',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
  },
  linkContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  linkTextBold: {
    fontFamily: 'Roboto-Bold',
    color: 'white',
  },
});