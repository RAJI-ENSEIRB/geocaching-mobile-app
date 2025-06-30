// app/login-register.tsx
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function LoginRegisterChoice() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome !</Text>
      <Text style={styles.subtitle}>Connecte-toi ou crée un compte</Text>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => router.push('/login')}
      >
        Se connecter
      </Button>
      <Button
        mode="outlined"
        style={styles.button}
        onPress={() => router.push('/register')}
      >
        S'inscrire
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#8e24aa',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    marginVertical: 8,
  },
});
