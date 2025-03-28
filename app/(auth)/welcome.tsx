import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Dumbbell } from 'lucide-react-native';
import Animated, { 
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function Welcome() {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop' }}
      style={styles.background}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
        style={styles.container}
      >
        <View style={styles.content}>
          <Animated.View 
            entering={FadeIn.delay(300)}
            style={styles.logoContainer}
          >
            <View style={styles.iconContainer}>
              <Dumbbell size={64} color="white" strokeWidth={1.5} />
            </View>
            <Animated.Text 
              entering={FadeInDown.delay(600)}
              style={styles.title}
            >
              GAINZ
            </Animated.Text>
            <Animated.Text 
              entering={FadeInDown.delay(900)}
              style={styles.subtitle}
            >
              Śledź swoją formę jak nigdy dotąd
            </Animated.Text>
          </Animated.View>

          <View style={styles.buttonContainer}>
            <AnimatedTouchableOpacity 
              entering={FadeInUp.delay(1200)}
              style={styles.button}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.buttonText}>Zaloguj się</Text>
            </AnimatedTouchableOpacity>

            <AnimatedTouchableOpacity 
              entering={FadeInUp.delay(1400)}
              style={[styles.button, styles.registerButton]}
              onPress={() => router.push('/register')}
            >
              <Text style={[styles.buttonText, styles.registerButtonText]}>
                Zarejestruj się
              </Text>
            </AnimatedTouchableOpacity>
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
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 20,
  },
  title: {
    fontSize: 64,
    fontFamily: 'Roboto-Bold',
    color: 'white',
    letterSpacing: 4,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    maxWidth: '80%',
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium',
    color: '#000',
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  registerButtonText: {
    color: 'white',
  },
});