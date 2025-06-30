// ✅ app/login.tsx
import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { API_URL } from '../constants/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const router = useRouter();

  const handleLogin = async () => {
    try {
      console.log('API_URL:', API_URL);
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password }),
        


      });

      const data = await response.json();
      console.log('→ Réponse du serveur :', data);

      if (!response.ok) {
        Alert.alert('Erreur', data.message || 'Échec de la connexion');
        return;
      }

      await AsyncStorage.setItem('token', data.token);
      router.replace('/(tabs)/explore');
    } catch (err) {
      Alert.alert('Erreur', 'Impossible de se connecter au serveur');
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Connexion</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button  title="Se connecter" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  backButton: { position: 'absolute', top: 50, left: 20 },
  backText: { fontSize: 16, color: '#8e24aa' },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#8e24aa',
  },
  input: {
    borderWidth: 1, borderColor: '#ccc',
    borderRadius: 8, padding: 10, marginBottom: 15
  }
});