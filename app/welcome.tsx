import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Dumbbell } from 'lucide-react-native';

export default function Welcome() {
  return (
    <LinearGradient
      colors={['#3f8efc', '#0d6efd']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Dumbbell size={64} color="white" />
          <Text style={styles.title}>Gainz</Text>
          <Text style={styles.subtitle}>Śledź swoją formę jak nigdy dotąd</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.buttonText}>Zaloguj się</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.registerButton]}
            onPress={() => router.push('/register')}
          >
            <Text style={[styles.buttonText, styles.registerButtonText]}>
              Zarejestruj się
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 48,
    fontFamily: 'Roboto-Bold',
    color: 'white',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#0d6efd',
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
  },
  registerButtonText: {
    color: 'white',
  },
});